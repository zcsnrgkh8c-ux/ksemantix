# K-Semantix AI - 云端部署文件清单

## 📦 已创建的部署相关文件

### 核心部署文档

| 文件名 | 说明 | 用途 |
|--------|------|------|
| `CLOUDFLARE_DEPLOY.md` | 完整 Cloudflare 部署指南 | 详细部署步骤 |
| `RAILWAY_DEPLOY.md` | Railway + Cloudflare 快速部署 | 推荐部署方案 |
| `DEPLOYMENT_SUMMARY.md` | 部署总结 | 快速参考 |
| `README.md` | 项目主文档（已更新） | 包含部署章节 |

### 配置文件

#### 后端配置
| 文件名 | 说明 | 关键内容 |
|--------|------|----------|
| `backend/railway.json` | Railway 部署配置 | Java 环境配置 |
| `backend/app_production.py` | 生产环境入口 | CORS、持久化 |
| `backend/database_config.py` | 数据库配置 | 持久化路径 |

#### 前端配置
| 文件名 | 说明 | 关键内容 |
|--------|------|----------|
| `frontend/.env.production` | 生产环境变量 | API URL |
| `frontend/cloudflare-pages.json` | Pages 配置 | 构建命令 |

### CI/CD 配置

| 文件名 | 说明 | 触发条件 |
|--------|------|----------|
| `.github/workflows/deploy.yml` | 自动部署工作流 | push to main |
| `.github/workflows/ci.yml` | CI 流水线 | push/PR |

### 部署脚本

| 文件名 | 平台 | 说明 |
|--------|------|------|
| `deploy-cloudflare.sh` | Linux/macOS | 一键部署脚本 |
| `deploy-cloudflare.bat` | Windows | 一键部署脚本 |

### 环境变量模板

| 文件名 | 说明 |
|--------|------|
| `.env.cloudflare.example` | 所有环境变量模板 |

---

## 🎯 推荐部署流程

### 方式一：Railway + Cloudflare Pages (推荐)

```
1. GitHub → Railway (后端)
   └── railway.json 自动配置 Java
   
2. GitHub → Cloudflare Pages (前端)
   └── 自动构建 + CDN

3. 配置环境变量
   └── VITE_API_BASE_URL

4. 完成！
```

### 方式二：使用 GitHub Actions

```
1. 推送代码到 GitHub
2. GitHub Actions 自动构建
3. 自动部署到 Cloudflare Pages
```

### 方式三：手动部署

```bash
# 后端
cd backend
railway up

# 前端
cd frontend
wrangler pages deploy dist
```

---

## 📋 部署检查清单

