# DailyTrack ビルド＆リリースガイド（Windows版）

このガイドでは、WindowsでDailyTrackアプリをビルドし、App StoreとGoogle Play Storeにリリースする手順を説明します。

## 前提条件

- Node.js (v18以上)
- npm または yarn
- Expoアカウント
- Apple Developer Program アカウント（iOSの場合、年間$99）
- Google Play Console アカウント（Androidの場合、初回のみ$25）

---

## ステップ1: Expoアカウントのセットアップ

### 1.1 アカウント作成

1. https://expo.dev にアクセス
2. 「Sign Up」をクリックしてアカウントを作成
3. メールアドレスを確認

### 1.2 EAS CLIでログイン

```bash
eas login
```

メールアドレスとパスワードを入力してログインします。

---

## ステップ2: プロジェクトの初期化

### 2.1 プロジェクトIDの取得

```bash
eas init
```

このコマンドで以下が実行されます：
- Expoプロジェクトの作成
- プロジェクトIDの生成
- `app.json`への自動設定

### 2.2 app.jsonの編集

`app.json`ファイルを開き、以下を自分の情報に変更してください：

```json
{
  "expo": {
    "name": "DailyTrack",
    "slug": "dailytrack",
    "ios": {
      "bundleIdentifier": "com.yourcompany.dailytrack",  // ← 変更
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.dailytrack",  // ← 変更
      "versionCode": 1
    }
  }
}
```

**注意**:
- `bundleIdentifier`と`package`は一意である必要があります
- 通常は逆ドメイン形式を使用（例: `com.yourname.dailytrack`）

---

## ステップ3: Androidビルド

### 3.1 ビルドの実行

```bash
npm run build:android
```

または

```bash
eas build --platform android
```

### 3.2 キーストアの設定

初回ビルド時に、以下の質問が表示されます：

```
? Would you like to automatically create a keystore?
```

**推奨**: `Yes`を選択してEASに自動生成させます。

EASがキーストアを安全に管理してくれるため、手動で管理する必要はありません。

### 3.3 ビルドプロファイルの選択

```
? Select a build profile: (Use arrow keys)
❯ production
  preview
  development
```

**初回テスト**: `preview`を選択（APKファイルが生成されます）
**本番リリース**: `production`を選択（AABファイルが生成されます）

### 3.4 ビルドの監視

ビルドはExpoのクラウドサーバーで実行されます：

- ブラウザで https://expo.dev にアクセス
- 「Builds」セクションでビルドの進行状況を確認
- 完了したらAPK/AABファイルをダウンロード

---

## ステップ4: iOSビルド（Windows可能）

### 4.1 Apple Developer Program登録

1. https://developer.apple.com にアクセス
2. Apple Developer Programに登録（年間$99）
3. 登録完了まで1-2日かかる場合があります

### 4.2 App IDの作成

1. Apple Developer Console（https://developer.apple.com/account）にログイン
2. 「Certificates, IDs & Profiles」を選択
3. 「Identifiers」→「+」ボタンをクリック
4. 「App IDs」を選択
5. Bundle ID: `com.yourcompany.dailytrack`（app.jsonと同じ）を入力

### 4.3 ビルドの実行

```bash
npm run build:ios
```

または

```bash
eas build --platform ios
```

### 4.4 Apple認証情報の提供

ビルド時に以下が求められます：

1. **Apple ID**: Apple Developer Programのアカウント
2. **App-Specific Password**:
   - https://appleid.apple.com にアクセス
   - 「セキュリティ」→「App用パスワード」を生成

EASが自動的にプロビジョニングプロファイルと証明書を管理します。

---

## ステップ5: Google Play Storeへの申請

### 5.1 Google Play Consoleのセットアップ

1. https://play.google.com/console にアクセス
2. 開発者アカウントを作成（初回のみ$25）
3. 新しいアプリを作成：
   - アプリ名: DailyTrack
   - デフォルト言語: 日本語
   - アプリまたはゲーム: アプリ
   - 無料または有料: 無料

### 5.2 アプリの詳細情報を入力

「ストアの設定」セクションで以下を入力：

- **アプリ名**: DailyTrack - 習慣トラッカー
- **簡単な説明**: STORE_LISTING.mdを参照
- **詳しい説明**: STORE_LISTING.mdを参照
- **アプリのアイコン**: 512x512 PNG
- **スクリーンショット**: 最低2枚（推奨4-8枚）
- **カテゴリ**: 仕事効率化

### 5.3 コンテンツレーティング

「コンテンツレーティング」セクションで：

1. アンケートに回答
2. レーティングを取得（通常は「3歳以上」）

### 5.4 EAS Submitでアップロード

