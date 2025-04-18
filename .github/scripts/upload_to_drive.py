#!/usr/bin/env python3
import os
import json
import glob
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from oauth2client.service_account import ServiceAccountCredentials

try:
    # 認証情報の設定
    credentials_json = os.environ.get('GOOGLE_DRIVE_CREDENTIALS')
    credentials_info = json.loads(credentials_json)
    credentials = ServiceAccountCredentials.from_json_keyfile_dict(
        credentials_info,
        scopes=['https://www.googleapis.com/auth/drive']
    )
    drive_service = build('drive', 'v3', credentials=credentials)
    
    # フォルダID
    folder_id = os.environ.get('GOOGLE_DRIVE_FOLDER_ID')
    
    # マニュアルファイルの検索と同期
    manual_files = glob.glob('**/*manual-update*.md', recursive=True)
    print(f"見つかったファイル: {manual_files}")
    
    for file_path in manual_files:
        file_name = os.path.basename(file_path)
        print(f"処理中: {file_name}")
        
        # 同じ名前のファイルを検索
        results = drive_service.files().list(
            q=f"name='{file_name}' and '{folder_id}' in parents and trashed=false",
            fields="files(id, name)"
        ).execute()
        
        existing_files = results.get('files', [])
        
        file_metadata = {
            'name': file_name,
            'parents': [folder_id]
        }
        
        media = MediaFileUpload(
            file_path,
            mimetype='text/markdown',
            resumable=True
        )
        
        if existing_files:
            file_id = existing_files[0]['id']
            drive_service.files().update(
                fileId=file_id,
                body=file_metadata,
                media_body=media
            ).execute()
            print(f"ファイルを更新しました: {file_name}")
        else:
            drive_service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()
            print(f"ファイルを作成しました: {file_name}")
    
    print("同期が完了しました！")
except Exception as e:
    print(f"エラーが発生しました: {e}")
