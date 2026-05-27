# Cloudflare 部署指南

## 部署架构

由于 KoNLPy 需要 Java 环境，本项目采用分离部署架构：

```
┌─────────────────┐     ┌─────────────────┐
│  Cloudflare     │     │  Railway/Render │
│  Pages          │────▶│  (Backend)      │
│  (Frontend)     │     │  Flask + KoNLPy │
└─────────────────┘     └─────────────────┘
     :3000                    :5000
```

---

## 方式一：完整分离部署（推荐）

### 第一部分：部署后端到 Railway

#### 1. 创建 Railway 账号
访问 https://railway.app 并注册账号

#### 2. 部署后端

```bash
# 克隆后端代码
cd backend

# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial backend commit"

# 连接 Railway
# 1. 访问 https://railway.app/dashboard
# 2. 点击 "New Project" → "Deploy from GitHub"
# 3. 选择你的仓库

# 或者使用 Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

#### 3. 配置环境变量

在 Railway 控制台添加以下环境变量：
```
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///ksemantix.db
```

#### 4. 安装 KoNLPy 依赖

Railway 会自动检测 `requirements.txt`，但需要配置 Java 环境：

在 `backend` 目录创建 `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "nixpacks": {
      "aptPkgs": ["openjdk-11-jdk-headless"]
    }
  }
}
```

---

### 第二部分：部署前端到 Cloudflare Pages

#### 1. 创建 Cloudflare 账号
访问 https://pages.cloudflare.com 并注册

#### 2. 构建前端

```bash
cd frontend

# 安装依赖
npm install

# 构建生产版本
npm run build
```

这会在 `frontend/dist` 目录生成静态文件

#### 3. 部署到 Cloudflare Pages

**方式A：使用 Wrangler CLI**

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建 Pages 项目
wrangler pages project create k-semantix-ai

# 部署
wrangler pages deploy dist --project-name=k-semantix-ai
```

**方式B：使用 GitHub 集成**

1. 将前端代码推送到 GitHub
2. 访问 Cloudflare Pages 控制台
3. 点击 "Create a project"
4. 选择 GitHub 仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. 点击 "Save and Deploy"

#### 4. 配置环境变量

在 Cloudflare Pages 设置中添加：
```
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

---

## 方式二：纯前端 + 远程 API

如果后端部署困难，可以使用简化的外部 API：

### 修改前端 API 配置

创建 `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-backend-api.com/api
```

### 部署后端到其他平台

由于 KoNLPy 需要完整环境，推荐：
- **Railway** (最简单)
- **Render**
- **Fly.io**
- **Heroku** (已收费)

---

## 方式三：Cloudflare Workers (无 KoNLPy)

如果想要纯 Cloudflare 方案，需要移除 KoNLPy 依赖：

### 创建 Cloudflare Workers 后端

```bash
# 安装 Wrangler
npm install -g wrangler

# 创建 Workers 项目
wrangler generate backend-worker
cd backend-worker
```

### 修改 worker 代码

创建 `backend-worker/index.js`:
```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 简化的 API 响应（不包含 KoNLPy）
    if (url.pathname.startsWith('/api/health')) {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'K-Semantix AI Worker'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 静态文件服务
    return env.ASSETS.fetch(request);
  }
};
```

### 配置 wrangler.toml

```toml
name = "k-semantix-backend"
main = "index.js"
compatibility_date = "2024-01-01"

[assets]
directory = "./public"
```

---

## Cloudflare 部署配置

### wrangler.toml (Workers)

```toml
name = "k-semantix-frontend"
main = "worker/index.js"
compatibility_date = "2024-01-01"

[env.production]
routes = [
  { pattern = "ksemantix.ai", zone_name = "ksemantix.ai" }
]
```

### cloudflare-pages.json

在 `frontend` 目录创建：

```json
{
  "build_command": "npm run build",
  "build_output_dir": "dist",
  "dev_command": "npm run dev",
  "environment_variables": {
    "NODE_VERSION": "18",
    "VITE_API_BASE_URL": "https://your-backend.railway.app/api"
  }
}
```

---

## 环境变量配置

### 前端 (.env.production)

```env
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

### 后端 (.env)

```env
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-change-this
DATABASE_URL=sqlite:///ksemantix.db
CORS_ORIGINS=https://your-cloudflare-pages.vercel.app
```

---

## 数据库注意事项

### SQLite on Railway
Railway 的文件系统是临时的，需要使用持久化存储：

```python
import os

DATABASE_PATH = os.getenv('DATABASE_PATH', '/data/ksemantix.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DATABASE_PATH}'
```

配置持久化目录：
- Railway: `/data`
- Render: `/var/data`
- Fly.io: 挂载卷

### 替代方案：D1 Database

