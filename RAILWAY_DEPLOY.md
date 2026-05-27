# K-Semantix AI - Railway + Cloudflare 快速部署

## 🎯 目标架构

```
┌──────────────────────────┐     ┌──────────────────────────┐
│  Cloudflare Pages       │     │  Railway                 │
│  (Frontend)             │────▶│  (Backend + KoNLPy)      │
│  ksemantix.ai          │     │  api.ksemantix.ai       │
└──────────────────────────┘     └──────────────────────────┘
```

**费用**: $0/月 (使用免费套餐)

---

## 📋 部署清单

### 准备阶段

1. [ ] GitHub 账号
2. [ ] Cloudflare 账号 (https://pages.cloudflare.com)
3. [ ] Railway 账号 (https://railway.app)
4. [ ] 将代码推送到 GitHub

---

## 🚀 第一步：部署后端到 Railway

### 1.1 创建 Railway 项目

1. 访问 https://railway.app/dashboard
2. 点击 **"New Project"**
3. 选择 **"Deploy from GitHub"**
4. 选择你的 GitHub 仓库
5. 选择 `backend` 目录

### 1.2 配置环境变量

在 Railway 控制台，点击你的项目 → **Variables**：

```env
FLASK_APP=app_production.py
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-change-this
DATABASE_PATH=/data
```

### 1.3 配置 Java 环境

Railway 会自动使用 `railway.json` 配置 Java：

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

### 1.4 等待部署完成

Railway 会自动：
- 安装 Python 依赖
- 安装 Java (KoNLPy 需要)
- 部署应用
- 配置 HTTPS

部署完成后，你会获得一个 URL，例如：
```
https://ksemantix-api.up.railway.app
```

---

## 🌐 第二步：部署前端到 Cloudflare Pages

### 2.1 推送前端代码到 GitHub

```bash
cd frontend

# 创建 .env.production
echo "VITE_API_BASE_URL=https://your-railway-url.up.railway.app/api" > .env.production

# 推送到 GitHub
git add .
git commit -m "Add production environment"
git push origin main
```

### 2.2 创建 Cloudflare Pages 项目

1. 访问 https://pages.cloudflare.com
2. 点击 **"Create a project"**
3. 选择 **"Connect to Git"**
4. 选择你的 GitHub 仓库
5. 配置构建设置：
   - **Project name**: `ksemantix-ai`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

### 2.3 配置环境变量

在 Cloudflare Pages 设置 → Environment variables：

```
VITE_API_BASE_URL=https://your-railway-url.up.railway.app/api
```

### 2.4 部署

点击 **"Save and Deploy"**

Cloudflare 会自动：
- 克隆代码
- 安装依赖
- 构建应用
- 部署到全球 CDN
- 配置 HTTPS

---

## 🔗 第三步：连接域名 (可选)

### 后端域名 (Railway)

Railway 自定义域名：
1. 项目设置 → **Domains**
2. 添加你的域名：`api.ksemantix.ai`
3. 添加 DNS 记录

```
Type: CNAME
Name: api
Target: your-railway-app.railway.app
```

### 前端域名 (Cloudflare Pages)

Cloudflare Pages 自定义域名：
1. Pages 项目 → **Custom domains**
2. 添加你的域名：`ksemantix.ai`
3. Cloudflare 会自动配置 SSL

```
Type: CNAME
Name: @
Target: ksemantix-ai.pages.dev
```

---

## ✅ 验证部署

### 测试后端

```bash
curl https://your-railway-url.up.railway.app/api/health
```

响应应该：
```json
{
  "status": "healthy",
  "service": "K-Semantix AI API"
}
```

### 测试前端

1. 访问你的 Cloudflare Pages URL
2. 尝试注册/登录
3. 上传测试文件
4. 运行分析

---

## 🔧 配置生产环境变量

### Railway (.env)

```bash
FLASK_APP=app_production.py
FLASK_ENV=production
SECRET_KEY=generate-secure-random-key
DATABASE_PATH=/data
CORS_ORIGINS=https://ksemantix.ai,https://www.ksemantix.ai
```

### Cloudflare Pages

```bash
VITE_API_BASE_URL=https://api.ksemantix.ai/api
```

---

## 🛠️ 常见问题

### Q1: Railway 部署失败

**症状**: KoNLPy 安装失败

**解决**:
1. 检查 `railway.json` 是否存在
2. 确保 Java 环境配置正确
3. 查看构建日志
4. 尝试手动安装 Java:
   ```bash
   nixpacks env -l | grep JDK
   ```

### Q2: 前端无法连接后端

**症状**: API 请求失败

**解决**:
1. 检查 `VITE_API_BASE_URL` 是否正确
2. 检查后端 CORS 配置
3. 检查 Railway 日志
4. 确认后端正常运行

### Q3: 数据库问题

**症状**: 数据无法保存

**解决**:
Railway 文件系统是临时的。确保：
```python
DATABASE_PATH=/data
```
Railway 会自动创建持久化卷。

### Q4: 构建超时

**症状**: Cloudflare Pages 构建超时

**解决**:
1. 增加超时时间
2. 优化依赖安装
3. 使用缓存

---

## 📊 监控和维护

### Railway 监控

- 访问 https://railway.app/dashboard
- 查看 CPU/内存使用
- 查看日志
- 设置告警

### Cloudflare Analytics

- 访问速度
- 带宽使用
- 错误率
- 安全威胁

### 日志查看

```bash
# Railway 日志
railway logs

# 实时日志
railway logs --tail
```

---

## 🔒 安全检查

- [ ] 更改 SECRET_KEY
- [ ] 启用 HTTPS
- [ ] 配置 CORS
- [ ] 设置速率限制
- [ ] 启用 DDoS 防护
- [ ] 配置 WAF 规则

---

## 💰 成本

### Cloudflare Pages
- **$0/月** (500分钟构建，无限请求)

### Railway Hobby
- **$0/月** (500 CPU小时，1GB 内存)

### 总计
- **$0/月** (适合小型项目和学习用途)

---

## 🎓 学习资源

- [Railway 文档](https://docs.railway.app/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 🚀 快速命令

```bash
# 查看 Railway 状态
railway status

# 查看日志
railway logs

# 连接到 Railway shell
railway run bash

# 重启后端
railway restart

# 查看环境变量
railway variables
```

---

## ✨ 部署成功检查

- [ ] 后端健康检查通过
- [ ] 前端页面正常加载
- [ ] 用户注册/登录正常
- [ ] 文件上传成功
- [ ] 分析功能正常
- [ ] HTTPS 已启用
- [ ] 自定义域名配置完成

---

**部署成功！** 🎉

有问题？请查看 [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md) 或提交 Issue。
