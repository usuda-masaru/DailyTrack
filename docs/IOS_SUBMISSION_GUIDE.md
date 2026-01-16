# iOS App Store 完全申請ガイド

WindowsからDailyTrackアプリをiOS App Storeに申請する完全な手順書です。

## 📋 事前準備

### 必要なもの

- [x] Apple Developer Program アカウント（年間$99）
- [x] アプリのビルド完了
- [ ] アプリアイコン（1024x1024）
- [ ] スクリーンショット（3-10枚）
- [ ] プライバシーポリシーのURL（Webに公開）

---

## ステップ1: プライバシーポリシーの公開

App Storeの審査では、プライバシーポリシーのURLが必要です。

### 方法1: GitHub Pagesで公開（無料・推奨）

1. **GitHubリポジトリを作成**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/dailytrack.git
   git push -u origin main
   ```

2. **GitHub Pagesを有効化**
   - GitHubのリポジトリページに移動
   - Settings → Pages
   - Source: `main` branch, `/ (root)`
   - Save

3. **PRIVACY_POLICY.mdをindex.mdとしてコピー**
   ```bash
   cp PRIVACY_POLICY.md docs/index.md
   git add docs/
   git commit -m "Add privacy policy"
   git push
   ```

4. **URLを確認**
   - https://YOUR_USERNAME.github.io/dailytrack/

### 方法2: 自分のWebサイトで公開

既存のWebサイトがある場合、そこにPRIVACY_POLICY.mdの内容を公開してください。

### 方法3: 無料Webホスティング

- Netlify: https://www.netlify.com/
- Vercel: https://vercel.com/
- Firebase Hosting: https://firebase.google.com/

---

## ステップ2: Apple Developer Programに登録

1. **Apple IDでログイン**
   - https://developer.apple.com/account

2. **Apple Developer Programに登録**
   - https://developer.apple.com/programs/enroll/
   - 個人: Individual
   - 会社: Organization
   - 費用: $99/年

3. **登録完了を待つ**
   - 通常24時間以内
   - メールで通知が届く

---

## ステップ3: App Store Connectでアプリを作成

### 3.1 App Store Connectにログイン

https://appstoreconnect.apple.com/

### 3.2 新しいアプリを作成

1. **「マイApp」をクリック**
2. **「+」ボタン → 「新規App」**
3. **以下を入力**:

   **プラットフォーム**: iOS

   **名前**: DailyTrack

   **プライマリ言語**: 日本語

   **バンドルID**: com.dailytrack.app

   **SKU**: dailytrack001（一意の識別子）

   **ユーザーアクセス**: フルアクセス

4. **「作成」をクリック**

### 3.3 アプリ情報を入力

#### App情報タブ

**名前**: DailyTrack

**サブタイトル**（30文字）:
```
習慣を記録してカレンダーで可視化
```

**カテゴリ**:
- プライマリ: 仕事効率化
- セカンダリ: ライフスタイル（オプション）

**コンテンツ権利**:
- 第三者のコンテンツを含む: いいえ

**年齢制限**: 4+（すべての年齢）

**プライバシーポリシーURL**:
```
https://YOUR_USERNAME.github.io/dailytrack/
```

#### 価格および配信可能状況

**価格**: 無料

**配信可能国**: すべての国（または選択）

---

## ステップ4: アプリのプライバシー情報

App Store Connectの「App Privacy」セクションで設定します。

### 4.1 データ収集

**質問**: このアプリはユーザーからデータを収集しますか？

**回答**: 「いいえ」を選択

### 4.2 データの種類

データを収集しないため、設定不要。

### 4.3 データの使用

データを収集しないため、設定不要。

### 4.4 App Tracking Transparency

**質問**: このアプリはユーザーをトラッキングしますか？

**回答**: 「いいえ」を選択

---

## ステップ5: アプリのバージョン情報

### 5.1 スクリーンショットをアップロード

**iPhone 6.7インチ**（必須）
- 1290 x 2796 px
- 3-10枚

**iPhone 6.5インチ**（必須）
- 1242 x 2688 px
- 3-10枚

**iPad Pro 12.9インチ**（オプション）
- 2048 x 2732 px

### 5.2 プロモーションテキスト（170文字）

```
毎日の習慣を簡単に記録。カレンダーで達成状況を可視化し、継続をサポート。完全オフラインで動作し、プライバシーを守ります。
```

### 5.3 説明（4000文字以内）

```
DailyTrackで習慣を身につけよう