まず、productionビルドを作成：

```bash
eas build --platform android --profile production
```

ビルド完了後、Google Play Storeに申請：

```bash
npm run submit:android
```

または

```bash
eas submit --platform android
```

以下の情報を入力：

- **ビルドを選択**: 最新のproductionビルドを選択
- **Service Account JSON**: Google Play Consoleから取得（下記参照）

### 5.5 Service Account JSONの取得

1. Google Play Console → 「設定」→「APIアクセス」
2. 「新しいサービスアカウントを作成」
3. Google Cloud Platformでサービスアカウントを作成
4. JSON鍵をダウンロード
5. Play ConsoleでサービスアカウントにPlayストアへのアクセス権を付与

### 5.6 審査に提出

1. Google Play Consoleで「リリース」→「本番環境」
2. 「新しいリリースを作成」
3. アップロードされたAABファイルを確認
4. リリースノートを入力
5. 「審査に送信」

審査は通常1-3日かかります。

---

## ステップ6: App Storeへの申請

### 6.1 App Store Connectのセットアップ

1. https://appstoreconnect.apple.com にアクセス
2. 「マイApp」→「+」→「新規App」
3. 以下を入力：
   - **プラットフォーム**: iOS
   - **名前**: DailyTrack
   - **主要言語**: 日本語
   - **バンドルID**: app.jsonで設定したもの
   - **SKU**: dailytrack-001（一意の識別子）

### 6.2 アプリ情報の入力

1. **App情報**:
   - プライバシーポリシーURL（任意）
   - カテゴリ: 仕事効率化
   - サブカテゴリ: なし

2. **価格と配信可能状況**:
   - 価格: 無料
   - 配信可能国: すべての国

3. **App Privacy**:
   - 「データを収集しない」を選択（ローカルストレージのみ使用）

### 6.3 スクリーンショットの準備

必要なサイズ：
- **iPhone 6.7インチ**: 1290 x 2796 (必須)
- **iPhone 6.5インチ**: 1242 x 2688
- **iPad Pro 12.9インチ**: 2048 x 2732

### 6.4 EAS Submitでアップロード

まず、productionビルドを作成：

```bash
eas build --platform ios --profile production
```

ビルド完了後、App Storeに申請：

```bash
npm run submit:ios
```

または

```bash
eas submit --platform ios
```

以下の情報を入力：

- **Apple ID**: Apple Developer Programのアカウント
- **App-Specific Password**: 事前に生成したもの
- **ビルドを選択**: 最新のproductionビルドを選択

### 6.5 App Store Connectで最終設定

1. App Store Connectにログイン
2. アップロードされたビルドがProcessing完了するのを待つ（5-30分）
3. 「App Store」タブで：
   - スクリーンショットをアップロード
   - 説明文を入力（STORE_LISTING.mdを参照）
   - キーワードを入力
   - サポートURLを入力
4. 「審査に送信」をクリック

審査は通常1-3日かかります（最初のリリースは長くなることがあります）。

---

## トラブルシューティング

### Android: ビルドが失敗する

```bash
# キャッシュをクリア
npx expo start -c

# node_modulesを再インストール
rm -rf node_modules
npm install

# 再度ビルド
eas build --platform android --clear-cache
```

### iOS: プロビジョニングプロファイルエラー

```bash
# 認証情報をリセット
eas credentials

# 「iOS」→「Build Credentials」→「Remove all credentials」
# 再度ビルドを実行
```

### EAS Submit: サービスアカウントエラー

- Service Account JSONファイルが正しいか確認
- Google Play Consoleでアクセス権限を確認
- JSONファイルを再ダウンロードして再試行

---

## アップデート方法

### バージョン番号の更新

`app.json`を編集：

```json
{
  "expo": {
    "version": "1.0.1",  // ← バージョンアップ
    "ios": {
      "buildNumber": "2"  // ← インクリメント
    },
    "android": {
      "versionCode": 2  // ← インクリメント
    }
  }
}
```

### ビルドと申請

```bash
# ビルド
eas build --platform all

# 申請
eas submit --platform android
eas submit --platform ios
```

---

## 便利なコマンド一覧

```bash
# ログイン
eas login

# ビルド状態の確認
eas build:list

# ビルドの詳細表示
eas build:view [BUILD_ID]

# プロジェクト情報の表示
eas project:info

# 認証情報の管理
eas credentials

# デバイスの登録（iOSテスト用）
eas device:create
```

---

## 参考リンク

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

---

## サポート

問題が発生した場合：
1. Expo Discord: https://chat.expo.dev/
2. Expo Forums: https://forums.expo.dev/
3. Stack Overflow: タグ `expo`, `eas-build`