使用 Cloudflare D1（需要修改代码）:

```python
# 替换 SQLite 为 D1
# 注意：D1 有限制，需要使用 wrangler d1 命令
```

---

## 部署检查清单

### 后端部署
- [ ] Railway/Render 账号创建
- [ ] GitHub 仓库连接
- [ ] 环境变量配置
- [ ] Java 环境确认
- [ ] KoNLPy 依赖安装
- [ ] 数据库初始化
- [ ] HTTPS 域名配置
- [ ] CORS 设置

### 前端部署
- [ ] Cloudflare Pages 项目创建
- [ ] 构建命令配置
- [ ] 环境变量设置
- [ ] 自定义域名配置（可选）
- [ ] HTTPS 强制跳转
- [ ] 缓存策略配置

### 性能优化
- [ ] 启用 Cloudflare CDN
- [ ] 静态资源缓存
- [ ] 开启 Brotli 压缩
- [ ] 配置页面规则
- [ ] 启用 Always Online

### 安全设置
- [ ] HTTPS 证书
- [ ] WAF 规则
- [ ] 速率限制
- [ ] DDoS 防护
- [ ] CORS 配置

---

## 常见问题

### Q1: Railway 部署失败

**原因**: KoNLPy 需要 Java 环境

**解决方案**:
```bash
# 在 railway.json 中指定 Java
{
  "build": {
    "nixpacks": {
      "aptPkgs": ["openjdk-11-jdk-headless"]
    }
  }
}
```

### Q2: Cloudflare Pages 404 错误

**解决方案**:
1. 检查 `build_output_dir` 是否正确（应该是 `dist`）
2. 确保 `spaFallback` 配置正确
3. 添加 `_routes.json`:

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/assets/*", "/images/*"]
}
```

### Q3: API 请求失败 (CORS)

**解决方案**:
在 Flask 后端配置 CORS:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "https://your-frontend.pages.dev",
    "https://your-domain.com"
])
```

### Q4: 数据库连接失败

**原因**: Railway 文件系统是临时的

**解决方案**:
```python
import os

# Railway 持久化目录
DB_PATH = os.getenv('DB_PATH', '/data')
os.makedirs(DB_PATH, exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}/ksemantix.db'
```

### Q5: 构建超时

**解决方案**:
在 `package.json` 中增加超时时间：

```json
{
  "scripts": {
    "build": "vite build --timeout 180000"
  }
}
```

---

## 自定义域名配置

### Cloudflare Pages

1. 访问 Pages 项目设置
2. 点击 "Custom domains"
3. 添加你的域名
4. Cloudflare 会自动配置 SSL

### DNS 配置

```
Type    Name    Content
CNAME   www     your-project.pages.dev
CNAME   api     your-backend.railway.app
```

---

## 监控和维护

### Cloudflare Analytics
- 访问速度
- 带宽使用
- 错误率
- 安全威胁

### Railway Metrics
- CPU 使用率
- 内存使用
- 请求日志
- 数据库连接

### 设置警报

在 Railway 设置中添加：
- CPU > 80%
- 内存 > 90%
- 响应时间 > 5s
- 错误率 > 5%

---

## 成本估算

### Cloudflare Pages (免费)
- 500 构建分钟/月
- 无限请求
- 无限带宽
- **$0/月**

### Railway ( Hobby 计划)
- 500 CPU 小时/月
- 1GB 内存
- 10GB 磁盘
- **$0/月** (Hobby 计划免费)

### 总计
- **$0/月** (适合小型项目)
- 按需升级到付费计划

---

## 快速部署脚本

创建 `deploy.sh`:

```bash
#!/bin/bash

# 部署后端到 Railway
echo "Deploying backend to Railway..."
cd backend
railway up

# 获取后端 URL
BACKEND_URL=$(railway status | grep URL | awk '{print $2}')
echo "Backend URL: $BACKEND_URL"

# 部署前端到 Cloudflare Pages
echo "Building frontend..."
cd ../frontend

# 创建生产环境变量
cat > .env.production << EOF
VITE_API_BASE_URL=${BACKEND_URL}/api
EOF

# 构建
npm run build

# 部署
echo "Deploying frontend to Cloudflare Pages..."
wrangler pages deploy dist --project-name=k-semantix-ai

echo "Deployment completed!"
echo "Frontend: https://k-semantix-ai.pages.dev"
echo "Backend: $BACKEND_URL"
```

---

## 获取帮助

- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Railway: https://docs.railway.app/
- Wrangler: https://developers.cloudflare.com/workers/wrangler/

---

## 下一步

1. 选择部署方式（推荐方式一）
2. 创建必要账号
3. 按照步骤部署
4. 配置域名
5. 测试功能
6. 监控系统

**部署成功！** 🚀
