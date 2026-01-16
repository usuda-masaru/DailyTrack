# 毎日の習慣 (DailyTrack)

毎日の習慣を記録し、カレンダーで達成状況を可視化する習慣トラッカーアプリです。

**App Store**: [毎日の習慣](https://apps.apple.com/app/id6757803706) *(公開後にリンクが有効になります)*

## 主な機能

- 自由に習慣を登録（筋トレ、語学学習など）
- カレンダーで日付を選択して習慣をチェック
- 各習慣ごとに専用のカレンダー表示
- 達成状況の統計（合計日数、現在の連続日数、最長連続日数）
- カラフルなアイコンで習慣を識別
- シンプルで直感的な操作

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | React Native + Expo |
| 言語 | TypeScript |
| データ保存 | AsyncStorage（ローカルのみ） |
| ナビゲーション | React Navigation |
| カレンダーUI | react-native-calendars |
| ビルド・申請 | EAS Build / EAS Submit |

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start

# トンネルモードで起動（実機テスト用）
npx expo start --tunnel
```

## プロジェクト構造

```
DailyTrack/
├── App.tsx                 # エントリーポイント
├── app.json               # Expo 設定
├── eas.json               # EAS Build 設定
├── package.json           # 依存関係
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
├── assets/
│   ├── icon.png           # アプリアイコン (1024x1024)
│   └── splash-icon.png    # スプラッシュ画面
├── docs/                  # ドキュメント
│   ├── index.html         # プライバシーポリシー (GitHub Pages)
│   ├── RELEASE_GUIDE.md   # リリースガイド
│   └── ...                # その他ガイド
└── screenshots/           # App Store 用スクリーンショット
    ├── iphone_67/         # 6.7インチ用
    └── iphone_65/         # 6.5インチ用
```

## ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [RELEASE_GUIDE.md](docs/RELEASE_GUIDE.md) | iOS リリース完全ガイド（フロー図付き） |
| [APP_STORE_CHECKLIST.md](docs/APP_STORE_CHECKLIST.md) | App Store 申請チェックリスト |
| [IOS_SUBMISSION_GUIDE.md](docs/IOS_SUBMISSION_GUIDE.md) | iOS 申請詳細ガイド |
| [ASSETS_GUIDE.md](docs/ASSETS_GUIDE.md) | アセット作成ガイド |
| [BUILD_AND_RELEASE_GUIDE.md](docs/BUILD_AND_RELEASE_GUIDE.md) | ビルド＆リリースガイド |
| [STORE_LISTING.md](docs/STORE_LISTING.md) | ストア掲載情報 |
| [PRIVACY_POLICY.md](docs/PRIVACY_POLICY.md) | プライバシーポリシー |

## ビルドコマンド

```bash
# iOS ビルド
eas build --platform ios

# App Store Connect に提出
eas submit --platform ios

# Android ビルド (参考)
eas build --platform android
```

## プライバシー

このアプリは一切のユーザーデータを収集しません。すべてのデータは端末内にのみ保存され、外部サーバーには送信されません。

**プライバシーポリシー**: https://usuda-masaru.github.io/DailyTrack/

## ライセンス

MIT

---

*2026年1月リリース*
