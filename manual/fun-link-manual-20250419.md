# Fun-Link ウェブサイト開発プロジェクトマニュアル

更新日時: 2025年4月19日

## 1. プロジェクト概要

### プロジェクト情報
- **サイト名**: Fun-Link
- **ドメイン**: fun-link.online
- **リポジトリ**: https://github.com/fun-link/fun-link-website.git
- **サーバー環境**: Xserver (sv16.sixcore.ne.jp)
- **FTP接続情報**:
  - ホスト: sv16.sixcore.ne.jp
  - ユーザー名: admin@fun-link.online
  - パスワード: [pass304130]
  - ポート: 21
- **GitHub情報**:
  - メールアドレス: info@fun-link.online
  - パスワード: pass304130@
- **サーバー環境詳細**:
  - SSHユーザー名: besttrust
  - SSH接続ポート: 10022
  - ドキュメントルート: /home/besttrust/public_html/

### ディレクトリ構造
```
fun-link-website/
├── css/
│   ├── base/
│   ├── components/
│   ├── layouts/
│   ├── utilities/
│   ├── themes/
│   ├── style.css              # メインスタイルシート
│   ├── enhanced-visuals.css   # 視覚効果強化用スタイル
│   ├── responsive.css         # レスポンシブデザイン用
│   ├── layout-fix.css         # レイアウト調整用
│   ├── orbital-animation.css  # 軌道アニメーション用
│   ├── menu.css               # メニュー用スタイル
│   ├── logo-guidelines.css    # ロゴガイドライン用
│   └── local-dev.css          # ローカル開発用（Git管理外）
├── js/
│   ├── smooth-animations.js   # スムーズなアニメーション用
│   ├── float-animation.js     # 浮遊アニメーション用
│   ├── stars.js               # 星のアニメーション用
│   ├── menu.js                # メニュー操作用
│   └── modules/
├── images/
│   ├── brand/
│   │   └── logo/
│   │       ├── color/         # カラーロゴ
│   │       ├── black/         # 黒ロゴ
│   │       └── white/         # 白ロゴ
│   ├── company/
│   ├── creator/               # キャラクター画像など
│   └── icon/
├── assets/
│   ├── logo_guide_funlink.pdf # ロゴガイドライン完全版PDF
│   └── logo.zip               # ロゴファイル一式
├── manual/                    # マニュアル用ディレクトリ
│   └── fun-link-manual-20250419.md  # 本マニュアルファイル
├── .github/
│   ├── scripts/
│   │   └── upload_to_drive.py # Google Drive同期用スクリプト
│   └── workflows/
│       └── google-drive-sync.yml  # 自動同期用ワークフロー設定
├── .gitattributes
├── .gitignore                 # Git管理から除外するファイル
├── .htaccess                  # サーバー設定ファイル
├── index.html                 # メインHTMLファイル
├── download.php               # ファイルダウンロード用PHPスクリプト
├── deploy.php                 # 自動デプロイ用スクリプト
├── deploy-log.txt             # デプロイログファイル
├── README.md
└── その他ディレクトリ/ファイル
```

## 2. 環境セットアップと開発ワークフロー

### ローカル環境のセットアップ

```bash
# 方法1: 新規リポジトリをクローン
git clone https://github.com/fun-link/fun-link-website.git
cd fun-link-website

# 方法2: 既存ディレクトリでリポジトリを初期化
git init
git remote add origin https://github.com/fun-link/fun-link-website.git
git fetch
git pull origin main
```

### ローカル開発環境の表示設定

ローカル環境で開発する際、本番サイト（https://fun-link.online/）とは表示サイズが異なる問題があります。これは主にブラウザの表示方法の違いによるものです。以下の方法で解決しています：

1. **ローカル開発用CSSファイル**:
   - `css/local-dev.css` ファイルを作成し、以下の内容を追加:
   ```css
   /* ローカル開発環境用スケーリング - 本番環境にはプッシュしない */
   html, body {
     zoom: 2.0; /* 200%ズーム */
   }
   ```

2. **Git管理から除外**:
   - `.gitignore` ファイルに `css/local-dev.css` を追加
   ```bash
   echo "css/local-dev.css" >> .gitignore
   ```
   - これにより、ローカル環境の変更が本番環境に影響を与えることを防止

