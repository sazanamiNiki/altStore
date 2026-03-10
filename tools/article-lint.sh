#!/bin/bash
# article-lint.sh - 記事のスタイルガイド準拠チェック
# 使い方:
#   ./tools/article-lint.sh src/pages/articles/example.mdx
#   ./tools/article-lint.sh --all

# 色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# カウンター
ERRORS=0
WARNINGS=0

# エラー出力
error() {
  echo -e "${RED}❌ $1${NC}"
  ERRORS=$((ERRORS + 1))
}

# 警告出力
warn() {
  echo -e "${YELLOW}⚠️  $1${NC}"
  WARNINGS=$((WARNINGS + 1))
}

# 成功出力
ok() {
  echo -e "${GREEN}✓ $1${NC}"
}

# 文字数カウント（日本語対応）
char_count() {
  echo -n "$1" | perl -CS -ne 'print length'
}

# 単一ファイルのチェック
check_file() {
  local file="$1"

  if [[ ! -f "$file" ]]; then
    error "ファイルが見つかりません: $file"
    return 1
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📄 $(basename "$file")"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  local content
  content=$(cat "$file")

  # 1. ArticleLayout 使用確認
  if echo "$content" | grep -q "<ArticleLayout"; then
    ok "ArticleLayout 使用"
  else
    error "ArticleLayout が見つかりません"
  fi

  # 2. title 文字数チェック（≤ 32字）
  local title
  title=$(echo "$content" | grep 'export const title' | sed 's/.*"\(.*\)".*/\1/' | head -1)
  if [[ -n "$title" ]]; then
    local title_len
    title_len=$(char_count "$title")
    if [[ $title_len -le 32 ]]; then
      ok "title: ${title_len}字（≤32字）"
    else
      error "title: ${title_len}字（32字以内にしてください）"
    fi
  else
    error "title が見つかりません"
  fi

  # 3. summary 文字数チェック（50〜80字）
  local summary
  summary=$(echo "$content" | grep 'export const summary' | sed 's/.*"\(.*\)".*/\1/' | head -1)
  if [[ -n "$summary" ]]; then
    local summary_len
    summary_len=$(char_count "$summary")
    if [[ $summary_len -ge 50 && $summary_len -le 80 ]]; then
      ok "summary: ${summary_len}字（50〜80字）"
    else
      error "summary: ${summary_len}字（50〜80字にしてください）"
    fi
  else
    warn "summary が未設定（description がフォールバックされます）"
  fi

  # 4. description 文字数チェック（100〜160字）
  local description
  description=$(echo "$content" | grep 'export const description' | sed 's/.*"\(.*\)".*/\1/' | head -1)
  if [[ -n "$description" ]]; then
    local desc_len
    desc_len=$(char_count "$description")
    if [[ $desc_len -ge 100 && $desc_len -le 160 ]]; then
      ok "description: ${desc_len}字（100〜160字）"
    else
      error "description: ${desc_len}字（100〜160字にしてください）"
    fi
  else
    error "description が見つかりません"
  fi

  # 5. RelatedArticles 存在確認
  if echo "$content" | grep -q "<RelatedArticles"; then
    ok "RelatedArticles 配置済み"
  else
    error "RelatedArticles が見つかりません"
  fi

  # 6. 生HTML検出（<div class= 等）
  local raw_html_count
  raw_html_count=$(echo "$content" | grep -c '<div class=' 2>/dev/null || echo "0")
  raw_html_count=$(echo "$raw_html_count" | tr -d '[:space:]')
  if [[ "$raw_html_count" -gt 0 ]]; then
    error "生HTML（<div class=）が${raw_html_count}箇所で検出されました"
  else
    ok "生HTML なし"
  fi

  # 7. Card desc 文字数チェック（≤ 20字）
  local card_over_count=0
  while IFS= read -r desc_text; do
    if [[ -n "$desc_text" ]]; then
      local len
      len=$(char_count "$desc_text")
      if [[ $len -gt 20 ]]; then
        if [[ $card_over_count -eq 0 ]]; then
          error "Card desc が20字を超えています:"
        fi
        echo "    ${len}字: \"${desc_text}\""
        card_over_count=$((card_over_count + 1))
      fi
    fi
  done < <(echo "$content" | grep '<Card' | sed -n 's/.*desc="\([^"]*\)".*/\1/p')
  if [[ $card_over_count -eq 0 ]]; then
    ok "Card desc: 全て20字以内"
  fi

  # 8. Step desc 文字数チェック（≤ 50字）
  local step_over_count=0
  while IFS= read -r desc_text; do
    if [[ -n "$desc_text" ]]; then
      local len
      len=$(char_count "$desc_text")
      if [[ $len -gt 50 ]]; then
        if [[ $step_over_count -eq 0 ]]; then
          error "Step desc が50字を超えています:"
        fi
        echo "    ${len}字: \"${desc_text}\""
        step_over_count=$((step_over_count + 1))
      fi
    fi
  done < <(echo "$content" | grep '<Step' | sed -n 's/.*desc="\([^"]*\)".*/\1/p')
  if [[ $step_over_count -eq 0 ]]; then
    ok "Step desc: 全て50字以内"
  fi

  # 9. Section内カード数チェック
  local total_cards
  total_cards=$(echo "$content" | grep -c '<Card' || echo "0")
  ok "カード数: 合計${total_cards}枚"

  # 10. Section intro 内の CardGrid/Accordion 禁止
  local intro_content
  intro_content=$(echo "$content" | perl -0777 -ne 'print $1 if /<Section\s+intro[^>]*>(.*?)<\/Section>/s' 2>/dev/null || echo "")
  if [[ -n "$intro_content" ]]; then
    local intro_errors=0
    if echo "$intro_content" | grep -qE '<CardGrid|<Card'; then
      error "Section intro 内に CardGrid/Card があります"
      intro_errors=1
    fi
    if echo "$intro_content" | grep -qE '<AccordionGroup|<Accordion'; then
      error "Section intro 内に Accordion があります"
      intro_errors=1
    fi
    if echo "$intro_content" | grep -q '<div class='; then
      error "Section intro 内に生HTMLがあります"
      intro_errors=1
    fi
    if [[ $intro_errors -eq 0 ]]; then
      ok "Section intro: 簡潔な構成"
    fi
  else
    warn "Section intro が見つかりません"
  fi

  echo ""
}

# メイン処理
main() {
  echo ""
  echo "╔════════════════════════════════════════╗"
  echo "║       📝 Article Lint チェック         ║"
  echo "╚════════════════════════════════════════╝"

  local target_files=()

  if [[ "$1" == "--all" ]]; then
    for file in src/pages/articles/*.mdx; do
      if [[ -f "$file" ]]; then
        target_files+=("$file")
      fi
    done
  elif [[ -n "$1" ]]; then
    target_files+=("$1")
  else
    echo ""
    echo "使い方:"
    echo "  ./tools/article-lint.sh src/pages/articles/example.mdx"
    echo "  ./tools/article-lint.sh --all"
    exit 1
  fi

  for file in "${target_files[@]}"; do
    check_file "$file"
  done

  # 結果サマリー
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📊 結果サマリー"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  if [[ $ERRORS -eq 0 && $WARNINGS -eq 0 ]]; then
    echo -e "${GREEN}✅ 全てのチェックに合格しました${NC}"
    exit 0
  else
    echo -e "エラー: ${RED}${ERRORS}件${NC}"
    echo -e "警告: ${YELLOW}${WARNINGS}件${NC}"
    if [[ $ERRORS -gt 0 ]]; then
      exit 1
    fi
    exit 0
  fi
}

main "$@"