DailyTrackは、あなたの習慣形成をサポートするシンプルで使いやすい習慣トラッカーアプリです。

【主な機能】

📝 自由に習慣を登録
筋トレ、英会話、読書、瞑想など、どんな習慣でも登録可能。カラフルなアイコンで各習慣を識別できます。

✅ 毎日の達成をチェック
カレンダーで日付を選択して、その日の習慣をワンタップでチェック。直感的なインターフェースで記録が簡単です。

📅 カレンダーで可視化
月間カレンダーで達成状況を一目で確認。各習慣をカラフルなドットで表示し、達成率を自動計算します。

📊 詳細な統計情報
各習慣ごとに専用のカレンダーと統計を表示。合計日数、現在の連続記録、最長連続記録を確認できます。

🔒 プライバシー重視
すべてのデータはお客様のデバイスにローカルで保存されます。インターネット接続は不要で、個人情報を一切収集しません。

🎯 シンプルで使いやすい
複雑な設定は不要。広告なし。オフラインで動作。

【こんな方におすすめ】
• 新しい習慣を身につけたい
• 日々のルーティンを記録したい
• 目標達成の進捗を可視化したい
• シンプルで使いやすいアプリを探している
• プライバシーを重視している

【特徴】
• 無制限の習慣登録
• 動的なタブ切り替え
• カラフルな習慣アイコン
• 月間達成率の表示
• 連続記録の追跡
• 完全オフライン動作
• データのプライバシー保護

今日からDailyTrackで習慣形成を始めましょう！
```

### 5.4 キーワード（100文字）

```
習慣,トラッカー,カレンダー,目標,達成,記録,日記,ルーティン,習慣化,継続
```

### 5.5 サポートURL（オプション）

```
https://YOUR_USERNAME.github.io/dailytrack/
```

### 5.6 マーケティングURL（オプション）

```
https://YOUR_USERNAME.github.io/dailytrack/
```

---

## ステップ6: EASでビルドを作成

### 6.1 EASにログイン

```bash
eas login
```

### 6.2 プロジェクトを初期化

```bash
eas init
```

プロジェクトIDが自動的に生成されます。

### 6.3 iOSのproductionビルドを作成

```bash
eas build --platform ios --profile production
```

### 6.4 Apple認証情報を提供

初回ビルド時に以下が求められます：

**Apple ID**: Apple Developer Programのアカウント

**App-Specific Password**:
1. https://appleid.apple.com にアクセス
2. 「セキュリティ」セクション
3. 「App用パスワード」を生成
4. パスワードをコピー

EASが自動的にプロビジョニングプロファイルと証明書を管理します。

### 6.5 ビルドの完了を待つ

- ビルドには10-30分かかります
- https://expo.dev でビルドの進行状況を確認
- 完了するとメールで通知

---

## ステップ7: EAS Submitで申請

### 7.1 App Store Connectに提出

```bash
eas submit --platform ios
```

### 7.2 ビルドを選択

最新のproductionビルドを選択します。

### 7.3 App Store Connectで確認

1. App Store Connectにログイン
2. 「マイApp」→ 「DailyTrack」
3. ビルドがProcessing中と表示される（5-30分）

---

## ステップ8: App Store Connectで最終設定

### 8.1 ビルドを選択

1. **「App Store」タブ**
2. **バージョン情報**で「ビルド」の横の「+」をクリック
3. **Processingが完了したビルドを選択**

### 8.2 審査ノートを入力

```
このアプリは習慣トラッキングアプリです。

主な機能:
1. 習慣の追加・削除
2. 日付を選択して習慣をチェック
3. カレンダーで達成状況を可視化
4. 個別習慣の統計情報表示

すべてのデータはローカルに保存され、インターネット接続は不要です。
個人情報の収集は一切行いません。

テスト手順:
1. アプリを起動
2. 右端の「管理」タブをタップ
3. 右下の「+」ボタンから習慣を追加（例：筋トレ）
4. 左端の「全習慣」タブに戻る
5. カレンダーで今日の日付をタップ
6. 習慣をタップしてチェック
7. カレンダーにドットが表示されることを確認
8. 追加した習慣のタブをタップして個別カレンダーを確認

