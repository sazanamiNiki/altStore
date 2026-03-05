#!/bin/bash
# コミット時に変更されたMDXファイルの更新日を当日の日付に変更するスクリプト

# 当日の日付を取得（YYYY-MM-DD形式）
TODAY=$(date +%Y-%m-%d)

# ステージングされたMDXファイルを取得
STAGED_MDX_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.mdx$')

if [ -z "$STAGED_MDX_FILES" ]; then
    # MDXファイルがなければ終了
    exit 0
fi

echo "📅 記事の更新日を $TODAY に更新中..."

for FILE in $STAGED_MDX_FILES; do
    # ファイルが存在するか確認
    if [ -f "$FILE" ]; then
        # date="YYYY-MM-DD" のパターンを当日の日付に置換
        # macOS互換のsed
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/date=\"[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\"/date=\"$TODAY\"/g" "$FILE"
        else
            sed -i "s/date=\"[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\"/date=\"$TODAY\"/g" "$FILE"
        fi

        # 変更をステージングに追加
        git add "$FILE"
        echo "  ✓ $FILE"
    fi
done

echo "✅ 更新日の変更が完了しました"
