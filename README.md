# Club Match Platform

这是一个基于 `Vite + React` 的静态网页项目，已经配置好可部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev
```

## 部署到你自己的 GitHub

1. 在 GitHub 新建一个仓库。
2. 把当前项目推送到你的仓库默认分支，建议分支名为 `main`。
3. 打开 GitHub 仓库页面。
4. 进入 `Settings` -> `Pages`。
5. 在 `Build and deployment` 里把 `Source` 设为 `GitHub Actions`。
6. 推送一次到 `main` 后，GitHub 会自动执行 `.github/workflows/deploy.yml`。
7. 部署完成后，你会在 `Actions` 或 `Pages` 页面看到真实网页链接。

## 常用命令

```bash
npm run build
npm run preview
```