3. **条件付きCSSの読み込み**:
   - `index.html` の `</head>` タグの直前に以下のJavaScriptを追加:
   ```html
   <!-- ローカル開発用スタイル - 本番では読み込まれない -->
   <script>
   if (window.location.protocol === 'file:') {
     const link = document.createElement('link');
     link.rel = 'stylesheet';
     link.href = 'css/local-dev.css';
     document.head.appendChild(link);
   }
   </script>
   ```
   - これにより、ローカル環境（file://プロトコル）でのみスケーリングが適用される

### 開発の基本ワークフロー

プロジェクトはGitコマンドベースでのワークフローで進めています：

```bash
# 最新の変更を取得
git pull origin main

# 変更を確認
git status

# 変更をステージング
git add .
# または特定のファイルのみ
git add index.html css/style.css

# コミット
git commit -m "変更内容の説明"

# プッシュ
git push origin main
```

### ブランチ管理（必要に応じて）

```bash
# 新しい機能用のブランチを作成
git checkout -b feature-name

# 変更をステージングしてコミット
git add .
git commit -m "機能の説明"

# ブランチをプッシュ
git push origin feature-name

# GitHub上でPull Requestを作成
# その後、マージして完了
```

### GitHub Webhook設定

GitHubからの変更を自動的にウェブサーバーにデプロイするためのWebhook設定：

```
# 【ツール: WebブラウザでGitHub】
# 1. https://github.com/fun-link/fun-link-website にアクセス
# 2. Settings → Webhooks → Add webhook
# 3. 以下を設定:
#    - Payload URL: https://fun-link.online/deploy.php
#    - Content type: application/json
#    - Secret: [秘密キー]
#    - Which events: Just the push event
#    - Active: チェックを入れる
# 4. Add webhookをクリック
```

## 3. 主要機能の実装とメンテナンス

### ロゴダウンロード機能

ロゴダウンロード機能は以下のファイルで構成されています：
- **assets/logo_guide_funlink.pdf**: ロゴガイドラインPDF
- **assets/logo.zip**: ロゴファイルのZIPアーカイブ
- **download.php**: ダウンロード処理用PHPスクリプト
- **css/logo-guidelines.css**: ロゴダウンロードセクションのスタイル

#### ファイル準備

サイトからロゴガイドラインPDFとロゴファイル一式（ZIP）をダウンロードできるようにするため、以下のファイルを用意します：

1. **ロゴガイドラインPDF**：
   - ファイル名: `logo_guide_funlink.pdf`
   - 保存場所: `/assets/logo_guide_funlink.pdf`

2. **ロゴファイル一式（ZIP）**：
   - ファイル名: `logo.zip`
   - 保存場所: `/assets/logo.zip`
   - 内容: 各種形式・カラーバリエーションのロゴファイル

#### HTML実装

```html
<!-- ダウンロードボタン配置用コンテナ -->
<div class="download-buttons-container">
  <!-- ロゴガイドライン完全版ダウンロードボタン -->
  <a href="download.php?file=logo_guide_funlink.pdf" class="download-button primary">ロゴガイドライン完全版をダウンロード</a>

  <!-- ロゴファイル一式ダウンロードボタン -->
  <a href="download.php?file=logo.zip" class="download-button orange">ロゴダウンロード</a>
</div>
```

#### CSSスタイル

```css
/* ダウンロードボタンコンテナ */
.download-buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
}

/* ダウンロードボタン共通スタイル */
.download-button {
  display: block;
  max-width: 400px;
  background-color: #0056b3;
  color: white;
  text-decoration: none;
  padding: 15px 30px;
  border-radius: 30px;
  font-weight: bold;
  text-align: center;
  transition: all 0.3s ease;
  margin: 20px;
}

.download-button:hover {
  background-color: #003d7e;
  transform: scale(1.05);
}

/* プライマリボタン（ロゴガイドライン完全版）の強調 */
.download-button.primary {
  font-size: 18px;
  margin-bottom: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.download-button.orange {
  background-color: #FF8800;
}

.download-button.orange:hover {
  background-color: #E67A00;
}

/* レスポンシブ対応 */
@media (min-width: 768px) {
  /* タブレット以上の画面サイズ */
  .download-buttons-container {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .download-button {
    margin: 15px 25px;
  }
}

@media (max-width: 480px) {
  /* スマートフォン向け */
  .download-button {
    width: 85%;
    font-size: 14px;
    padding: 12px 20px;
  }
}
```

#### PHPダウンロードスクリプト (download.php)

