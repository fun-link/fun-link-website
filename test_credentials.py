#!/usr/bin/env python3
import os
import json
import sys

# 環境変数から認証情報を取得
credentials_json = os.environ.get('GOOGLE_DRIVE_CREDENTIALS')

try:
    # JSONとして解析できるか確認
    credentials_info = json.loads(credentials_json)
    
    # 必要なフィールドが存在するか確認
    required_fields = [
        "type", "project_id", "private_key_id", "private_key",
        "client_email", "client_id", "auth_uri", "token_uri"
    ]
    
    missing_fields = [field for field in required_fields if field not in credentials_info]
    
    if missing_fields:
        print(f"エラー: 以下のフィールドがありません: {', '.join(missing_fields)}")
        sys.exit(1)
    
    print("認証情報のJSON形式は正しいです")
    print(f"サービスアカウントメール: {credentials_info.get('client_email')}")
    sys.exit(0)
    
except json.JSONDecodeError:
    print("エラー: 認証情報がJSON形式ではありません")
    sys.exit(1)
except Exception as e:
    print(f"エラー: {e}")
    sys.exit(1)
