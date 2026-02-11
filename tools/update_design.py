#!/usr/bin/env python3
"""
横断的デザイン変更ツール (update_design.py)

data-section 属性を基準に、複数の記事 HTML ファイルにまたがって
セクション単位でCSSクラス・属性を一括変更する。

標準ライブラリのみで動作（外部パッケージ不要）。
get_starttag_text() を利用して元の属性フォーマットを最大限保持する。

使用例:
  # contentセクション自体のクラス変更（ドライラン）
  python3 tools/update_design.py --section content --target self \\
      --replace-class bg-white bg-gray-50 --dry-run

  # 全記事のintroセクション内h2のテキスト色を変更
  python3 tools/update_design.py --section intro --target h2 \\
      --replace-class text-blue-700 text-indigo-700

  # data-content-type=risks のセクションのみ対象
  python3 tools/update_design.py --section content --content-type risks \\
      --target self --add-class border-red-300

  # 複数クラスを同時に変更
  python3 tools/update_design.py --section content --target self \\
      --remove-class border-gray-200 --add-class border-gray-100 shadow-sm

  # 特定ファイルのみ
  python3 tools/update_design.py --section intro --target self --add-class shadow-sm \\
      --files articles/what-is-sideloading.html articles/safety-guide.html

  # セクション一覧確認
  python3 tools/update_design.py --section content --list-sections
"""

import argparse
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from typing import List, Optional, Tuple, Dict

# -----------------------------------------------------------------------
# 定数
# -----------------------------------------------------------------------

BASE_DIR = Path(__file__).parent.parent
ARTICLES_DIR = BASE_DIR / "articles"

SECTION_TYPES = [
    "header", "intro", "content", "faq",
    "summary", "recommendation", "metadata",
]

VOID_ELEMENTS = frozenset([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
])


# -----------------------------------------------------------------------
# クラス変更ユーティリティ
# -----------------------------------------------------------------------

def apply_class_changes(
    class_str: str,
    add: List[str],
    remove: List[str],
    replace: List[Tuple[str, str]],
) -> Optional[Tuple[List[str], List[str]]]:
    """
    クラス文字列に変更を適用する。
    変更があれば (before_list, after_list) を返す。変更なしなら None。
    """
    classes = class_str.split() if class_str else []
    original = list(classes)

    for cls in remove:
        if cls in classes:
            classes.remove(cls)

    for cls in add:
        if cls not in classes:
            classes.append(cls)

    for old_cls, new_cls in replace:
        if old_cls in classes:
            idx = classes.index(old_cls)
            classes[idx] = new_cls

    if classes == original:
        return None
    return original, classes


def modify_tag_html(
    tag_html: str,
    attrs_dict: Dict[str, str],
    add_classes: List[str],
    remove_classes: List[str],
    replace_classes: List[Tuple[str, str]],
    attr_changes: List[Tuple[str, str, str]],
) -> Tuple[str, List[Tuple[str, str, str]]]:
    """
    開始タグの HTML 文字列に変更を適用する。
    戻り値: (変更後のタグHTML, [(属性名, before, after), ...])
    変更がなければ元のタグHTMLと空リストを返す。
    """
    modified = tag_html
    changes = []

    # クラス変更
    result = apply_class_changes(attrs_dict.get("class", ""), add_classes, remove_classes, replace_classes)
    if result is not None:
        before, after = result
        new_class = " ".join(after)
        # class="..." を in-place で置換（元の引用符スタイルを保持）
        new_modified, n = re.subn(r'\bclass="[^"]*"', f'class="{new_class}"', modified, count=1)
        if n == 0:
            new_modified, n = re.subn(r"\bclass='[^']*'", f"class='{new_class}'", modified, count=1)
        if n == 0 and add_classes:
            # class属性が存在しない場合、閉じ括弧の直前に挿入
            new_modified = modified.rstrip()
            if new_modified.endswith("/>"):
                new_modified = new_modified[:-2] + f' class="{new_class}"/>'
            elif new_modified.endswith(">"):
                new_modified = new_modified[:-1] + f' class="{new_class}">'
        if n > 0 or (n == 0 and add_classes):
            modified = new_modified
            changes.append(("class", " ".join(before), new_class))

    # 任意属性の値変更
    for attr_name, old_val, new_val in attr_changes:
        current = attrs_dict.get(attr_name)
        if current == old_val:
            # attr="old_val" 形式を検索・置換
            pattern = rf'\b{re.escape(attr_name)}="[^"]*"'
            replacement = f'{attr_name}="{new_val}"'
            new_modified, n = re.subn(pattern, replacement, modified, count=1)
            if n == 0:
                pattern2 = rf"\b{re.escape(attr_name)}='[^']*'"
                replacement2 = f"{attr_name}='{new_val}'"
                new_modified, n = re.subn(pattern2, replacement2, modified, count=1)
            if n > 0:
                modified = new_modified
                changes.append((attr_name, old_val, new_val))

    return modified, changes