ログインは不要です。
テストアカウントは不要です。
```

### 8.3 連絡先情報

審査チームが問題を発見した場合の連絡先を入力します。

---

## ステップ9: 審査に提出

### 9.1 最終チェック

- [ ] すべての必須項目が入力されている
- [ ] スクリーンショットがアップロードされている
- [ ] ビルドが選択されている
- [ ] プライバシー情報が設定されている
- [ ] 価格が設定されている

### 9.2 「審査に送信」をクリック

1. **右上の「審査に送信」ボタン**をクリック
2. **輸出コンプライアンス情報**:
   - 「いいえ」を選択（暗号化を使用していない）
3. **広告識別子 (IDFA)**:
   - 「いいえ」を選択（広告を表示していない）

### 9.3 確認

「送信」ボタンをクリックして確定します。

---

## ステップ10: 審査結果を待つ

### 審査のタイムライン

**ステータス**: Waiting for Review
- 審査待ち
- 通常1-3日

**ステータス**: In Review
- 審査中
- 通常数時間〜1日

**ステータス**: Pending Developer Release
- 審査承認済み
- 公開する準備ができている

**ステータス**: Ready for Sale
- App Storeで公開中

### 審査却下された場合

1. **却下理由を確認**
   - Resolution Centerでメッセージを確認

2. **問題を修正**
   - コードを修正
   - メタデータを修正

3. **新しいビルドを作成**（コードを修正した場合）
   ```bash
   # app.jsonのバージョンを更新
   # version: 1.0.1
   # buildNumber: 2

   eas build --platform ios --profile production
   ```

4. **再提出**
   ```bash
   eas submit --platform ios
   ```

5. **Resolution Centerで返信**
   - 修正内容を説明

---

## ステップ11: App Storeで公開

### 11.1 自動公開

審査承認後、自動的にApp Storeで公開されます。

### 11.2 手動公開

App Store Connectで「このバージョンをリリース」を設定している場合：

1. **App Store Connect**にログイン
2. **「リリース」ボタン**をクリック
3. **数時間以内にApp Storeに表示**

### 11.3 App Storeで確認

- App Storeアプリで「DailyTrack」を検索
- URLで確認: https://apps.apple.com/app/id[APP_ID]

---

## トラブルシューティング

### ビルドエラー

**エラー**: Provisioning profile error

**解決策**:
```bash
eas credentials
# iOS → Build Credentials → Remove all credentials
# 再度ビルド
eas build --platform ios --profile production
```

### 審査却下の一般的な理由

#### 1. 最小限の機能要件

**問題**: アプリの機能が不十分

**解決策**: ✅ 完全な機能を実装済み

#### 2. プライバシーポリシー

**問題**: プライバシーポリシーが不明確またはアクセスできない

**解決策**: プライバシーポリシーのURLを確認、アクセス可能か確認

#### 3. クラッシュ

**問題**: アプリがクラッシュする

**解決策**: TestFlightで徹底的にテスト

#### 4. メタデータの不一致

**問題**: スクリーンショットと実際の機能が異なる

**解決策**: 実際の画面をスクリーンショットとして使用

#### 5. UI/UXの問題

**問題**: UIが不完全または使いにくい

**解決策**: ユーザーテストを実施、フィードバックを反映

---

## アップデート方法

### 1. コードを修正

### 2. バージョン番号を更新

`app.json`:
```json
{
  "expo": {
    "version": "1.0.1",  // インクリメント
    "ios": {
      "buildNumber": "2"  // インクリメント
    }
  }
}
```

### 3. ビルド

```bash
eas build --platform ios --profile production
```

### 4. 提出

```bash
eas submit --platform ios
```

### 5. App Store Connectで設定

- 新しいバージョンを作成
- 「What's New」にアップデート内容を記載
- 審査に提出

---

## チェックリスト

申請前の最終チェック：

- [ ] Apple Developer Program登録完了
- [ ] プライバシーポリシーをWebに公開
- [ ] アプリアイコン作成・配置
- [ ] スクリーンショット作成
- [ ] App Store Connectでアプリ作成
- [ ] アプリ情報入力完了
- [ ] プライバシー情報設定完了
- [ ] EASでビルド作成
- [ ] TestFlightでテスト
- [ ] App Store Connectにビルドアップロード
- [ ] 審査ノート入力
- [ ] 審査に提出

---

## 参考リンク

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/ios/)
- [Apple Developer Program](https://developer.apple.com/programs/)

---

## サポート

**質問がある場合**:
- Expo Forums: https://forums.expo.dev/
- Expo Discord: https://chat.expo.dev/
- Apple Developer Support: https://developer.apple.com/contact/

**成功を祈っています！🚀**
