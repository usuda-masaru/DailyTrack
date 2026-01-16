# DailyTrack iOS アプリ リリースガイド

このドキュメントは、React Native (Expo) アプリを iOS App Store にリリースするまでの手順をまとめたものです。

---

## 目次

1. [全体フロー図](#全体フロー図)
2. [前提条件](#前提条件)
3. [開発環境のセットアップ](#開発環境のセットアップ)
4. [アプリの実装](#アプリの実装)
5. [App Store 申請準備](#app-store-申請準備)
6. [EAS Build でのビルド](#eas-build-でのビルド)
7. [App Store Connect での設定](#app-store-connect-での設定)
8. [審査提出と公開](#審査提出と公開)
9. [トラブルシューティング](#トラブルシューティング)

---

## 全体フロー図

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         iOS App Store リリースフロー                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   開発準備    │ -> │  アプリ開発   │ -> │  素材準備     │ -> │  ビルド      │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │                   │
       v                   v                   v                   v
  ・Node.js           ・機能実装          ・アイコン           ・EAS CLI
  ・Expo CLI          ・UI作成            (1024x1024)         ・eas build
  ・Apple Developer   ・テスト            ・スクリーンショット  ・credentials
    Program ($99)                         ・プライバシー
                                           ポリシー

       │                   │                   │                   │
       └───────────────────┴───────────────────┴───────────────────┘
                                      │
                                      v
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  ASC 設定    │ -> │  審査提出     │ -> │  審査待ち     │ -> │   公開！     │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │                   │
       v                   v                   v                   v
  ・アプリ作成         ・eas submit       ・1-3日            ・App Storeで
  ・メタデータ         ・ビルド選択       ・メール通知          検索可能
  ・スクリーンショット  ・審査に追加                          ・ダウンロード
  ・価格設定                                                   可能
```

---

## 前提条件

### 必要なアカウント

| アカウント | 用途 | 費用 |
|-----------|------|------|
| Apple ID | Apple Developer Program 登録 | 無料 |
| Apple Developer Program | App Store 公開 | $99/年 |
| Expo アカウント | EAS Build 使用 | 無料〜 |
| GitHub アカウント | プライバシーポリシー公開 | 無料 |

### 必要な環境

```bash
# Node.js (v18以上推奨)
node --version

# npm または yarn
npm --version

# Expo CLI
npm install -g expo-cli

# EAS CLI
npm install -g eas-cli
```

---

## 開発環境のセットアップ

### 1. プロジェクト作成

```bash
# Expo プロジェクト作成
npx create-expo-app DailyTrack --template blank-typescript

# プロジェクトディレクトリに移動
cd DailyTrack

# 依存関係インストール
npm install
```

### 2. 必要なパッケージのインストール

```bash
# ナビゲーション
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# カレンダー
npm install react-native-calendars

# ローカルストレージ
npm install @react-native-async-storage/async-storage
```

### 3. プロジェクト構造

```
DailyTrack/
├── App.tsx                 # エントリーポイント
├── app.json               # Expo 設定
├── eas.json               # EAS Build 設定
├── package.json           # 依存関係
├── assets/
│   ├── icon.png           # アプリアイコン (1024x1024)
│   ├── splash-icon.png    # スプラッシュ画面
│   └── images/            # その他画像
├── src/
│   ├── types/
│   │   └── index.ts       # 型定義
│   ├── utils/
│   │   └── storage.ts     # AsyncStorage ユーティリティ
│   ├── components/
│   │   └── HabitItem.tsx  # 再利用可能コンポーネント
│   └── screens/
│       ├── MainCalendarScreen.tsx    # メインカレンダー
│       ├── HabitCalendarScreen.tsx   # 個別習慣カレンダー
│       └── ManageHabitsScreen.tsx    # 習慣管理
├── docs/
│   └── index.html         # プライバシーポリシー (GitHub Pages用)
└── screenshots/
    ├── iphone_67/         # 6.7インチ用 (1290x2796)
    └── iphone_65/         # 6.5インチ用 (1242x2688)
```

---

## アプリの実装

### app.json の設定（iOS用）

```json
{
  "expo": {
    "name": "DailyTrack",
    "slug": "dailytrack",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.yourname.appname",
      "buildNumber": "1",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      },
      "config": {
        "usesNonExemptEncryption": false
      }
    },
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
```

### 重要な設定項目

| 項目 | 説明 | 注意点 |
|------|------|--------|
| `supportsTablet` | iPad対応 | `false`にするとiPadスクリーンショット不要 |
| `bundleIdentifier` | アプリの一意識別子 | 一度設定すると変更不可 |
| `ITSAppUsesNonExemptEncryption` | 暗号化使用の有無 | `false`で輸出コンプライアンス簡略化 |
| `NSUserTrackingUsageDescription` | トラッキング説明 | **使用しない場合は設定しない** |

---

## App Store 申請準備

### 1. アプリアイコン

```
サイズ: 1024 x 1024 ピクセル
形式: PNG (透過なし)
角丸: 自動適用されるので四角で作成
配置: assets/icon.png
```

### 2. スクリーンショット

```
必須サイズ:
├── iPhone 6.7インチ: 1290 x 2796 ピクセル
└── iPhone 6.5インチ: 1242 x 2688 ピクセル

枚数: 各サイズ 1〜10枚 (推奨: 5枚)
形式: PNG または JPEG
内容: アプリの主要機能を示す画面
```

#### スクリーンショット作成のコツ

1. Expo Go または シミュレータでスクリーンショット撮影
2. Canva などで文字オーバーレイを追加
3. Python スクリプトで正確なサイズにリサイズ

```python
# resize_images.py
from PIL import Image
import os

def resize_image(input_path, output_path, target_size):
    img = Image.open(input_path)
    img_resized = img.resize(target_size, Image.LANCZOS)
    img_resized.save(output_path, quality=95)

# 6.7インチ用
resize_image("input.png", "output_67.png", (1290, 2796))

# 6.5インチ用
resize_image("input.png", "output_65.png", (1242, 2688))
```

### 3. プライバシーポリシー

GitHub Pages で公開する場合:

```
DailyTrack/
└── docs/
    └── index.html  # プライバシーポリシー
```

GitHub リポジトリの Settings → Pages → Source を `docs/` に設定

URL例: `https://username.github.io/DailyTrack/`

---

## EAS Build でのビルド

### 1. EAS CLI ログイン

```bash
# Expo アカウントにログイン
eas login
```

### 2. EAS プロジェクト初期化

```bash
# EAS プロジェクト初期化
eas init

# プロジェクト作成の確認に「Yes」
# プロジェクトIDが app.json に追加される
```

### 3. eas.json 設定

```json
{
  "cli": {
    "version": ">= 13.2.0",
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### 4. iOS ビルド実行

```bash
# iOS プロダクションビルド
eas build --platform ios
```

ビルド中の質問:
1. **Apple ID**: Apple Developer アカウントのメールアドレス
2. **パスワード**: Apple ID のパスワード
3. **2要素認証**: iPhone に届くコードを入力

### 5. ビルド完了確認

```
✔ Build finished
🍏 iOS app: https://expo.dev/artifacts/eas/xxxxx.ipa
```

---

## App Store Connect での設定

### 1. アプリ作成

1. https://appstoreconnect.apple.com/ にアクセス
2. 「マイApp」→「+」→「新規App」
3. 以下を入力:
   - プラットフォーム: iOS
   - 名前: アプリ名
   - プライマリ言語: 日本語
   - バンドルID: app.json の bundleIdentifier
   - SKU: 任意の識別子

### 2. メタデータ入力

| 項目 | 必須 | 内容 |
|------|------|------|
| スクリーンショット | ✅ | 6.7インチ、6.5インチ |
| 概要（説明文） | ✅ | アプリの機能説明 |
| キーワード | ✅ | 検索用キーワード（カンマ区切り） |
| サポートURL | ✅ | プライバシーポリシーURL可 |
| プライバシーポリシーURL | ✅ | GitHub Pages URL |
| バージョン | ✅ | 1.0.0 |
| 著作権 | ✅ | © 2026 Your Name |
| プロモーション用テキスト | ❌ | 任意 |
| マーケティングURL | ❌ | 任意 |

### 3. 年齢制限指定

すべて「なし」を選択 → **4+** (全年齢対象)

### 4. 価格設定

「価格および配信状況」→「無料」を選択

### 5. プライバシー設定

「アプリのプライバシー」→「プライバシーの取り組みを編集」
- データ収集しない場合: 「いいえ、このアプリはユーザーデータを収集しません」

---

## 審査提出と公開

### 1. ビルドを App Store Connect に提出

```bash
eas submit --platform ios
```

質問への回答:
1. **What would you like to submit?** → Select a build from EAS
2. **Which build would you like to submit?** → 最新のビルドを選択

### 2. ビルド選択

App Store Connect で:
1. 「ビルド」セクション → 「+」
2. アップロードされたビルドを選択
3. 「輸出コンプライアンス」→「いいえ」

### 3. 審査に提出

1. すべての必須項目を入力
2. 「保存」→「審査に追加」→「提出」

### 4. 審査待ち

```
審査期間: 通常 24〜48時間
ステータス遷移: 審査待ち → 審査中 → 承認済み
通知: メールで結果通知
```

### 5. 公開

審査承認後:
1. 「価格および配信状況」に移動
2. 配信可能な国・地域を選択
3. 「保存」

App Store での反映: **2〜24時間**

---

## トラブルシューティング

### よくあるエラーと解決策

#### 1. iPadスクリーンショット要求エラー

```
エラー: 13インチのiPadディスプレイのスクリーンショットをアップロードする必要があります
```

**解決策**: `app.json` で `supportsTablet: false` に設定

```json
"ios": {
  "supportsTablet": false
}
```

#### 2. NSUserTrackingUsageDescription エラー

```
エラー: アプリにはNSUserTrackingUsageDescriptionが含まれており...
```

**解決策**: `app.json` から `NSUserTrackingUsageDescription` を削除

#### 3. API Key 認証エラー

```
エラー: Cannot verify client's JWT headers
```

**解決策**:
```bash
# 古い API Key を削除
eas credentials
# iOS → production → App Store Connect: Manage your API Key → Delete an API Key

# 再度提出
eas submit --platform ios
```

#### 4. ビルドがキューで待機

```
Waiting in Free tier queue
```

**解決策**:
- 無料プランでは数時間待つことがある
- 有料プラン ($29/月) で優先キュー利用可能

---

## チェックリスト

### リリース前チェック

- [ ] Apple Developer Program に登録済み ($99/年)
- [ ] Expo アカウント作成済み
- [ ] app.json の bundleIdentifier 設定済み
- [ ] アイコン (1024x1024) 作成済み
- [ ] スクリーンショット (6.7", 6.5") 作成済み
- [ ] プライバシーポリシー公開済み
- [ ] EAS でビルド完了
- [ ] App Store Connect でアプリ作成済み
- [ ] メタデータ入力完了
- [ ] プライバシー設定完了
- [ ] 年齢制限指定完了
- [ ] 価格設定完了

### 提出後チェック

- [ ] 審査ステータス確認
- [ ] TestFlight でテスト
- [ ] 審査承認メール受信
- [ ] 配信国・地域設定
- [ ] App Store での表示確認

---

## 参考リンク

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

---

*このドキュメントは DailyTrack アプリのリリース経験を基に作成されました。*
*最終更新: 2026年1月*