# -----------------------------------------------------------------------
# セレクタのマッチング
# -----------------------------------------------------------------------

def matches_selector(tag: str, attrs_dict: Dict[str, str], selector: str, is_root: bool) -> bool:
    """
    セレクタがこの要素にマッチするか判定する。
    サポートする形式:
      self              → セクションのルート要素自身
      h2                → タグ名
      h2.some-class     → タグ名 + クラス名
      .some-class       → クラス名のみ
    """
    if selector == "self":
        return is_root
    if "." in selector:
        parts = selector.split(".", 1)
        tag_part, class_part = parts
        if tag_part and tag_part != tag:
            return False
        classes = attrs_dict.get("class", "").split()
        return class_part in classes
    return tag == selector


# -----------------------------------------------------------------------
# HTMLトランスフォーマー
# -----------------------------------------------------------------------

class SectionTransformer(HTMLParser):
    """
    HTML をストリーム処理しながら、指定セクション内の対象要素の
    class・属性を変更して出力する。

    get_starttag_text() で取得した元のタグテキストを直接置換するため、
    属性の順序・引用符スタイル等が最大限保持される。
    """

    def __init__(
        self,
        section_type: str,
        content_type: Optional[str],
        target_selector: str,
        add_classes: List[str],
        remove_classes: List[str],
        replace_classes: List[Tuple[str, str]],
        attr_changes: List[Tuple[str, str, str]],
    ):
        super().__init__(convert_charrefs=False)
        self._section_type = section_type
        self._content_type = content_type
        self._target_selector = target_selector
        self._add_classes = add_classes
        self._remove_classes = remove_classes
        self._replace_classes = replace_classes
        self._attr_changes = attr_changes

        self._html: str = ""
        self._pos: int = 0
        self._output: List[str] = []

        # セクションスタック: (section_type, content_type, depth_at_entry)
        self._section_stack: List[Tuple[str, Optional[str], int]] = []
        self._depth: int = 0

        # 変更ログ: (element_id_or_tag, attr, before, after)
        self.changes: List[Tuple[str, str, str, str]] = []

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def transform(self, html: str) -> str:
        """HTML を変換して返す"""
        self._html = html
        self._pos = 0
        self._output = []
        self._section_stack = []
        self._depth = 0
        self.changes = []
        self.feed(html)
        self._flush_remaining()
        return "".join(self._output)

    # ------------------------------------------------------------------
    # 内部ヘルパー
    # ------------------------------------------------------------------

    def _in_target_section(self) -> bool:
        for sect_type, sect_ct, _ in self._section_stack:
            if sect_type == self._section_type:
                if self._content_type is None or sect_ct == self._content_type:
                    return True
        return False

    def _advance_pos_to(self, text: str) -> int:
        """text を self._pos 以降で検索し、見つかった位置を返す（-1 なら未発見）"""
        pos = self._html.find(text, self._pos)
        if pos == -1:
            return -1
        self._output.append(self._html[self._pos:pos])
        self._pos = pos
        return pos

    def _emit(self, text: str) -> None:
        self._output.append(text)
        self._pos += len(text)

    def _flush_remaining(self) -> None:
        self._output.append(self._html[self._pos:])

    # ------------------------------------------------------------------
    # HTMLParser ハンドラ
    # ------------------------------------------------------------------

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        starttag_text = self.get_starttag_text()
        if not starttag_text:
            return

        # セクション追跡: セクション開始を検出してスタックに積む
        section_attr = attrs_dict.get("data-section")
        is_root = False
        if section_attr == self._section_type:
            sect_ct = attrs_dict.get("data-content-type")
            if self._content_type is None or sect_ct == self._content_type:
                self._section_stack.append((section_attr, sect_ct, self._depth))
                is_root = True

        # 深さを更新（void 要素は閉じタグがないので増やさない）
        if tag not in VOID_ELEMENTS:
            self._depth += 1

        # --- 変更を適用するかどうか判断 ---
        pos = self._advance_pos_to(starttag_text)
        if pos == -1:
            return

        should_modify = (
            self._in_target_section()
            and matches_selector(tag, attrs_dict, self._target_selector, is_root)
        )

        if should_modify:
            el_id = attrs_dict.get("id", tag)
            modified_tag, tag_changes = modify_tag_html(
                starttag_text, attrs_dict,
                self._add_classes, self._remove_classes, self._replace_classes,
                self._attr_changes,
            )
            self._output.append(modified_tag)
            for attr_name, before, after in tag_changes:
                self.changes.append((el_id, attr_name, before, after))
        else:
            self._output.append(starttag_text)

        # 常に元のタグ長だけ進める（変更後タグの長さとは無関係）
        self._pos = pos + len(starttag_text)

    def handle_endtag(self, tag):
        if tag in VOID_ELEMENTS:
            return
        endtag = f"</{tag}>"
        pos = self._advance_pos_to(endtag)
        if pos == -1:
            return
        self._emit(endtag)

        self._depth -= 1
        # セクション終了を検出
        if (self._section_stack and self._section_stack[-1][2] == self._depth):
            self._section_stack.pop()

    # handle_data / handle_comment 等は不要
    # (_advance_pos_to でテキストをそのままスライスして出力するため)
    def handle_data(self, data): pass
    def handle_comment(self, data): pass
    def handle_decl(self, decl): pass
    def handle_entityref(self, name): pass
    def handle_charref(self, name): pass
    def handle_pi(self, data): pass


