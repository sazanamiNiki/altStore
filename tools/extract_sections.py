#!/usr/bin/env python3
"""
記事HTMLファイルから特定のセクションのみを抽出するツール

使用例:
  python extract_sections.py articles/what-is-sideloading.html --sections header intro
  python extract_sections.py articles/what-is-sideloading.html --sections content --format markdown
  python extract_sections.py articles/what-is-sideloading.html --sections summary recommendation --output output.txt
"""

import argparse
import sys
import re
from pathlib import Path
from html.parser import HTMLParser
from typing import List, Optional, Dict, Tuple


class SectionExtractor(HTMLParser):
    """HTMLからセクションを抽出するパーサー"""

    def __init__(self, target_sections: List[str]):
        super().__init__()
        self.target_sections = set(target_sections)
        self.current_section = None
        self.current_section_type = None
        self.current_content = []
        self.sections = []
        self.in_target = False
        self.tag_stack = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        # data-section属性を持つタグを検出
        if 'data-section' in attrs_dict:
            section_type = attrs_dict['data-section']
            if section_type in self.target_sections:
                self.in_target = True
                self.current_section_type = section_type
                self.current_content = [self.get_starttag_text()]
                self.tag_stack = [tag]
                return

        # ターゲットセクション内の場合、内容を記録
        if self.in_target:
            self.current_content.append(self.get_starttag_text())
            self.tag_stack.append(tag)

    def handle_endtag(self, tag):
        if self.in_target:
            self.current_content.append(f'</{tag}>')
            if self.tag_stack and self.tag_stack[-1] == tag:
                self.tag_stack.pop()

                # スタックが空になったら、セクションの終わり
                if not self.tag_stack:
                    self.sections.append({
                        'type': self.current_section_type,
                        'html': ''.join(self.current_content)
                    })
                    self.in_target = False
                    self.current_content = []
                    self.current_section_type = None

    def handle_data(self, data):
        if self.in_target:
            self.current_content.append(data)


class SectionLister(HTMLParser):
    """HTMLからセクション情報を一覧表示するパーサー"""

    def __init__(self):
        super().__init__()
        self.sections = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if 'data-section' in attrs_dict:
            self.sections.append({
                'id': attrs_dict.get('id', '(なし)'),
                'data-section': attrs_dict['data-section'],
                'data-content-type': attrs_dict.get('data-content-type', '')
            })


def extract_sections(html_path: str, section_types: List[str], output_format: str = "html") -> str:
    """
    HTMLファイルから指定されたセクションを抽出

    Args:
        html_path: HTMLファイルのパス
        section_types: 抽出するセクションタイプのリスト（例: ["header", "intro"]）
        output_format: 出力形式（"html", "text", "markdown"）

    Returns:
        抽出されたセクションの文字列
    """
    # HTMLファイルを読み込む
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except FileNotFoundError:
        print(f"エラー: ファイルが見つかりません: {html_path}", file=sys.stderr)
        sys.exit(1)

    parser = SectionExtractor(section_types)
    parser.feed(html_content)

    if not parser.sections:
        print(f"警告: 指定されたセクションが見つかりませんでした", file=sys.stderr)
        return ""

    results = []
    for section in parser.sections:
        if output_format == "html":
            results.append(section['html'])
        elif output_format == "text":
            results.append(_html_to_text(section['html']))
        elif output_format == "markdown":
            results.append(_html_to_markdown(section['html']))

    separator = '\n\n' + '='*80 + '\n\n'
    return separator.join(results)


def _strip_html_tags(html: str) -> str:
    """HTMLタグを除去してプレーンテキストに変換"""
    # scriptとstyleタグを除去
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)

    # HTMLタグを除去
    text = re.sub(r'<[^>]+>', '', html)

    # HTMLエンティティをデコード
    text = text.replace('&nbsp;', ' ')
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&amp;', '&')
    text = text.replace('&quot;', '"')

    # 複数の空白を1つにまとめる
    text = re.sub(r'\s+', ' ', text)

    return text.strip()


def _html_to_text(html: str) -> str:
    """HTMLを読みやすいプレーンテキストに変換"""
    # 見出しタグの前後に改行を追加
    html = re.sub(r'<h([1-6])[^>]*>', r'\n\n', html)
    html = re.sub(r'</h[1-6]>', r'\n', html)

    # pタグの後に改行を追加
    html = re.sub(r'</p>', r'\n\n', html)

    # liタグを箇条書きに変換
    html = re.sub(r'<li[^>]*>', r'\n• ', html)

    # HTMLタグを除去
    text = _strip_html_tags(html)

    # 連続する改行を整理
    text = re.sub(r'\n{3,}', '\n\n', text)

    return text.strip()


