#!/usr/bin/env python3
"""
.claude/documents/[ファイル名].md を articles_style_guide に従った HTML に変換し、
articles/[ファイル名].html の <article> 内に書き込むスクリプト。
"""

import sys
import os
import re

# 見出しテキスト → (icon, color) マッピング
ICON_MAP = [
    (['まとめ', '結論'],                               'done_all',     'text-green-600'),
    (['トラブル', 'エラー', 'Q&A', 'FAQ', '質問'],    'help',         'text-blue-600'),
    (['セットアップ', '初期', '手順'],                 'construction', 'text-blue-600'),
    (['インストール', 'ダウンロード'],                 'download',     'text-blue-600'),
    (['署名', '仕組み', 'なぜ', 'メンテナンス'],      'schedule',     'text-blue-600'),
    (['更新', '変更', 'アップデート'],                 'update',       'text-blue-600'),
    (['安全', 'セキュリティ', '安心', 'リスク'],       'security',     'text-green-600'),
    (['事前', '準備', '要件', '必要', '環境'],         'checklist',    'text-blue-600'),
    (['比較'],                                         'compare',      'text-blue-600'),
    (['法律', '法的', '規制', '条文'],                 'gavel',        'text-blue-600'),
    (['使い方', '操作'],                               'settings',     'text-blue-600'),
    (['とは', '概要', '特徴', '基本'],                 'info',         'text-blue-600'),
    (['支払', '料金', '費用', '価格', '収益'],         'payments',     'text-blue-600'),
    (['公証', '認証', '審査'],                         'verified',     'text-green-600'),
    (['法律', '法的'],                                 'gavel',        'text-blue-600'),
]
DEFAULT_ICON = ('info', 'text-blue-600')

# H1アイコンマッピング（タイトル専用）
H1_ICON_MAP = [
    (['AltStore', 'AltServer'],    'apps',           'text-blue-500'),
    (['SideStore'],                'store',          'text-blue-500'),
    (['インストール'],             'install_desktop','text-blue-500'),
    (['安全', 'セキュリティ'],     'security',       'text-blue-500'),
    (['法律', '法的', 'スマホ'],   'gavel',          'text-blue-500'),
    (['公証', '認証'],             'verified',       'text-blue-500'),
    (['エミュレータ', 'ゲーム'],   'sports_esports', 'text-blue-500'),
    (['UTM', 'Windows'],           'computer',       'text-blue-500'),
    (['FAQ', 'よくある'],          'help',           'text-blue-500'),
    (['支払', '料金', '収益'],     'payments',       'text-blue-500'),
    (['サイドローディング'],       'shield',         'text-blue-500'),
]
DEFAULT_H1_ICON = ('shield', 'text-blue-500')


def get_icon(text, is_h1=False):
    icon_map = H1_ICON_MAP if is_h1 else ICON_MAP
    default = DEFAULT_H1_ICON if is_h1 else DEFAULT_ICON
    for keywords, icon, color in icon_map:
        if any(kw in text for kw in keywords):
            return icon, color
    return default


def parse_md_blocks(md_text):
    """Markdown をブロックリストに変換"""
    lines = md_text.split('\n')
    blocks = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # 見出し
        m = re.match(r'^(#{1,6})\s+(.*)', line)
        if m:
            blocks.append({
                'type': 'heading',
                'level': len(m.group(1)),
                'text': m.group(2).strip()
            })
            i += 1
            continue

        # table ブロック（複数行）
        stripped = line.strip()
        if stripped.startswith('<table'):
            html_lines = [stripped]
            while i + 1 < len(lines):
                i += 1
                nl = lines[i].strip()
                html_lines.append(nl)
                if '</table>' in nl:
                    break
            blocks.append({'type': 'html_block', 'text': '\n'.join(html_lines)})
            i += 1
            continue

        # img タグ（単独行）
        if stripped.startswith('<img'):
            blocks.append({'type': 'html_block', 'text': stripped})
            i += 1
            continue

        # 空行
        if stripped == '':
            blocks.append({'type': 'blank'})
            i += 1
            continue

        # テキスト
        blocks.append({'type': 'text', 'text': stripped})
        i += 1

    return blocks


def render_content_items(content_blocks, indent='        '):
    """コンテンツブロック → HTML文字列"""
    parts = []
    i = 0

    while i < len(content_blocks):
        block = content_blocks[i]

        if block['type'] == 'blank':
            i += 1
            continue

        if block['type'] == 'html_block':
            # テーブル等はそのまま埋め込み（インデント付き）
            indented = '\n'.join(indent + l for l in block['text'].split('\n'))
            parts.append(indented)
            i += 1
            continue

        if block['type'] == 'heading':
            if block['level'] == 3:
                parts.append(f'{indent}<h3 class="text-xl font-bold mt-6 mb-3">{block["text"]}</h3>')
            elif block['level'] == 4:
                parts.append(f'{indent}<h4 class="text-lg font-semibold mt-4 mb-2 text-gray-700">{block["text"]}</h4>')
            else:
                # H5以下はh4扱い
                parts.append(f'{indent}<h4 class="text-lg font-semibold mt-4 mb-2 text-gray-700">{block["text"]}</h4>')
            i += 1
            continue

        if block['type'] == 'text':
            parts.append(f'{indent}<p class="text-gray-700 leading-7 mb-4">{block["text"]}</p>')
            i += 1
            continue

        i += 1

    return '\n'.join(parts)


