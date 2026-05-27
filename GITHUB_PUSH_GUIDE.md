# GitHub 推送指南

## 📋 完整步骤

### 第一步：在 GitHub 上创建仓库

#### 1.1 登录 GitHub

访问 https://github.com 并登录您的账号

如果没有账号，点击 **"Sign up"** 注册一个新账号

#### 1.2 创建新仓库

1. 点击右上角的 **"+"** 图标
2. 选择 **"New repository"**
3. 填写仓库信息：
   ```
   Repository name: ksemantix
   Description: K-Semantix AI - Korean Semantic Analysis Platform
   Visibility: Public (公开) 或 Private (私有)
   ```
4. **不要**勾选 "Add a README file"
5. 点击 **"Create repository"**

#### 1.3 复制仓库地址

创建完成后，你会看到仓库地址，类似：
```
https://github.com/yourusername/ksemantix.git
```

或者使用 SSH：
```
git@github.com:yourusername/ksemantix.git
```

---

### 第二步：在本地初始化 Git 并推送

打开终端（Windows 用 PowerShell 或 CMD，macOS/Linux 用 Terminal）

#### 2.1 进入项目目录

```bash
cd Koramind
```

#### 2.2 初始化 Git 仓库

```bash
git init
```

成功后会显示：
```
Initialized empty Git repository in C:/Users/76827/Documents/trae_projects/Koramind/.git/
```

#### 2.3 配置用户信息（如果还没有）

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### 2.4 添加所有文件到暂存区

```bash
git add .
```

这条命令会添加所有文件（除了 `.gitignore` 中指定的文件）

#### 2.5 查看状态

```bash
git status
```

会显示将要提交的文件列表

#### 2.6 提交文件

```bash
git commit -m "K-Semantix AI - Korean Semantic Analysis Platform"
```

成功后会显示类似：
```
[main (root-commit) abc1234] K-Semantix AI - Korean Semantic Analysis Platform
  50 files changed, 1234 insertions(+)
```

#### 2.7 添加远程仓库

```bash
git remote add origin https://github.com/yourusername/ksemantix.git
```

#### 2.8 推送到 GitHub

```bash
git branch -M main
git push -u origin main
```

如果是第一次推送，可能需要输入 GitHub 用户名和密码（或 Personal Access Token）

---

## 🔐 GitHub 认证方式

### 方式一：使用用户名和密码（已弃用）

⚠️ **注意**：GitHub 已不支持密码认证，需要使用 Personal Access Token

### 方式二：使用 Personal Access Token（推荐）

#### 创建 Token

1. 点击头像 → **Settings**
2. 左侧菜单 → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. 点击 **"Generate new token"**
5. 配置：
   - **Name**: Git Push
   - **Expiration**: 选择过期时间
   - **Scopes**: ✅ **repo** (完全控制)
6. 点击 **"Generate token"**
7. **重要**：复制并保存 token（只会显示一次）

#### 使用 Token

推送时，输入用户名，然后密码栏输入 token：

```bash
git push -u origin main
Username: yourusername
Password: ghp_xxxxxxxxxxxxxxxxxxxx
```

### 方式三：使用 SSH（推荐）

#### 生成 SSH Key

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

一直按回车使用默认值

#### 添加 SSH Key 到 GitHub

1. 复制公钥：
   ```bash
   # Windows
   cat ~/.ssh/id_ed25519.pub | clip
   
   # macOS
   cat ~/.ssh/id_ed25519.pub | pbcopy
   
   # Linux
   cat ~/.ssh/id_ed25519.pub
   ```

2. GitHub → Settings → SSH and GPG keys → New SSH key
3. 粘贴公钥，保存

#### 使用 SSH 推送

```bash
git remote set-url origin git@github.com:yourusername/ksemantix.git
git push -u origin main
```

---

## 📝 常用 Git 命令

### 查看状态
```bash
git status
```

### 查看远程仓库
```bash
git remote -v
```

### 查看提交历史
```bash
git log
```

### 添加单个文件
```bash
git add filename.txt
```

### 添加所有修改
```bash
git add .
```

### 提交修改
```bash
git commit -m "Your commit message"
```

### 推送到远程
```bash
git push
```

### 拉取更新
```bash
git pull
```

---

## ❌ 常见问题

### 问题 1：认证失败

**症状**：
```
remote: Authentication failed
```

**解决方案**：
1. 使用 Personal Access Token
2. 或配置 SSH Key
3. 检查仓库地址是否正确

### 问题 2：仓库已存在

**症状**：
```
fatal: remote origin already exists.
```

**解决方案**：
```bash
git remote remove origin
git remote add origin https://github.com/yourusername/ksemantix.git
```

### 问题 3：分支冲突

**症状**：
```
error: failed to push some refs
```

**解决方案**：
```bash
git pull origin main --rebase
git push origin main
```

### 问题 4：忽略文件无效

**解决方案**：
```bash
# 查看被忽略的文件
git status --ignored

# 强制添加（如果确实需要）
git add -f filename
```

---

## 🔄 更新代码到 GitHub

以后修改代码后，更新步骤：

```bash
# 1. 查看修改
git status

# 2. 添加修改
git add .

# 3. 提交
git commit -m "Update: your changes description"

# 4. 推送
git push
```

---

## 🎯 完整示例

```bash
# 1. 进入项目目录
cd Koramind

# 2. 初始化
git init

# 3. 配置（如果是第一次）
git config --global user.name "YourName"
git config --global user.email "your@email.com"

# 4. 添加所有文件
git add .

# 5. 提交
git commit -m "Initial commit: K-Semantix AI"

# 6. 添加远程仓库
git remote add origin https://github.com/yourusername/ksemantix.git

# 7. 推送
git branch -M main
git push -u origin main
```

---

## ✅ 验证成功

推送成功后，在浏览器访问：
```
https://github.com/yourusername/ksemantix
```

应该能看到所有文件。

---

## 🚀 下一步

代码推送成功后，就可以开始部署了：

1. **Railway 部署后端**
   - 访问 https://railway.app
   - 创建项目 → Connect to Git
   - 选择这个仓库的 `backend` 目录

2. **Cloudflare 部署前端**
   - 访问 https://pages.cloudflare.com
   - 创建项目 → Connect to Git
   - 选择这个仓库的 `frontend` 目录

---

## 📞 需要帮助？

- GitHub 官方文档：https://docs.github.com/
- Git 教程：https://git-scm.com/doc

---

**完成推送后，告诉我！** 我会帮您继续下一步的部署！ 💪
