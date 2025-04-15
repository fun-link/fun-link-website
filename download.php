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
