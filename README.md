# CS Notes Audio Site (TypeScript + Next.js Static Export + Tailwind + MiniSearch)

Markdown ベースで学習メモを管理し、全文検索・カテゴリ・索引、音声のランダム再生に対応した静的サイトです。
GitHub Pages（プロジェクトページ）で動作します。

## 使い方

```bash
# 依存をインストール
npm i

# 開発（初回に Markdown -> JSON 生成を行います）
npm run dev

# 本番ビルド & エクスポート（out/ に静的出力）
npm run build
```

### ディレクトリ

- `content/` … Markdown（Frontmatter: `title`, `categories`, `keywords`, `audio`）
- `public/audio/` … 音声ファイル（フォルダ構成は自由）
- `public/data/` … 生成物（`scripts/build-content.ts` が出力）

## ToDo

- GitHub Pages へのデプロイ
- GitHub Actions で自動ビルド・デプロイ
- AWS Polly で音声ファイルの自動作成。音声ファイル作成時に Markdown ファイルへの自動割り当て。
