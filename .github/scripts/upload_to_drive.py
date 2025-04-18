# リポジトリをクローン（すでにクローン済みなら不要）
git clone https://github.com/fun-link/fun-link-website.git
cd fun-link-website

# 必要なディレクトリを作成
mkdir -p .github/workflows
mkdir -p .github/scripts

# ファイルを作成
# ワークフローファイルの内容をコピー＆ペースト
vi .github/workflows/google-drive-sync.yml
# Pythonスクリプトの内容をコピー＆ペースト
vi .github/scripts/upload_to_drive.py

# Pythonスクリプトに実行権限を付与
chmod +x .github/scripts/upload_to_drive.py

# 変更をコミットしてプッシュ
git add .github
git commit -m "Google Drive同期用のGitHub Actions設定を追加"
git push origin main