```php
<?php
$file = isset($_GET['file']) ? $_GET['file'] : '';
$allowed_files = array('logo_guide_funlink.pdf', 'logo.zip');

if (in_array($file, $allowed_files)) {
  $filepath = 'assets/' . $file;
  
  if (file_exists($filepath)) {
    $mime = ($file == 'logo.zip') ? 'application/zip' : 'application/pdf';
    
    // 適切なヘッダーの設定
    header('Content-Description: File Transfer');
    header('Content-Type: ' . $mime);
    header('Content-Disposition: attachment; filename="' . $file . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filepath));
    
    // ファイルを読み込んで出力
    readfile($filepath);
    exit;
  }
}

// エラーの場合はホームページにリダイレクト
header('Location: index.html');
exit;
?>
```

#### .htaccessでのMIMEタイプ設定

```
# PDFとZIPファイルのMIMEタイプを正しく設定
AddType application/pdf .pdf
AddType application/zip .zip

# PDFファイルのダウンロードを強制
<FilesMatch "\.pdf$">
  Header set Content-Disposition "attachment"
  Header set Content-Type "application/pdf"
</FilesMatch>

# ZIPファイルを強制的にダウンロードさせる設定
<FilesMatch "\.zip$">
  Header set Content-Disposition "attachment"
  Header set Content-Type "application/zip"
</FilesMatch>
```

#### サーバーでの設定

1. **assets ディレクトリの作成**：
   ```bash
   # サーバー上で assets ディレクトリを作成
   mkdir -p /home/besttrust/public_html/assets
   ```

2. **ファイルのアップロード**：
   FileZillaなどのFTPクライアントを使用して、PDFファイルとZIPファイルをassetsディレクトリにアップロードします。

3. **パーミッションの設定**：
   ```bash
   # ダウンロードファイルに適切なパーミッションを設定
   chmod 644 /home/besttrust/public_html/assets/logo_guide_funlink.pdf
   chmod 644 /home/besttrust/public_html/assets/logo.zip
   ```

#### ダウンロード機能のテスト

実装後、以下の点を確認してください：

1. ボタンがデザイン通りに表示されているか
2. ボタンをクリックするとファイルのダウンロードが開始されるか
3. ダウンロードしたファイルが正しく開けるか

問題がある場合は、以下を確認してください：
- ファイルパスが正しいか
- ファイルのパーミッションが適切か
- PHPが正しく機能しているか
- サーバーの設定でダウンロードが許可されているか

### ダウンロードボタンのレイアウト調整

ボタンの配置を改善し、視覚的なバランスとレスポンシブ対応を強化しました：

#### 変更概要

1. **ボタンコンテナの導入**
   - ボタン群をまとめて配置するコンテナ要素を追加
   - レスポンシブ対応時の配置調整を容易に

2. **余白と視覚的階層の調整**
   - ボタン間の余白を拡大し視認性を向上
   - プライマリアクションとセカンダリアクションの区別を明確に

3. **レスポンシブ対応の強化**
   - PC: 横並びでスペース効率の良い配置
   - スマホ: 縦並びで操作しやすい配置
   - タッチデバイス向けのボタンサイズ最適化

#### 実装効果

- 視覚的な一貫性が向上し、サイト全体の印象が改善
- 各デバイスでの使いやすさが向上
- プライマリとセカンダリボタンの関係性が明確になり、ユーザー行動の誘導が改善

#### 注意点

- 新しいCSS設定を変更する際は、レスポンシブ対応も合わせて確認してください
- ボタンの視覚的階層（プライマリ/セカンダリ）は、重要度に応じて適切に設定してください
- PCとスマホの両方で表示確認をしてからコミットしてください

## 4. 自動デプロイシステム

### deploy.phpスクリプト

GitHubからのWebhookを処理して、自動デプロイを行うためのスクリプト:

