<?php
// GitHubからのWebhookを処理するスクリプト
$log_file = 'deploy-log.txt';
$repo_dir = '/home/besttrust/temp-repo';
$web_root = '/home/besttrust/fun-link.online/public_html';

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

// ファイルをウェブディレクトリにコピー
$output = [];
exec('cp -r ' . $repo_dir . '/css ' . $web_root . '/ 2>&1', $output);
exec('cp -r ' . $repo_dir . '/js ' . $web_root . '/ 2>&1', $output);
exec('cp ' . $repo_dir . '/index.html ' . $web_root . '/ 2>&1', $output);
$copy_output = implode("\n", $output);
write_log("File copy output: " . $copy_output);

echo "Deployment completed. Check deploy-log.txt for details.";