# -----------------------------------------------------------------------
# ファイル操作
# -----------------------------------------------------------------------

def get_article_files(file_args: Optional[List[str]]) -> List[Path]:
    if file_args:
        return [Path(f).resolve() for f in file_args]
    return sorted(
        f for f in ARTICLES_DIR.glob("*.html") if f.name != "index.html"
    )


def process_file(
    filepath: Path,
    transformer: SectionTransformer,
    dry_run: bool,
) -> int:
    """1ファイルを処理。変更箇所数を返す"""
    text = filepath.read_text(encoding="utf-8")

    # transformer を再利用するために状態をリセットして変換
    result = transformer.transform(text)
    changes = list(transformer.changes)

    if not changes:
        return 0

    rel = filepath.relative_to(BASE_DIR)
    prefix = "[DRY RUN] " if dry_run else ""
    print(f"\n{prefix}{rel}")
    for el_id, attr_name, before, after in changes:
        print(f"  [{el_id}] {attr_name}:")
        print(f"    Before: {before}")
        print(f"    After : {after}")

    if not dry_run:
        filepath.write_text(result, encoding="utf-8")
        print(f"  -> 保存完了")

    return len(changes)


# -----------------------------------------------------------------------
# セクション一覧表示（--list-sections）
# -----------------------------------------------------------------------

class SectionLister(HTMLParser):
    def __init__(self, section_type, content_type=None):
        super().__init__(convert_charrefs=False)
        self._section_type = section_type
        self._content_type = content_type
        self.found = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if attrs_dict.get("data-section") == self._section_type:
            ct = attrs_dict.get("data-content-type", "")
            if self._content_type is None or ct == self._content_type:
                self.found.append({
                    "id": attrs_dict.get("id", "(no id)"),
                    "data-content-type": ct,
                    "class": attrs_dict.get("class", ""),
                })


def list_sections_across_files(
    files: List[Path],
    section_type: str,
    content_type: Optional[str],
) -> None:
    print(f"\nセクション '{section_type}'"
          + (f" [content-type={content_type}]" if content_type else "")
          + " の一覧:\n")
    for f in files:
        html = f.read_text(encoding="utf-8")
        lister = SectionLister(section_type, content_type)
        lister.feed(html)
        if lister.found:
            print(f"  {f.relative_to(BASE_DIR)}")
            for s in lister.found:
                ct_str = f"  [content-type={s['data-content-type']}]" if s["data-content-type"] else ""
                print(f"    #{s['id']}{ct_str}")
                print(f"      class: {s['class']}")