```php
<?php
// GitHubからのWebhookを処理するスクリプト
$log_file = 'deploy-log.txt';
$repo_dir = '/home/besttrust/temp-repo';
$web_root = '/home/besttrust/public_html';

// ログ記録関数
function write_log($message) {
  global $log_file;
  file_put_contents($log_file, date('Y-m-d H:i:s') . ": " . $message . "\n", FILE_APPEND);
}

// ログ開始
write_log("Webhook received");

// GitHubからの更新を取得
$output = [];
exec('cd ' . $repo_dir . ' && git pull origin main 2>&1', $output);
$pull_output = implode("\n", $output);
write_log("Git pull output: " . $pull_output);

// すべてのファイルをウェブディレクトリにコピー
$output = [];
exec('cp -r ' . $repo_dir . '/css ' . $web_root . '/ 2>&1', $output);
exec('cp -r ' . $repo_dir . '/js ' . $web_root . '/ 2>&1', $output);
exec('cp -r ' . $repo_dir . '/assets ' . $web_root . '/ 2>&1', $output);
exec('cp ' . $repo_dir . '/index.html ' . $web_root . '/ 2>&1', $output);
exec('cp ' . $repo_dir . '/download.php ' . $web_root . '/ 2>&1', $output);
exec('cp ' . $repo_dir . '/.htaccess ' . $web_root . '/ 2>&1', $output);
$copy_output = implode("\n", $output);
write_log("File copy output: " . $copy_output);

echo "Deployment completed. Check deploy-log.txt for details.";
?>
```

このスクリプトはGitHubからのWebhookを受け取り、リポジトリを更新し、ファイルをウェブルートディレクトリにコピーします。

### 自動デプロイのトラブルシューティング

自動デプロイに問題がある場合:

1. **ログファイルの確認**:
   ```bash
   # サーバーにSSH接続
   ssh besttrust@sv16.sixcore.ne.jp -p 10022
   
   # デプロイログを確認
   cat /home/besttrust/public_html/deploy-log.txt
   ```

2. **deploy.phpのパーミッション確認**:
   ```bash
   # deploy.phpに適切な実行権限があることを確認
   chmod 755 /home/besttrust/public_html/deploy.php
   ```

3. **手動でWebhookをトリガー**:
   - GitHubのWebhook設定画面で「Test delivery」ボタンをクリック
   - または小さな変更（README.mdの編集など）をプッシュ

## 5. トラブルシューティング

### ローカルと本番環境の表示の違い

**問題**: ローカル環境と本番環境で表示サイズや見た目が異なる

**解決方法**:
1. ローカル専用のCSSファイル（css/local-dev.css）を作成
2. このファイルをGit管理外に置く（.gitignoreに追加）
3. ローカル環境でのみこのCSSを読み込むように条件分岐（file://プロトコルの場合のみ）

**実際に試した解決手順**:
1. 本番サイトとローカル環境を並べて表示の違いを確認
2. ブラウザのズーム機能で調整すると表示が近くなることを確認（約200%）
3. この設定を自動化するための仕組みを実装
4. 本番環境に影響を与えないよう条件分岐を導入

### ブラウザキャッシュの問題

**問題**: CSSやJavaScriptの変更が反映されない

**解決方法**:
1. Ctrl+F5（またはCmd+Shift+R）でハードリフレッシュ
2. ブラウザの開発者ツールの「Network」タブで「Disable cache」にチェック
3. ブラウザの設定からキャッシュを完全に削除

### 画像が表示されない問題

**問題の原因**:
1. パスの問題:
   - HTMLが参照している画像パス (`images/brand/logo/color/`) とサーバー上の実際のディレクトリ構造 (`images/logo/`) が一致していない

2. ファイル名/拡張子の問題:
   - 大文字と小文字の違い（Linux/Unixサーバーでは区別される）
   - 実際の拡張子と参照している拡張子の不一致

3. ファイルのアップロード忘れ:
   - コードには参照があるが、実際の画像ファイルがリポジトリに追加されていない

**確認手順**:
1. GitHub上のコミット内容を確認
2. HTML内の画像参照パスを確認
3. サーバー上のディレクトリ構造を確認

**解決策**:
1. HTMLファイルのパスを修正
2. 必要なディレクトリ構造の作成
3. ロゴファイルを正しいディレクトリにコピー
4. 変更をコミットしてプッシュ

### ダウンロード機能の問題

**問題**: PDFやZIPファイルがHTMLとして表示される、または正しくダウンロードされない

**解決策**:
1. PHPスクリプト（download.php）を使用してダウンロード処理を行う
2. 適切なContent-TypeとContent-Dispositionヘッダーを設定
3. .htaccessファイルでMIMEタイプを正しく設定

```php
// download.phpの実装例（詳細は前述）
header('Content-Type: application/pdf'); // または application/zip
header('Content-Disposition: attachment; filename="filename.pdf"');
```

### Git操作の問題

