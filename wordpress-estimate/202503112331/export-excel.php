<?php
/**
 * WordPressサーバー移転サービス 見積りフォーム Excel出力スクリプト
 * @version 1.0.0
 * @author WordPress移転サービス
 */

// エラーレポート設定
error_reporting(E_ALL);
ini_set('display_errors', 1);

// PHPSpreadsheetを使用する場合はComposerが必要
// 以下の手順でインストール:
// 1. composerをインストール (https://getcomposer.org)
// 2. コマンドプロンプトで以下を実行:
//    composer require phpoffice/phpspreadsheet

// Composerのオートロード（PHPSpreadsheet使用時にコメント解除）
// require 'vendor/autoload.php';
// use PhpOffice\PhpSpreadsheet\Spreadsheet;
// use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
// use PhpOffice\PhpSpreadsheet\Style\Fill;
// use PhpOffice\PhpSpreadsheet\Style\Border;
// use PhpOffice\PhpSpreadsheet\Style\Alignment;

// POSTデータを取得（JavaScriptからのリクエスト）
$formData = $_POST;

// 現在の日付を取得
$now = date('YmdHis');
$dateFormatted = date('Y年m月d日');

// POSTデータのデバッグログ（本番環境では無効にしてください）
$logFile = 'export-log.txt';
file_put_contents($logFile, print_r($formData, true));

// PHPSpreadsheetを使用する場合のコード（コメント解除して使用）
/*
// 新しいスプレッドシートを作成
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();
$sheet->setTitle('見積書');

// ヘッダーを設定
$sheet->setCellValue('A1', 'WordPressサーバー移転・ドメイン移管・CMS移行サービス 見積書');
$sheet->mergeCells('A1:D1');
$sheet->setCellValue('A2', '作成日: ' . $dateFormatted);
$sheet->mergeCells('A2:D2');

// スタイリング（ヘッダー）
$sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
$sheet->getStyle('A1:D1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('EEEEEE');

// 基本情報を設定
$sheet->setCellValue('A4', '基本情報');
$sheet->mergeCells('A4:D4');
$sheet->getStyle('A4')->getFont()->setBold(true);

$row = 5;
// 顧客情報を追加
$sheet->setCellValue('A'.$row, 'サイトURL:');
$sheet->setCellValue('B'.$row, $formData['siteUrl'] ?? '');
$row++;

$sheet->setCellValue('A'.$row, 'WordPress バージョン:');
$sheet->setCellValue('B'.$row, $formData['wpVersion'] ?? '');
$row++;

$sheet->setCellValue('A'.$row, 'PHP バージョン:');
$sheet->setCellValue('B'.$row, $formData['phpVersion'] ?? '');
$row++;

$sheet->setCellValue('A'.$row, 'サイト容量:');
$sheet->setCellValue('B'.$row, ($formData['siteSize'] ?? '0') . ' GB');
$row += 2;

// サーバー情報
$sheet->setCellValue('A'.$row, 'サーバー情報');
$sheet->mergeCells('A'.$row.':D'.$row);
$sheet->getStyle('A'.$row)->getFont()->setBold(true);
$row++;

$sheet->setCellValue('A'.$row, '現在のサーバー:');
$sheet->setCellValue('B'.$row, $formData['currentServer'] ?? '');
$row++;

$sheet->setCellValue('A'.$row, '新しいサーバー:');
$sheet->setCellValue('B'.$row, $formData['newServer'] ?? '');
$row += 2;

// 項目テーブルのヘッダー
$sheet->setCellValue('A'.$row, '見積り内容');
$sheet->mergeCells('A'.$row.':D'.$row);
$sheet->getStyle('A'.$row)->getFont()->setBold(true);
$row++;

$sheet->setCellValue('A'.$row, '項目');
$sheet->setCellValue('B'.$row, '説明');
$sheet->setCellValue('C'.$row, '単価');
$sheet->setCellValue('D'.$row, '小計');
$sheet->getStyle('A'.$row.':D'.$row)->getFont()->setBold(true);
$sheet->getStyle('A'.$row.':D'.$row)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('DDDDDD');
$row++;

// 基本料金
$sheet->setCellValue('A'.$row, '基本料金');
$sheet->setCellValue('B'.$row, '必須');
$sheet->setCellValue('C'.$row, '12,000');
$sheet->setCellValue('D'.$row, '12,000');
$sheet->getStyle('A'.$row.':D'.$row)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('FFFFCC');
$row++;

// サーバー情報やオプションの処理は省略（実際には各POST値に応じて処理）

// 合計金額
$row += 2;
$total = $formData['displayTotal'] ?? 12000;
$sheet->setCellValue('A'.$row, '合計金額（税込）');
$sheet->mergeCells('A'.$row.':C'.$row);
$sheet->setCellValue('D'.$row, number_format($total) . '円');
$sheet->getStyle('A'.$row.':D'.$row)->getFont()->setBold(true);
$sheet->getStyle('A'.$row.':D'.$row)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('FFEEEE');

// 列幅の調整
$sheet->getColumnDimension('A')->setWidth(30);
$sheet->getColumnDimension('B')->setWidth(40);
$sheet->getColumnDimension('C')->setWidth(10);
$sheet->getColumnDimension('D')->setWidth(15);

// 数値のスタイリング
$sheet->getStyle('C8:D'.$row)->getNumberFormat()->setFormatCode('#,##0');

// 通貨のセルを右揃えに
$sheet->getStyle('C8:D'.$row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

// Excelファイルとして出力
$writer = new Xlsx($spreadsheet);
$filename = 'wordpress_estimate_' . $now . '.xlsx';

header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="' . $filename . '"');
header('Cache-Control: max-age=0');

$writer->save('php://output');
exit;
*/