### 必选项目
- [ ] GitHub 账号
- [ ] Railway 账号 (https://railway.app)
- [ ] Cloudflare 账号 (https://pages.cloudflare.com)
- [ ] 代码推送到 GitHub

### Railway 后端部署
- [ ] 创建 Railway 项目
- [ ] 连接 GitHub 仓库
- [ ] 选择 `backend` 目录
- [ ] 配置环境变量
- [ ] 等待 KoNLPy 安装
- [ ] 获取后端 URL

### Cloudflare 前端部署
- [ ] 创建 Pages 项目
- [ ] 连接 GitHub 仓库
- [ ] 选择 `frontend` 目录
- [ ] 配置构建命令
- [ ] 配置 `VITE_API_BASE_URL`
- [ ] 等待部署完成

### 可选项目
- [ ] 配置自定义域名
- [ ] 启用 HTTPS
- [ ] 配置 CDN 缓存
- [ ] 设置安全规则

---

## 🔧 环境变量详解

### Railway (后端)

```bash
# Flask 应用
FLASK_APP=app_production.py
FLASK_ENV=production

# 安全
SECRET_KEY=your-super-secret-key-change-this

# 数据库（持久化）
DATABASE_PATH=/data

# CORS（逗号分隔）
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### Cloudflare Pages (前端)

```bash
# API 地址（必需）
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

---

## 💰 成本说明

| 服务 | 免费额度 | 备注 |
|------|---------|------|
| Cloudflare Pages | 500分钟构建/月 | 无限请求 |
| Railway Hobby | 500 CPU小时/月 | 1GB 内存 |
| **总计** | | **$0/月** |

> 💡 **足够小型项目和个人使用！**

---

## 🛠️ 故障排除

### 问题 1：Railway 部署失败

**症状**：
- KoNLPy 安装失败
- Java 环境缺失

**解决方案**：
1. 检查 `backend/railway.json` 是否存在
2. 确认 Java 配置正确
3. 查看 Railway 构建日志
4. 尝试手动触发重新部署

### 问题 2：前端无法连接后端

**症状**：
- API 请求失败
- CORS 错误

**解决方案**：
1. 检查 `VITE_API_BASE_URL` 是否正确
2. 确认后端 CORS 配置
3. 检查 Railway 日志
4. 验证后端正常运行

### 问题 3：数据库数据丢失

**症状**：
- 重启后数据消失

**解决方案**：
Railway 文件系统是临时的，必须使用 `/data` 目录：
```python
DATABASE_PATH=/data  # 已配置
```

### 问题 4：构建超时

**症状**：
- Cloudflare Pages 构建失败

**解决方案**：
1. 减少依赖数量
2. 使用 `npm ci` 代替 `npm install`
3. 添加 `.npmrc` 缓存配置

---

## 📊 监控和维护

### Railway
```bash
# 查看状态
railway status

# 查看日志
railway logs

# 实时日志
railway logs --tail

# 重启
railway restart
```

### Cloudflare Pages
- 自动监控
- 访问 https://dash.cloudflare.com

---

## 🔒 安全建议

1. **更改 SECRET_KEY**
   - 使用随机字符串
   - 定期更换

2. **启用 HTTPS**
   - 自动启用（Cloudflare/Railway）
   - 强制重定向

3. **配置 CORS**
   - 只允许信任的域名
   - 定期检查

4. **速率限制**
   - 配置 API 限流
   - 防止滥用

5. **日志审计**
   - 定期检查日志
   - 监控异常访问

---

## 🎓 学习资源

### Railway
- [官方文档](https://docs.railway.app/)
- [GitHub 集成](https://docs.railway.app/guides/deploying-with-github)
- [环境变量](https://docs.railway.app/environment-variables)

### Cloudflare Pages
- [快速开始](https://developers.cloudflare.com/pages/get-started)
- [GitHub 集成](https://developers.cloudflare.com/pages/get-started/guide#connect-to-git)
- [自定义域名](https://developers.cloudflare.com/pages/get-started/custom-domains)

### GitHub Actions
- [工作流语法](https://docs.github.com/en/actions/learn-github-actions)
- [Secrets](https://docs.github.com/en/actions/security-guides)

---

## ✅ 验证清单

部署完成后，验证以下内容：

### 后端验证
```bash
curl https://your-backend.railway.app/api/health
# 响应: {"status": "healthy", "service": "K-Semantix AI API"}
```

### 前端验证
- [ ] 页面正常加载
- [ ] 用户注册/登录
- [ ] 文件上传
- [ ] 分析功能
- [ ] 图表显示

### 安全验证
- [ ] HTTPS 启用
- [ ] CORS 配置
- [ ] 无敏感信息泄露

---

## 📞 获取帮助

### 文档资源
1. **[CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md)** - 详细部署指南
2. **[RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)** - 快速部署
3. **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - 总结参考

### 社区支持
- GitHub Issues
- Railway Discord
- Cloudflare 社区

### 官方文档
- Railway: https://docs.railway.app/
- Cloudflare: https://developers.cloudflare.com/

---

## 🎉 部署成功！

恭喜！你的 K-Semantix AI 现在已经部署到云端。

**访问地址**：
- 前端: `https://your-project.pages.dev`
- 后端: `https://your-project.railway.app`

**下一步**：
1. 测试所有功能
2. 配置自定义域名
3. 邀请用户使用
4. 监控性能

---

**祝部署顺利！** 🚀

最后更新: 2024年