# -----------------------------------------------------------------------
# メイン
# -----------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="記事 HTML のセクション単位で横断的にデザイン変更を行うツール",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  # contentセクション自体のbg-whiteをbg-gray-50に変更（ドライラン）
  python3 tools/update_design.py --section content --target self \\
      --replace-class bg-white bg-gray-50 --dry-run

  # 全記事のintroセクション内h2のテキスト色を変更
  python3 tools/update_design.py --section intro --target h2 \\
      --replace-class text-blue-700 text-indigo-700

  # data-content-type=risks のセクションにボーダー色を追加
  python3 tools/update_design.py --section content --content-type risks \\
      --target self --add-class border-red-300

  # セクションの現在のクラス一覧を確認
  python3 tools/update_design.py --section intro --list-sections

  # 複数クラスを同時に変更
  python3 tools/update_design.py --section summary --target self \\
      --remove-class border-gray-200 --add-class border-blue-200 shadow-sm

  # 特定ファイルのみ変更
  python3 tools/update_design.py --section header --target self \\
      --replace-class bg-gradient-to-br bg-gradient-to-r \\
      --files articles/what-is-sideloading.html
""",
    )

    parser.add_argument(
        "--section", required=True, choices=SECTION_TYPES,
        help="対象セクション (data-section 属性値)",
    )
    parser.add_argument(
        "--content-type", metavar="TYPE",
        help="content セクションを data-content-type でさらに絞り込む",
    )
    parser.add_argument(
        "--target", default="self", metavar="SELECTOR",
        help=(
            "変更対象要素。'self'=セクション自体 / "
            "タグ名 (h2, h3, span) / "
            "タグ名+クラス (span.material-symbols-outlined) / "
            "クラスのみ (.some-class)。デフォルト: self"
        ),
    )

    cls_g = parser.add_argument_group("クラス変更")
    cls_g.add_argument(
        "--add-class", nargs="+", metavar="CLASS", default=[],
        help="追加するCSSクラス（スペース区切りで複数可）",
    )
    cls_g.add_argument(
        "--remove-class", nargs="+", metavar="CLASS", default=[],
        help="削除するCSSクラス（スペース区切りで複数可）",
    )
    cls_g.add_argument(
        "--replace-class", nargs=2, metavar=("OLD", "NEW"),
        action="append", default=[],
        help="クラスを置換 (--replace-class old new)。複数指定可",
    )

    attr_g = parser.add_argument_group("属性変更")
    attr_g.add_argument(
        "--replace-attr", nargs=3, metavar=("ATTR", "OLD_VAL", "NEW_VAL"),
        action="append", default=[],
        help="属性値を置換 (--replace-attr attr old new)。複数指定可",
    )

    parser.add_argument(
        "--files", nargs="+", metavar="FILE",
        help="対象ファイルを指定（省略時は articles/*.html を全件対象）",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="変更内容をプレビューするだけで保存しない",
    )
    parser.add_argument(
        "--list-sections", action="store_true",
        help="対象セクションの現在のクラス一覧を表示して終了",
    )

    args = parser.parse_args()

    # 操作指定チェック（--list-sections 時は不要）
    if not args.list_sections:
        if not args.add_class and not args.remove_class and not args.replace_class and not args.replace_attr:
            parser.error(
                "--add-class / --remove-class / --replace-class / --replace-attr "
                "のいずれかを指定してください"
            )

    files = get_article_files(args.files)
    if not files:
        print("対象ファイルが見つかりません", file=sys.stderr)
        sys.exit(1)

    # セクション一覧表示モード
    if args.list_sections:
        list_sections_across_files(files, args.section, args.content_type)
        return

    replace_classes = [tuple(r) for r in args.replace_class]
    attr_changes = [tuple(a) for a in args.replace_attr]

    transformer = SectionTransformer(
        section_type=args.section,
        content_type=args.content_type,
        target_selector=args.target,
        add_classes=args.add_class,
        remove_classes=args.remove_class,
        replace_classes=replace_classes,
        attr_changes=attr_changes,
    )

    print(f"対象ファイル数: {len(files)}")
    if args.dry_run:
        print("[DRY RUN モード - ファイルへの書き込みはしません]")

    total_changes = 0
    changed_files = 0

    for filepath in files:
        if not filepath.exists():
            print(f"警告: {filepath} が見つかりません", file=sys.stderr)
            continue
        n = process_file(filepath, transformer, args.dry_run)
        if n > 0:
            changed_files += 1
            total_changes += n

    action = "変更予定" if args.dry_run else "変更完了"
    print(f"\n{action}: {changed_files} ファイル / {total_changes} 箇所")


if __name__ == "__main__":
    main()
