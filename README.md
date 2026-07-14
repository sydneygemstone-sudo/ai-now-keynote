# AI NOW · 当下 AI 能力现场地图

面向非技术成年人的可点击 60 分钟 AI 发布会式演示。站点是纯静态导出，可直接由 GitHub Pages 托管；演示电脑不需要运行 Node 服务。

## GitHub Pages

推送到 `main` 后，`.github/workflows/pages.yml` 会自动：

1. 构建静态站；
2. 为仓库子路径修正图片、脚本与《渡口》离线游戏链接；
3. 部署到 GitHub Pages。

## 本地编辑

```bash
npm ci
npm run dev
```

打开 `http://localhost:3000/`。

## 验证静态产物

```bash
npm run build:static
npm run lint
npm test
```
