# 咕嘟咕嘟 · Sip Together 💧

喝水打卡 · 互相报备 · 一起咕嘟

一个可爱治愈的喝水打卡 + 日常报备小应用，适合情侣和好朋友互相报备。

## ✨ 功能

- **💧 喝水打卡** — 点一下咕嘟，记录每次喝水量，环形进度条追踪每日目标，随机跳出治愈/抽象标语
- **📍 日常报备** — 40+ 预设场景（工作/吃喝/休息/娱乐/运动/学习/生活/社交/情绪），每个都有正经名和抽象描述，还可以自定义
- **🔥 连续打卡** — 连续喝水天数，上火提醒（3小时没喝水就警告）
- **💕 配对** — 生成配对码和朋友/伴侣连接，互相导入数据查看对方动态
- **📊 历史** — 按日分组的时间线，累计统计，数据导出备份

## 🎨 设计风格

暖奶油底色 + 薄荷绿主色 + 蜜桃粉点缀，手绘感圆润组件，浮动装饰动画，日系可爱风。

## 🛠 技术栈

- React 18 + TypeScript
- Vite 7
- TailwindCSS v4
- Zustand（状态管理）
- 纯 localStorage 存储，无需后端
- 无登录，无注册，开箱即用

## 🚀 本地开发

```bash
npm install
npm run dev
```

## 📦 构建

```bash
npm run build
# 产物在 dist/ 目录，可直接部署到任何静态托管
```

## 🌐 部署到 GitHub Pages

1. 在 `vite.config.ts` 中设置 `base: '/<repo-name>/'`
2. 推送代码到 GitHub
3. 在仓库 Settings → Pages → Source 选 `dist` 目录
4. 或者用 GitHub Actions 自动部署

## ⚙️ 自定义配置

所有可自定义内容在 `src/lib/config.ts`：

- **标语库**：`water.slogans`（喝水标语）、`activitySlogans`（报备标语）
- **场景选项**：`activities` 数组，每个有 `group`/`emoji`/`label`/`abstract`
- **每日目标**：`water.dailyGoal`（默认 2000ml）
- **上火提醒**：`fireWarning.thresholdMinutes`（默认 180 分钟）
- **主题色**：`theme` 对象

## 📁 项目结构

```
src/
├── lib/
│   ├── config.ts    ← 所有配置（场景、标语、主题色）
│   ├── store.ts     ← Zustand 状态管理 + localStorage
│   └── utils.ts     ← cn() 工具函数
├── pages/
│   ├── HomePage.tsx      ← 首页（喝水 + 动态流）
│   ├── ActivityPage.tsx  ← 报备选择页
│   ├── PairPage.tsx      ← 配对页
│   └── HistoryPage.tsx   ← 历史记录页
├── App.tsx          ← 路由
├── main.tsx         ← 入口
└── index.css        ← 全局样式 + 动画
```

## License

MIT — 随便用，咕嘟咕嘟
