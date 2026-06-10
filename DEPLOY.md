# 网站更新部署

## 博客站 (https://gianniiss.top)

仓库：`ghotiwave/Hety-Blog`

### 改代码

本地编辑 `D:\MySite\blog\` 下的文件，改完后：

```bash
cd D:\MySite\blog
git add -A
git commit -m "描述改动"
git push
```

推送后 GitHub Actions 自动执行（约 2-3 分钟）：
1. rsync 代码到服务器
2. 自动启用 SSL 证书和笔记站挂载
3. `docker compose up -d --build` 滚动更新（不关站）

### 改服务器环境变量

需要 SSH 到服务器手动改：

```bash
ssh ubuntu@106.54.211.108 -i ~/.ssh/deploy_ci
nano ~/blog/.env          # 编辑配置
cd ~/blog && docker compose up -d backend   # 重启后端
```

### 笔记站开关

编辑 `frontend/src/config.ts`：
```ts
features: {
  notes: true,   // false = 隐藏笔记站入口
  digest: true,  // false = 隐藏 AI 日报
  game: true,    // false = 隐藏小游戏
},
```
`notesUrl` 本地开发时改成 `http://localhost:8080`。

### 更换首页 Logo

替换 `frontend/src/assets/logo.png`，`logo-sm.png` 会自动生成。

---

## 笔记站 (https://gianniiss.top/notes/)

仓库：`ghotiwave/Hety-Wiki`

### 改笔记内容

在 Obsidian 里编辑 `D:\MySite\notes\content\` 下的笔记，改完后：

```bash
cd D:\MySite\notes
git add -A
git commit -m "描述改动"
git push
```

推送后自动构建并部署到服务器（约 1 分钟）。

### 本地预览

```bash
cd D:\MySite\notes
node quartz/bootstrap-cli.mjs build
cd public && python -m http.server 8080
# 打开 http://localhost:8080
```

---

## 新增/删除笔记

直接在 Obsidian 的 `content/` 目录下新建或删除 `.md` 文件，push 后自动生效。

## 修改笔记站配置

`quartz.config.ts` — 标题、配色、SPA 等
`quartz.layout.ts` — 侧边栏、页脚链接等

改完后本地 `node quartz/bootstrap-cli.mjs build` 预览，确认无误再 push。

---

## 常见问题

**Q: push 后发现没更新**
去 GitHub Actions 页面看 workflow 运行日志：[博客](https://github.com/ghotiwave/Hety-Blog/actions) / [笔记站](https://github.com/ghotiwave/Hety-Wiki/actions)

**Q: 服务器挂了怎么办**
```bash
ssh ubuntu@106.54.211.108 -i ~/.ssh/deploy_ci
cd ~/blog && docker compose up -d
```

**Q: 本地开发怎么跑**

博客：
```bash
# 后端（另一个终端）
cd D:\MySite\blog\backend
conda run -n blog python -m uvicorn app.main:app --reload --port 9000

# 前端
cd D:\MySite\blog\frontend
npm run dev
# 打开 http://localhost:5173
```

笔记站：
```bash
cd D:\MySite\notes
node quartz/bootstrap-cli.mjs build
cd public && python -m http.server 8080
```

---

> 部署密钥：`~/.ssh/deploy_ci`
> 服务器 IP：`106.54.211.108`
> 管理员登录：`https://gianniiss.top/admin/dashboard`
