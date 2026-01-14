# DailyTrack - 習慣トラッカーアプリ

DailyTrackは、ユーザーが自由に登録した習慣項目（筋トレ、英会話など）を毎日チェックし、カレンダーで達成状況を可視化する習慣トラッカーアプリです。

## 技術スタック

- **フレームワーク**: React Native + Expo
- **言語**: TypeScript
- **状態管理**: React Hooks
- **データ保存**: AsyncStorage（ローカルストレージ）
- **ナビゲーション**: React Navigation（タブナビゲーション）
- **カレンダーUI**: react-native-calendars
- **ビルド・申請**: EAS Build / EAS Submit

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm start
```

その後、Expo Goアプリでスキャンするか、以下のコマンドでエミュレータ/シミュレータで起動できます：

```bash
npm run android  # Android
npm run ios      # iOS (macOS required)
```

## EAS Build セットアップ（Windowsでのリリース申請）

### 1. Expoアカウントの作成

1. https://expo.dev にアクセス
2. アカウントを作成（無料）

### 2. EAS CLIでログイン

```bash
eas login
```

### 3. プロジェクトIDの取得

```bash
eas init
```

このコマンドで自動的にプロジェクトIDが生成され、`app.json`の`extra.eas.projectId`に設定されます。

### 4. app.jsonの設定変更

`app.json`内の以下の項目を自分の情報に変更してください：

- `ios.bundleIdentifier`: `com.yourcompany.dailytrack` → 自分のバンドルID
- `android.package`: `com.yourcompany.dailytrack` → 自分のパッケージ名

### 5. ビルドの実行

#### Android（Windowsから可能）

```bash
npm run build:android
```

初回ビルド時に、キーストアの生成を求められます。EASに自動生成させることをお勧めします。

#### iOS（WindowsからでもEASクラウドビルドで可能）

```bash
npm run build:ios
```

**注意**: iOSのビルドには、Apple Developer Programへの登録（年間$99）が必要です。

### 6. ストアへの申請

#### Androidの場合

1. Google Play Consoleでアプリを作成
2. 以下のコマンドで申請：

```bash
npm run submit:android
```

#### iOSの場合

1. App Store Connectでアプリを作成
2. 以下のコマンドで申請：

```bash
npm run submit:ios
```

## アプリの機能

### 1. 習慣管理画面
- 習慣の追加（+ボタン）
- 習慣の削除（長押し）
- 今日の習慣のチェック

### 2. カレンダー画面
- 月間カレンダーで達成状況を可視化
- 各習慣の色でドット表示
- 今月の達成率表示

## プロジェクト構造

```
DailyTrack/
├── src/
│   ├── components/      # 再利用可能なコンポーネント
│   │   └── HabitItem.tsx
│   ├── screens/        # 画面コンポーネント
│   │   ├── HabitsScreen.tsx
│   │   └── CalendarScreen.tsx
│   ├── types/          # TypeScript型定義
│   │   └── index.ts
│   └── utils/          # ユーティリティ関数
│       └── storage.ts
├── App.tsx             # メインアプリファイル
├── app.json            # Expo設定
├── eas.json            # EAS Build設定
└── package.json        # 依存関係
```

## トラブルシューティング

### ビルドエラーが発生した場合

1. `node_modules`を削除して再インストール：
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Expoキャッシュをクリア：
   ```bash
   npx expo start -c
   ```

### iOSビルドでコード署名エラーが発生した場合

EAS Buildは自動的にコード署名を処理しますが、Apple Developer Programのアカウント情報が必要です。

## 参考リンク

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Navigation](https://reactnavigation.org/)
- [react-native-calendars](https://github.com/wix/react-native-calendars)

## ライセンス

MIT