def blocks_to_article_html(blocks):
    """ブロックリスト全体を article 内の HTML に変換"""
    # H1 と直後のサブタイトルを取り出す
    h1_text = ''
    h1_subtitle = ''
    h1_idx = next((i for i, b in enumerate(blocks) if b['type'] == 'heading' and b['level'] == 1), None)

    if h1_idx is not None:
        h1_text = blocks[h1_idx]['text']
        for b in blocks[h1_idx + 1:]:
            if b['type'] == 'blank':
                continue
            if b['type'] == 'text':
                h1_subtitle = b['text']
            break  # テキスト or 見出しで止まる

    # ヒーローセクション
    h1_icon, h1_color = get_icon(h1_text, is_h1=True)
    hero_html = (
        f'      <div class="mb-8 pb-8 border-b-2 border-blue-200">\n'
        f'        <h1 class="text-4xl font-bold mb-3 text-slate-800 flex items-center gap-3">\n'
        f'          <span class="material-symbols-outlined {h1_color} text-[2.5rem]">{h1_icon}</span>\n'
        f'          {h1_text}\n'
        f'        </h1>\n'
        f'        <p class="text-gray-600 text-lg">{h1_subtitle}</p>\n'
        f'      </div>'
    )

    # H2 セクションに分割
    # H1・H1サブタイトルより後の部分を処理
    skip_subtitle = h1_subtitle
    found_h1 = (h1_idx is None)  # H1がなければ最初から処理
    skipped_subtitle = False

    sections = []       # {'heading': str, 'content': [blocks]}
    current = None
    pre_h2_blocks = []  # H1直後でH2前に来るブロック

    for idx, block in enumerate(blocks):
        # H1 まで飛ばす
        if not found_h1:
            if block['type'] == 'heading' and block['level'] == 1:
                found_h1 = True
            continue

        # H1直後のサブタイトルを1度だけスキップ
        if not skipped_subtitle and skip_subtitle:
            if block['type'] == 'text' and block['text'] == skip_subtitle:
                skipped_subtitle = True
                continue

        if block['type'] == 'heading' and block['level'] == 2:
            if current is not None:
                sections.append(current)
            elif pre_h2_blocks:
                # H2前のブロックをダミーセクションとして残す（後で処理）
                pass
            current = {'heading': block['text'], 'content': []}
            continue

        if current is None:
            # H2前のブロック（空白以外）
            if block['type'] not in ('blank',):
                pre_h2_blocks.append(block)
        else:
            current['content'].append(block)

    if current is not None:
        sections.append(current)

    # HTML組み立て
    parts = [hero_html]

    # H2前のブロックがあれば段落として追加
    if pre_h2_blocks:
        content_html = render_content_items(pre_h2_blocks)
        if content_html.strip():
            parts.append(
                f'      <div class="bg-white rounded-lg p-8 mb-8 border border-gray-200">\n'
                f'{content_html}\n'
                f'      </div>'
            )

    for s_idx, section in enumerate(sections):
        heading = section['heading']
        content_blocks = section['content']
        icon, color = get_icon(heading)
        content_html = render_content_items(content_blocks)

        if s_idx == 0:
            # 導入セクション（青背景）
            parts.append(
                f'      <div class="bg-blue-50 rounded-lg p-8 mb-8 border-l-4 border-blue-500 border border-blue-200">\n'
                f'        <h2 class="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">\n'
                f'          <span class="material-symbols-outlined text-blue-500">{icon}</span>\n'
                f'          {heading}\n'
                f'        </h2>\n'
                f'{content_html}\n'
                f'      </div>'
            )
        else:
            # 通常セクション（白背景）
            parts.append(
                f'      <div class="bg-white rounded-lg p-8 mb-8 border border-gray-200">\n'
                f'        <h2 class="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200 text-gray-800 flex items-center gap-2">\n'
                f'          <span class="material-symbols-outlined {color}">{icon}</span>\n'
                f'          {heading}\n'
                f'        </h2>\n'
                f'{content_html}\n'
                f'      </div>'
            )

    return '\n\n'.join(parts)


def inject_into_article(target_path, new_content):
    """<article> 内を新しいコンテンツで置換（外側は変更しない）"""
    with open(target_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # <article> と </article> の間だけを置換
    new_html, n = re.subn(
        r'(<article[^>]*>)(.*?)(</article>)',
        lambda m: m.group(1) + '\n' + new_content + '\n    ' + m.group(3),
        html,
        flags=re.DOTALL
    )

    if n == 0:
        print(f'[WARN] <article> タグが見つかりません: {target_path}')
        return

    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(new_html)

    print(f'[OK] {target_path} の <article> を更新しました')


def process_file(md_path, target_dir):
    basename = os.path.basename(md_path).replace('.md', '.html')
    target_path = os.path.join(target_dir, basename)

    if not os.path.exists(target_path):
        print(f'[SKIP] 対応ファイルなし: {target_path}')
        return

    with open(md_path, 'r', encoding='utf-8') as f:
        md_text = f.read()

    blocks = parse_md_blocks(md_text)
    article_html = blocks_to_article_html(blocks)
    inject_into_article(target_path, article_html)


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(base_dir)
    docs_dir = os.path.join(project_dir, '.claude', 'documents')
    articles_dir = os.path.join(project_dir, 'articles')

    if len(sys.argv) < 2:
        print('Usage:')
        print('  python3 generate_article_html.py <md_file>')
        print('  python3 generate_article_html.py --all')
        sys.exit(1)

    if sys.argv[1] == '--all':
        md_files = sorted(f for f in os.listdir(docs_dir) if f.endswith('.md'))
        for fname in md_files:
            process_file(os.path.join(docs_dir, fname), articles_dir)
    else:
        md_path = sys.argv[1]
        process_file(md_path, articles_dir)


if __name__ == '__main__':
    main()