```bash
# ブランチ名の不一致を解決
git branch  # 現在のブランチを確認
git checkout -b main  # mainブランチを作成して切り替え

# 変更を取得
git pull origin main

# リモート追跡の設定
git branch --set-upstream-to=origin/main main

# ローカルの変更が競合している場合
git reset --hard  # ローカルの変更を破棄
git pull  # リモートの最新変更を取得
```

## 6. 本番環境へのデプロイ

### 自動デプロイ (Webhook)

本プロジェクトでは、GitHubのWebhook機能により、mainブランチへのプッシュが自動的に本番サーバーにデプロイされる仕組みになっています。

```bash
# GitHubにプッシュすると自動的にデプロイされます
git push origin main
```

デプロイに問題がある場合は、サーバー上のログを確認します:
```bash
# サーバーにSSH接続
ssh besttrust@sv16.sixcore.ne.jp -p 10022

# デプロイログを確認
cat /home/besttrust/public_html/deploy-log.txt
```

### 手動デプロイ (FTP)

自動デプロイが機能しない場合や、特定のファイルのみを更新したい場合は、以下の方法を使用：

```
【ツール: FileZilla】
- ホスト: sv16.sixcore.ne.jp
- ユーザー名: admin@fun-link.online
- パスワード: [pass304130]
- ポート: 21（標準FTPポート）
```

操作手順:
1. FileZillaを起動し、サーバーに接続
2. ローカルサイト（左側）でファイルを選択
3. リモートサイト（右側）の適切なディレクトリにドラッグ＆ドロップ
4. ブラウザでサイトにアクセスして変更を確認

## 7. プロジェクト固有の注意点

### ローカル開発環境の設定

- 新しいマシンでの開発を始める際は、必ず`css/local-dev.css`を作成し、適切なズーム値を設定してください
- このファイルはGitHubリポジトリには含まれていないため、手動で作成する必要があります
- 本番環境への影響はありません（file://プロトコルでのみ動作）

### 画像パスの管理

- HTMLで参照するパスとサーバー上の実際のディレクトリ構造を一致させる
- 新しい画像を追加する際は、必ずGitリポジトリにも追加する
- 大文字/小文字を正確に扱う（特にLinuxサーバー環境では重要）

### ファイルダウンロード機能

- download.phpファイルが正しく機能しているか確認する
- assets/ディレクトリ内のPDFとZIPファイルが正しく配置されているか確認
- .htaccessファイルのMIME設定が正しいか確認

### .gitattributes ファイルの活用

- バイナリファイル（画像など）の扱いを明示的に指定:
  ```
  *.png binary
  *.jpg binary
  *.jpeg binary
  *.pdf binary
  *.zip binary
  ```
- これによりGitでの画像ファイル取り扱いが改善される

### チーム開発のポイント

- 変更を加える前に必ず最新の状態を取得（`git pull`）
- コミットメッセージは具体的に記述し、変更内容が分かるようにする
- ローカル環境と本番環境の違いを認識し、適切に対処する
- 問題が発生した場合は、本マニュアルのトラブルシューティングセクションを参照

### マニュアル管理のポイント

- マニュアルファイルは `manual` ディレクトリ内に保存
- ファイル名の例：`fun-link-manual-20250419.md`（日付を含める命名規則）
- リポジトリにプッシュすると自動的にGoogleドライブにも同期される

## 8. 今後の参考情報

### 新機能追加時のワークフロー
1. ローカルで開発とテスト
2. GitHubにプッシュ
3. 自動デプロイを確認
4. 本番環境でテスト

### 問題が発生した場合の確認項目
1. サーバーの `deploy-log.txt` を確認
2. .htaccessファイルのMIME設定を確認
3. PHPスクリプトのエラーログを確認

## 9. GitHub-GoogleDrive自動同期システム

### 9.1 概要

マニュアルファイルの管理と共有を効率化するため、GitHubリポジトリとGoogleドライブ間の自動同期システムを導入しました。これにより、GitHubリポジトリにマニュアルファイルをプッシュすると、自動的に指定したGoogleドライブフォルダに同期されるようになります。

**主な利点:**
- マニュアル更新の手順簡略化
- チーム間での最新版共有の効率化
- 一元管理によるバージョン管理の強化

### 9.2 システム構成

この自動同期システムは以下のコンポーネントで構成されています：

1. **GitHub Actions**: マニュアルファイルの変更を検知し、自動処理を実行
2. **Google Drive API**: Googleドライブとの連携を行うAPI
3. **Pythonスクリプト**: ファイル同期処理を実行するスクリプト

