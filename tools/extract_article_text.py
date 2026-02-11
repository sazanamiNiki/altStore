#!/usr/bin/env python3
"""
articles_bk/ の HTML から <article> 内テキストを抽出し Markdown に変換するスクリプト。
- 見出し (h1〜h6) → Markdown 見出し
- p, li → テキストのみ
- table, img → HTML タグをそのまま保持
- その他装飾タグは無視してテキストを取り出す
"""

import sys
import os
import re
from html.parser import HTMLParser
from io import StringIO

# table/img はタグごと保持するブロックタグ
PRESERVE_TAGS = {"table", "img"}
# ブロックレベルタグ
BLOCK_TAGS = {"p", "li", "ul", "ol", "div", "section", "blockquote", "pre", "code", "br"}
HEADING_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6"}
SKIP_TAGS = {"script", "style", "noscript", "head"}
# テキストを無視するCSSクラス（MUIアイコン等）
SKIP_CLASS_KEYWORDS = {"material-symbols-outlined", "material-icons"}


class ArticleExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_article = False
        self.depth_article = 0

        # 保持タグの処理用
        self.preserve_depth = 0
        self.preserve_buf = StringIO()

        # スキップタグ
        self.skip_depth = 0

        # 見出し処理
        self.current_heading = None

        # 出力バッファ
        self.output_lines = []
        self.current_text = []

    # ---- ユーティリティ ----

    def _flush_text(self):
        text = "".join(self.current_text).strip()
        if text:
            self.output_lines.append(text)
            self.output_lines.append("")
        self.current_text = []

    def _append_raw(self, html):
        self._flush_text()
        self.output_lines.append(html)
        self.output_lines.append("")

    # ---- HTMLParser コールバック ----

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        # <article> の入り口
        if tag == "article":
            if not self.in_article:
                self.in_article = True
            self.depth_article += 1
            return

        if not self.in_article:
            return

        # スキップ対象（タグ名ベース）
        if tag in SKIP_TAGS:
            self.skip_depth += 1
            return

        # MUIアイコンなどスキップするCSSクラスを持つタグ
        classes = set(attrs_dict.get("class", "").split())
        if classes & SKIP_CLASS_KEYWORDS:
            self.skip_depth += 1
            return

        if self.skip_depth > 0:
            return

        # img は単独タグ（self-closing）なので preserve_depth を増やさず即出力
        if tag == "img":
            attr_str = " ".join(f'{k}="{v}"' for k, v in attrs)
            self._append_raw(f"<img {attr_str}>")
            return

        # 保持タグ（table）
        if tag in PRESERVE_TAGS:
            self.preserve_depth += 1
            attr_str = " ".join(f'{k}="{v}"' for k, v in attrs)
            self.preserve_buf.write(f"<{tag} {attr_str}>" if attr_str else f"<{tag}>")
            return

        if self.preserve_depth > 0:
            attr_str = " ".join(f'{k}="{v}"' for k, v in attrs)
            self.preserve_buf.write(f"<{tag} {attr_str}>" if attr_str else f"<{tag}>")
            return

        # 見出し
        if tag in HEADING_TAGS:
            self._flush_text()
            self.current_heading = tag
            return

        # ブロックタグ：テキストを区切る
        if tag in BLOCK_TAGS:
            if self.current_text:
                self._flush_text()

    def handle_endtag(self, tag):
        if tag == "article":
            self.depth_article -= 1
            if self.depth_article == 0:
                self.in_article = False
                self._flush_text()
            return

        if not self.in_article:
            return

        if tag in SKIP_TAGS:
            self.skip_depth = max(0, self.skip_depth - 1)
            return

        if self.skip_depth > 0:
            self.skip_depth -= 1
            return

        # 保持タグ終了
        if tag in PRESERVE_TAGS and tag != "img":
            self.preserve_buf.write(f"</{tag}>")
            self.preserve_depth -= 1
            if self.preserve_depth == 0:
                self._append_raw(self.preserve_buf.getvalue())
                self.preserve_buf = StringIO()
            return

        if self.preserve_depth > 0:
            self.preserve_buf.write(f"</{tag}>")
            return

        # 見出し終了
        if tag in HEADING_TAGS and self.current_heading == tag:
            level = int(tag[1])
            prefix = "#" * level
            text = "".join(self.current_text).strip()
            if text:
                self.output_lines.append(f"{prefix} {text}")
                self.output_lines.append("")
            self.current_text = []
            self.current_heading = None
            return

        # ブロックタグ終了
        if tag in BLOCK_TAGS:
            self._flush_text()

    def handle_data(self, data):
        if not self.in_article:
            return
        if self.skip_depth > 0:
            return

        text = data  # 改行・空白はそのまま保持（後でstrip）

        if self.preserve_depth > 0:
            self.preserve_buf.write(data)
            return

        self.current_text.append(text)

    def handle_entityref(self, name):
        # HTML エンティティ（&amp; 等）
        entities = {"amp": "&", "lt": "<", "gt": ">", "nbsp": " ", "quot": '"', "apos": "'"}
        ch = entities.get(name, f"&{name};")
        self.handle_data(ch)

    def handle_charref(self, name):
        try:
            if name.startswith("x"):
                ch = chr(int(name[1:], 16))
            else:
                ch = chr(int(name))
        except ValueError:
            ch = f"&#{name};"
        self.handle_data(ch)

    def get_markdown(self):
        # 連続する空行を1行に圧縮
        lines = self.output_lines
        result = []
        prev_blank = False
        for line in lines:
            is_blank = line.strip() == ""
            if is_blank and prev_blank:
                continue
            result.append(line)
            prev_blank = is_blank
        return "\n".join(result).strip() + "\n"


def extract(src_path: str, dst_dir: str):
    basename = os.path.basename(src_path)
    stem = os.path.splitext(basename)[0]
    dst_path = os.path.join(dst_dir, f"{stem}.md")

    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    parser = ArticleExtractor()
    parser.feed(html)
    markdown = parser.get_markdown()

    os.makedirs(dst_dir, exist_ok=True)
    with open(dst_path, "w", encoding="utf-8") as f:
        f.write(markdown)

    print(f"[OK] {src_path} -> {dst_path}")
    return dst_path


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 extract_article_text.py <src.html> [dst_dir]")
        print("       python3 extract_article_text.py --all <articles_bk_dir> [dst_dir]")
        sys.exit(1)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(base_dir)
    default_dst = os.path.join(project_dir, ".claude", "documents")

    if sys.argv[1] == "--all":
        src_dir = sys.argv[2] if len(sys.argv) > 2 else os.path.join(project_dir, "articles_bk")
        dst_dir = sys.argv[3] if len(sys.argv) > 3 else default_dst
        files = sorted(f for f in os.listdir(src_dir) if f.endswith(".html"))
        for fname in files:
            extract(os.path.join(src_dir, fname), dst_dir)
    else:
        src_path = sys.argv[1]
        dst_dir = sys.argv[2] if len(sys.argv) > 2 else default_dst
        extract(src_path, dst_dir)


if __name__ == "__main__":
    main()
