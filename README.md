# CS Notes Audio Site (TypeScript + Next.js Static Export + Tailwind + MiniSearch)

Markdownベースで学習メモを管理し、全文検索・タグ・索引、音声のランダム再生に対応した静的サイトです。
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

### GitHub Pages（プロジェクトページ）
URL が `https://<user>.github.io/<repo>` の場合、ベースパスを設定してビルドしてください。

```bash
export NEXT_PUBLIC_BASE_PATH=/<repo>
npm run build
```

`out/` を任意でデプロイできます（ローカルからなら `npm run deploy` で `gh-pages` ブランチへ）。

### ディレクトリ
- `content/` … Markdown（Frontmatter: `title`, `tags`, `keywords`, `audio`）
- `public/audio/` … 音声ファイル（フォルダ構成は自由）
- `public/data/` … 生成物（`scripts/build-content.ts` が出力）

### 補足
- これは **静的エクスポート** 用の Next.js プロジェクトです。
- 本リポジトリではバイナリ音声は同梱していません。各自 `public/audio/` に追加してください。
- Actions によるビルド・デプロイワークフローも同梱しています。必要に応じて有効化してください。