### 9.3 同期対象ファイル

以下のパターンに一致するファイルが同期対象となります：
- `*manual-update*.md` - 以前の命名規則によるマニュアルファイル
- `manual/*.md` - 新しい構造でのマニュアルファイル

例：
- manual/fun-link-manual-20250419.md
- 旧: fun-link-manual-update-20250419.md

### 9.4 ファイル更新ワークフロー

新しいワークフローは以下のように簡略化されています：

1. マニュアル更新内容を生成
2. マニュアルファイルをダウンロード
3. `/manual/`ディレクトリ内にファイルを配置
4. GitHubリポジトリにプッシュ（コミット）
5. 自動的にGoogleドライブに同期される

**従来のワークフローとの比較:**
- **従来**: マニュアル作成 → ダウンロード → **手動でGoogleドライブにアップロード**
- **現在**: マニュアル作成 → ダウンロード → GitHubにプッシュ → **自動的に**Googleドライブに同期

### 9.5 設定内容

GitHub Actionsに以下の設定を行いました：

#### 9.5.1 同期スクリプト

`.github/scripts/upload_to_drive.py` に以下の処理を行うPythonスクリプトを設置：
- Google Drive APIを使用した認証
- 同期対象ファイルの検索
- 既存ファイルの更新または新規作成

#### 9.5.2 ワークフロー設定

`.github/workflows/google-drive-sync.yml` に以下の設定：
```yaml
name: Google Drive Sync

on:
  push:
    branches: [ main ]
    paths:
      - '*manual-update*.md'
      - 'manual/*.md'
  workflow_dispatch:  # 手動実行用トリガー

jobs:
  sync-to-drive:
    runs-on: ubuntu-latest
    
    steps:
      - name: リポジトリのチェックアウト
        uses: actions/checkout@v3

      - name: Python環境のセットアップ
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
          cache: 'pip'

      - name: 依存関係のインストール
        run: |
          python -m pip install --upgrade pip
          pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib

      - name: Google Driveとの同期
        env:
          GOOGLE_DRIVE_CREDENTIALS: ${{ secrets.GOOGLE_DRIVE_CREDENTIALS }}
          GOOGLE_DRIVE_FOLDER_ID: ${{ secrets.GOOGLE_DRIVE_FOLDER_ID }}
        run: python .github/scripts/upload_to_drive.py
```

#### 9.5.3 認証情報の管理

GitHub Secretsに以下の情報を保存：
- `GOOGLE_DRIVE_CREDENTIALS`: Google API認証情報（JSONキー）
- `GOOGLE_DRIVE_FOLDER_ID`: 同期先GoogleドライブフォルダのID

### 9.6 トラブルシューティング

同期処理に問題が発生した場合は、以下を確認してください：

1. **GitHub Actionsのログ確認**:
   - リポジトリの「Actions」タブから実行ログを確認
   - エラーメッセージを特定

2. **認証情報の確認**:
   - Google API認証情報が正しく設定されているか
   - フォルダIDが正しいか

3. **一般的な問題**:
   - ファイル名のパターンが同期対象になっているか
   - Google API使用制限に達していないか

4. **手動同期の実施**:
   - 問題解決までは従来の手動アップロード方式で対応

### 9.7 今後の拡張可能性

- 同期対象ファイルの拡張（画像、PDFなど）
- 双方向同期の導入（Googleドライブからの変更をGitHubに反映）
- 変更通知システムの追加

## 10. Git操作の主要コマンド一覧

### 基本操作

```bash
# リポジトリのクローン
git clone https://github.com/fun-link/fun-link-website.git

# 変更の確認
git status

# 変更のステージング
git add ファイル名
git add .  # すべての変更をステージング

# コミット
git commit -m "コミットメッセージ"

# リモートリポジトリからの更新取得
git pull origin main

# 変更のプッシュ
git push origin main
```

### トラブルシューティング用コマンド

```bash
# ローカルの変更を破棄
git checkout -- ファイル名
git reset --hard  # すべての変更を破棄

# リモート追跡ブランチの設定
git branch --set-upstream-to=origin/main main

# 競合の解消
git fetch
git reset --hard origin/main  # リモートの状態に強制的に合わせる

# ファイルの削除
git rm ファイル名
git commit -m "ファイルを削除"
```

---

最終更新日: 2025年4月19日