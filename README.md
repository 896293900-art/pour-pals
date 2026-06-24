# 浇个朋友 💦🌱

喝水种树 · 互相报备 · 一起浇

一个可爱治愈的喝水种树 + 日常报备 + 小圈子互动应用。

## ✨ 功能

- **💦 喝水种树** — 点一下浇树，环形进度追踪每日目标，随机跳出治愈/抽象标语
- **📍 日常报备** — 40+ 预设场景 + 自定义，每个都有正经名和抽象描述
- **🌳 树成长体系** — 连续喝水天数 = 树龄，🌱种子→🌿嫩芽→🪴盆栽→🌲小树→🌳大树→🏔️参天古木→🌟神树降临
- **🔥 上火提醒** — 3小时没浇水小树枯了，你的树说：我渴了 🥀
- **💦 浇水圈** — 建圈发链接，朋友点开直接进，不用注册
- **🏆 实时排行榜** — 今日谁浇最多，谁就是水利局局长
- **🏅 虚拟奖状** — 排行榜前三自动获封：
  - 🥇 **水利局局长** — 今日浇水冠军
  - 🥈 **水务局副局长** — 稳坐二把手
  - 🥉 **灌溉科科长** — 科里的水都是你浇的
  - + 14种特殊成就奖状：开闸元勋、晨露采集者、吨吨吨大王、摸鱼冠军、存在主义大师…
- **📊 历史记录** — 按日分组时间线，累计统计

## 🛠 技术栈

- React 18 + TypeScript
- Vite 7 + TailwindCSS v4
- Firebase（匿名登录 + Firestore 实时同步）
- Zustand 状态管理

## 🚀 部署

### 1. 创建 Firebase 项目

1. 去 [Firebase Console](https://console.firebase.google.com/) 创建项目
2. 添加 Web 应用，复制配置
3. 开启 **Authentication** → 匿名登录
4. 开启 **Firestore Database** → 测试模式（或配置安全规则）

### 2. 配置环境变量

创建 `.env.local`：

```
VITE_FIREBASE_API_KEY=你的key
VITE_FIREBASE_AUTH_DOMAIN=你的项目.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=你的项目id
VITE_FIREBASE_STORAGE_BUCKET=你的项目.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=你的senderId
VITE_FIREBASE_APP_ID=你的appId
```

### 3. 本地开发

```bash
npm install
npm run dev
```

### 4. 部署到 GitHub Pages

```bash
# vite.config.ts 中设置 base: '/<仓库名>/'
npm run build
# 推送 dist 目录
```

## ⚙️ 自定义配置

`src/lib/config.ts` 包含所有可自定义内容：

- **标语库**：`water.slogans`、`activitySlogans`
- **场景选项**：`activities` 数组（9大类40+选项）
- **每日目标**：`water.dailyGoal`（默认 2000ml）
- **上火提醒**：`fireWarning`
- **奖状系统**：`awards.daily`（排行奖状）、`awards.special`（特殊成就）
- **树成长**：`tree.stages`
- **主题色**：`theme`

## 📁 项目结构

```
src/
├── lib/
│   ├── config.ts     ← 所有配置
│   ├── firebase.ts   ← Firebase 初始化
│   ├── store.ts      ← Zustand 状态 + Firestore 交互
│   └── utils.ts      ← cn() 工具
├── pages/
│   ├── HomePage.tsx       ← 首页
│   ├── ActivityPage.tsx   ← 报备选择
│   ├── RoomPage.tsx       ← 圈子/建圈/加圈
│   ├── LeaderboardPage.tsx← 排行榜 + 局长
│   ├── AwardPage.tsx      ← 虚拟奖状
│   └── HistoryPage.tsx    ← 历史记录
└── App.tsx           ← 路由
```

## License

MIT — 随便浇，随便种 🌱
