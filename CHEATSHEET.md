# Blog 项目速查手册

## 环境

| 项 | 值 |
|---|---|
| conda 环境名 | `blog` |
| Python | 3.12 |
| Node | v24+ |
| 包管理器 | npm |

## 开发环境启动

```bash
# === 后端 ===
cd D:/MySite/blog/backend
conda activate blog
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# === 前端 ===
cd D:/MySite/blog/frontend
npm run dev

# 浏览器打开 http://localhost:5173
```

## 前端单独构建

```bash
cd D:/MySite/blog/frontend
npm run build              # 生产构建
npx vite build             # 同上
npx vite --host 0.0.0.0 --port 5173   # 开发服务器
```

## 后端单独操作

```bash
conda activate blog
cd D:/MySite/blog/backend

# 初始化数据库（首次或重置后）
python -c "from app.database import init_db; init_db()"
```

## API 测试

```bash
# 健康检查
curl http://localhost:8000/api/health

# 管理员登录
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 注册
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# 查看文章
curl http://localhost:8000/api/posts

# 交互式 API 文档（浏览器打开）
# http://localhost:8000/docs
```

## 默认账号

| 角色 | 用户名 | 密码 |
|---|---|---|
| 管理员 | admin | admin123 |
| 普通用户 | 自行注册 | — |

## Docker

```bash
# 构建镜像
cd D:/MySite/blog
docker compose build

# 启动（后台）
docker compose up -d

# 停止
docker compose down

# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f

# 浏览器打开 http://localhost
```

## Docker 部署后访问

| 地址 | 说明 |
|---|---|
| `http://localhost` | 前端（Nginx 80 端口） |
| `http://localhost:8000/api/health` | 后端直接访问 |
| `http://localhost:8000/docs` | API 文档 |

## 数据库

- 文件位置：`backend/data/blog.db`
- 类型：SQLite（Docker 通过 volume 持久化）

## 项目结构

```
blog/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI 入口
│   │   ├── config.py          # 配置文件
│   │   ├── database.py        # 数据库 + init_db()
│   │   ├── dependencies.py    # JWT 认证依赖
│   │   ├── models/            # 数据表模型
│   │   ├── schemas/           # Pydantic 请求/响应
│   │   ├── routers/           # API 路由
│   │   └── services/          # AI 日报服务
│   ├── data/                  # SQLite 数据库文件
│   ├── uploads/               # 上传图片
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env                   # 密钥配置
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # 路由
│   │   ├── pages/             # 页面组件
│   │   ├── components/        # 通用组件
│   │   ├── contexts/          # AuthContext
│   │   ├── services/          # API 请求
│   │   └── game/              # 小恐龙游戏源码
│   ├── public/dino/images/    # 游戏精灵图
│   ├── index.html             # 含音频模板
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── CHEATSHEET.md
```
