# K-Semantix AI 快速启动指南

## 🚀 快速开始

### 方式一：使用脚本自动安装（推荐）

#### Windows 用户
```bash
.\setup.bat
```

#### macOS/Linux 用户
```bash
chmod +x setup.sh
./setup.sh
```

### 方式二：手动安装

#### 1. 安装后端依赖

```bash
cd backend
pip install -r requirements.txt
```

**重要提示**：
- KoNLPy 需要 Java 环境。请先安装 JDK 8+
- Windows 用户：下载并安装 JDK from https://adoptium.net/
- macOS 用户：`brew install openjdk@11`
- Linux 用户：`sudo apt install openjdk-11-jdk`

#### 2. 安装前端依赖

```bash
cd frontend
npm install
```

#### 3. 创建必要目录

```bash
cd backend
mkdir -p uploads instance
```

#### 4. 初始化数据库

```bash
cd backend
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database initialized!')"
```

### 4. 启动应用

#### 启动后端（终端 1）

```bash
cd backend
python app.py
```

您应该看到：
```
* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

#### 启动前端（终端 2）

```bash
cd frontend
npm run dev
```

您应该看到：
```
VITE v5.0.8  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

### 5. 访问应用

打开浏览器访问：**http://localhost:3000**

## 📋 首次使用流程

### 1. 注册账号

- 点击 "Register here" 链接
- 填写用户名、邮箱、密码
- 点击 "Create Account"

### 2. 上传字幕文件

- 进入 "Upload" 页面
- 拖拽或选择字幕文件（支持 .srt, .txt, .json）
- 输入标题（可选）
- 点击 "Upload and Parse"

**示例文件位置**：
```
backend/uploads/sample.srt
backend/uploads/sample.txt
backend/uploads/sample.json
```

### 3. 执行分析

#### 文本预处理
- 进入 "Analysis" 页面
- 选择上传的文件
- 点击 "Preprocess Text"

#### 特征提取
- 点击 "Extract Features"
- 查看词频、词性、敬语分析结果

#### 情感分析
- 进入 "Sentiment" 页面
- 选择文件
- 点击 "Analyze Sentiment"
- 查看情绪分布图表

#### 角色分析
- 进入 "Characters" 页面
- 选择文件
- 点击 "Analyze Characters"
- 查看角色关系网络

### 4. 数据可视化

- 进入 "Visualization" 页面
- 选择文件
- 选择不同的图表类型：
  - ☁️ Word Cloud（词云）
  - 💡 Sentiment Analysis（情感分析）
  - 👥 Character Stats（角色统计）
  - 📊 POS Distribution（词性分布）

### 5. 导出报告

- 进入 "Settings" 页面
- 选择 "Export Reports"
- 点击 "Download PDF Report"

## 🛠️ 常见问题

### Q1: pip install 失败

**解决方案**：
```bash
# 确保 pip 是最新的
python -m pip install --upgrade pip

# 使用国内镜像（如果网络慢）
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### Q2: KoNLPy 导入错误

**解决方案**：
1. 确认已安装 Java：
   ```bash
   java -version
   ```

2. 设置 JAVA_HOME 环境变量：
   - Windows: `setx JAVA_HOME "C:\Program Files\Java\jdk-11"`
   - macOS/Linux: `export JAVA_HOME=/path/to/java`

3. 重启终端并重新安装：
   ```bash
   pip install konlpy
   ```

### Q3: 前端无法连接后端

**解决方案**：
1. 确认后端正在运行（终端 1）
2. 检查后端端口（默认 5000）
3. 如果端口被占用，修改 `backend/app.py` 中的端口

### Q4: npm install 失败

**解决方案**：
```bash
# 使用淘宝镜像
npm install --registry=https://registry.npmmirror.com

# 或清除缓存后重试
npm cache clean --force
npm install
```

### Q5: 数据库初始化失败

**解决方案**：
```bash
cd backend
del ksemantix.db  # Windows
# rm ksemantix.db  # macOS/Linux

python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database initialized!')"
```

## 📁 项目文件说明

```
Koramind/
├── backend/
│   ├── app.py                 # Flask 主应用
│   ├── models/
│   │   └── database.py        # 数据库表定义
│   ├── routes/
│   │   ├── auth.py           # 用户认证 API
│   │   ├── corpus.py         # 文件上传 API
│   │   ├── analysis.py       # 分析 API
│   │   ├── visualization.py  # 可视化 API
│   │   └── export.py         # 导出 API
│   ├── nlp/
│   │   ├── preprocessor.py   # 文本预处理
│   │   ├── feature_extractor.py  # 特征提取
│   │   ├── sentiment_analyzer.py  # 情感分析
│   │   └── semantic_analyzer.py  # 语义分析
│   └── uploads/              # 上传文件存储
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   ├── components/      # 通用组件
│   │   ├── contexts/       # React Context
│   │   └── utils/          # 工具函数
│   └── package.json
│
├── requirements.txt         # Python 依赖
├── package.json            # Node 依赖
├── README.md              # 项目说明
└── setup.bat/.sh          # 自动安装脚本
```

## 🎯 功能演示

### 支持的文件格式

#### SRT 格式
```
1
00:00:01,000 --> 00:00:04,000
안녕하세요!

2
00:00:05,000 --> 00:00:08,000
김철수: 안녕하세요.
```

#### TXT 格式
```
김철수: 안녕하세요!
박영희: 안녕하세요! 만나서 반갑습니다.
```

#### JSON 格式
```json
{
  "dialogues": [
    {
      "speaker": "김철수",
      "text": "안녕하세요!",
      "start": "00:00:01",
      "end": "00:00:04"
    }
  ]
}
```

## 📊 技术指标

- **支持的字幕格式**：.srt, .txt, .json
- **最大文件大小**：100MB
- **数据库**：SQLite
- **后端框架**：Flask
- **前端框架**：React 18 + Vite
- **NLP 引擎**：KoNLPy
- **情感分析**：基于关键词 + 规则引擎
- **语义分析**：Sentence-Transformers（可选）

## 🔧 开发命令

### 后端开发
```bash
cd backend
python app.py  # 开发模式运行
```

### 前端开发
```bash
cd frontend
npm run dev    # 开发服务器
npm run build  # 生产构建
npm run preview # 预览生产版本
```

## 📝 注意事项

1. **首次运行**：需要初始化数据库
2. **KoNLPy**：需要 Java 环境
3. **端口占用**：确保 3000 和 5000 端口未被占用
4. **上传文件**：会自动保存在 `backend/uploads/` 目录
5. **数据持久化**：所有数据存储在 `backend/ksemantix.db`

## 🎉 成功标志

当您看到以下内容时，说明系统运行正常：

**后端**：
```
* Running on http://127.0.0.1:5000/
```

**前端**：
```
➜  Local:   http://localhost:3000/
```

## 💡 提示

- 使用示例文件测试功能
- 定期清理上传目录（`backend/uploads/`）
- 定期备份数据库（`backend/ksemantix.db`）
- 查看浏览器控制台获取错误信息

## 📞 获取帮助

- 查看 `README.md` 了解完整文档
- 查看 `backend/routes/` 目录了解 API
- 查看 `frontend/src/pages/` 了解前端实现

---

**祝您使用愉快！** 🎊