// PHPSpreadsheetがない場合の代替策（シンプルなCSV出力）
header('Content-Type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="wordpress_estimate_'.$now.'.csv"');

// 出力バッファを開始
ob_start();

// CSV出力用のファイルポインタを作成
$output = fopen('php://output', 'w');

// BOMを書き込み（Excelで開いた際に文字化けを防ぐ）
fputs($output, "\xEF\xBB\xBF");

// ヘッダー行
fputcsv($output, ['WordPressサーバー移転・ドメイン移管・CMS移行サービス 見積書']);
fputcsv($output, ['作成日:', $dateFormatted]);
fputcsv($output, []);

// 基本情報
fputcsv($output, ['基本情報']);
fputcsv($output, ['サイトURL', $formData['siteUrl'] ?? '']);
fputcsv($output, ['WordPress バージョン', $formData['wpVersion'] ?? '']);
fputcsv($output, ['PHP バージョン', $formData['phpVersion'] ?? '']);
fputcsv($output, ['サイト容量', ($formData['siteSize'] ?? '0') . ' GB']);
fputcsv($output, []);

// サーバー情報
fputcsv($output, ['サーバー情報']);
fputcsv($output, ['現在のサーバー', $formData['currentServer'] ?? '']);
fputcsv($output, ['新しいサーバー', $formData['newServer'] ?? '']);
fputcsv($output, []);

// 見積り内容
fputcsv($output, ['見積り内容']);
fputcsv($output, ['項目', '金額']);
fputcsv($output, ['基本料金', '12,000円']);

// 日時指定
if (isset($formData['dateChoice']) && $formData['dateChoice'] === 'specific') {
    fputcsv($output, ['日時指定あり', '10,000円']);
}

// SNS拡散割引
if (isset($formData['snsDiscount']) && $formData['snsDiscount'] === 'yes') {
    fputcsv($output, ['SNS拡散割引（5%）', '-' . number_format($formData['rawTotal'] * 0.05) . '円']);
}

// その他オプション（実際のPOST値に応じて処理）

// 合計金額
fputcsv($output, []);
fputcsv($output, ['合計金額（税込）', number_format($formData['displayTotal'] ?? 12000) . '円']);

// 出力バッファをフラッシュ
ob_end_flush();
?>