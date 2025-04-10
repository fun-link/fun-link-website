# Fun-Link ウェブサイト構造

## ファイル構成
- `index.html`: メインページ
- `css/`: スタイルシート
  - `base/`: 基本スタイル
    - `variables.css`: カラー、フォントなどの変数
    - `reset.css`: ブラウザデフォルトスタイルのリセット
    - `typography.css`: テキスト関連のスタイル
  - `components/`: UIコンポーネント
    - `buttons.css`: ボタンスタイル
    - `cards.css`: カードコンポーネント
    - `navigation.css`: ナビゲーション要素
  - `layouts/`: レイアウト
    - `grid.css`: グリッドシステム
    - `header.css`: ヘッダーのスタイル
    - `footer.css`: フッターのスタイル
  - `utilities/`: ユーティリティ
    - `animations.css`: アニメーション効果
    - `responsive.css`: レスポンシブデザイン用スタイル
    - `spacing.css`: マージン、パディングのユーティリティ
  - `themes/`: テーマ
    - `light.css`: ライトテーマの設定

## 開発ガイドライン
- CSSは機能ごとにモジュール化して管理
- コマンドラインとGitを活用した効率的な開発フロー
- 変更はGitHubにプッシュすると自動的にサーバーにデプロイ