def _html_to_markdown(html: str) -> str:
    """HTMLを簡易的なMarkdownに変換"""
    # h1タグ
    html = re.sub(r'<h1[^>]*>(.*?)</h1>', r'\n# \1\n', html, flags=re.DOTALL)

    # h2タグ
    html = re.sub(r'<h2[^>]*>(.*?)</h2>', r'\n## \1\n', html, flags=re.DOTALL)

    # h3タグ
    html = re.sub(r'<h3[^>]*>(.*?)</h3>', r'\n### \1\n', html, flags=re.DOTALL)

    # h4タグ
    html = re.sub(r'<h4[^>]*>(.*?)</h4>', r'\n#### \1\n', html, flags=re.DOTALL)

    # strongタグ
    html = re.sub(r'<strong>(.*?)</strong>', r'**\1**', html)

    # pタグ
    html = re.sub(r'<p[^>]*>(.*?)</p>', r'\n\1\n', html, flags=re.DOTALL)

    # liタグ
    html = re.sub(r'<li[^>]*>(.*?)</li>', r'\n- \1', html, flags=re.DOTALL)

    # aタグ
    html = re.sub(r'<a[^>]*href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', r'[\2](\1)', html)

    # その他のHTMLタグを除去
    text = _strip_html_tags(html)

    # 連続する改行を整理
    text = re.sub(r'\n{3,}', '\n\n', text)

    return text.strip()


def list_sections(html_path: str) -> None:
    """
    HTMLファイル内のすべてのセクションをリスト表示

    Args:
        html_path: HTMLファイルのパス
    """
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except FileNotFoundError:
        print(f"エラー: ファイルが見つかりません: {html_path}", file=sys.stderr)
        sys.exit(1)

    parser = SectionLister()
    parser.feed(html_content)

    if not parser.sections:
        print("セクション属性が付与されていません", file=sys.stderr)
        return

    print(f"\n{html_path} のセクション一覧:\n")
    print(f"{'ID':<30} {'data-section':<20} {'data-content-type':<20}")
    print("="*70)

    for section in parser.sections:
        print(f"{section['id']:<30} {section['data-section']:<20} {section['data-content-type']:<20}")


def main():
    parser = argparse.ArgumentParser(
        description='記事HTMLファイルから特定のセクションを抽出',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  # ヘッダーと導入のみを抽出
  python extract_sections.py articles/what-is-sideloading.html --sections header intro

  # すべてのcontentセクションをマークダウン形式で抽出
  python extract_sections.py articles/what-is-sideloading.html --sections content --format markdown

  # まとめをファイルに出力
  python extract_sections.py articles/what-is-sideloading.html --sections summary --output summary.txt

  # ファイル内のセクション一覧を表示
  python extract_sections.py articles/what-is-sideloading.html --list
        """
    )

    parser.add_argument('html_file', help='HTMLファイルのパス')
    parser.add_argument(
        '--sections', '-s',
        nargs='+',
        choices=['header', 'intro', 'content', 'faq', 'summary', 'recommendation', 'metadata'],
        help='抽出するセクションタイプ（複数指定可）'
    )
    parser.add_argument(
        '--format', '-f',
        choices=['html', 'text', 'markdown'],
        default='text',
        help='出力形式（デフォルト: text）'
    )
    parser.add_argument(
        '--output', '-o',
        help='出力ファイルパス（指定しない場合は標準出力）'
    )
    parser.add_argument(
        '--list', '-l',
        action='store_true',
        help='ファイル内のセクション一覧を表示'
    )

    args = parser.parse_args()

    # セクション一覧表示モード
    if args.list:
        list_sections(args.html_file)
        return

    # セクション抽出モード
    if not args.sections:
        print("エラー: --sections または --list のいずれかを指定してください", file=sys.stderr)
        parser.print_help()
        sys.exit(1)

    result = extract_sections(args.html_file, args.sections, args.format)

    # 出力
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(result)
        print(f"結果を {args.output} に保存しました")
    else:
        print(result)


if __name__ == '__main__':
    main()
