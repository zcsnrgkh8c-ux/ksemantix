# K-Semantix AI - Korean Semantic Analysis Platform

韩语影视语义智能分析平台

## 项目简介

K-Semantix AI 是一个完整的韩语影视台词语料挖掘与语言特征分析系统，基于深度学习的 NLP 技术，提供全面的语义分析功能。

## 功能特性

- ✅ 用户认证系统（登录/注册）
- ✅ 语料采集模块（支持 .srt, .txt, .json 字幕文件）
- ✅ 文本预处理模块（韩语分词、词性标注、停用词过滤）
- ✅ 语言特征提取模块（高频词、敬语识别、句式分析）
- ✅ 情感分析模块（开心、愤怒、悲伤、中性分类）
- ✅ 语义关联分析模块（角色关系网络、台词相似度）
- ✅ 数据可视化模块（词云、柱状图、饼图、折线图）
- ✅ PDF 报告导出功能

## 技术栈

### 前端
- React 18
- Vite
- TailwindCSS
- ECharts
- Axios
- React Router

### 后端
- Python Flask
- Flask-CORS
- Flask-SQLAlchemy

### 数据库
- SQLite

### AI/NLP
- KoNLPy（韩语处理）
- Transformers（Hugging Face）
- Sentence-Transformers（语义相似度）
- Scikit-learn（机器学习）

## 项目结构

```
Koramind/
├── backend/
│   ├── app.py                 # Flask 应用入口
│   ├── models/
│   │   └── database.py        # 数据库模型
│   ├── routes/
│   │   ├── auth.py            # 认证路由
│   │   ├── corpus.py          # 语料上传路由
│   │   ├── analysis.py        # 分析路由
│   │   ├── visualization.py   # 可视化路由
│   │   └── export.py          # 导出路由
│   ├── nlp/
│   │   ├── preprocessor.py    # 文本预处理器
│   │   ├── feature_extractor.py  # 特征提取器
│   │   ├── sentiment_analyzer.py  # 情感分析器
│   │   └── semantic_analyzer.py  # 语义分析器
│   ├── utils/
│   └── uploads/               # 上传文件目录
├── frontend/
│   ├── src/
│   │   ├── components/        # React 组件
│   │   ├── pages/             # 页面组件
│   │   ├── contexts/          # React Context
│   │   ├── utils/             # 工具函数
│   │   ├── App.jsx           # 主应用
│   │   ├── main.jsx          # 入口文件
│   │   └── index.css         # 全局样式
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── requirements.txt           # Python 依赖
├── package.json              # Node.js 依赖
└── README.md
```

## 快速开始

### 1. 环境要求

- Python 3.8+
- Node.js 16+
- npm 或 yarn

### 2. 安装后端依赖

```bash
cd backend
pip install -r requirements.txt
```

**注意**: KoNLPy 需要安装 Java 环境，请参考 [KoNLPy 官方文档](https://konlpy.org/en/latest/install/)

### 3. 安装前端依赖

```bash
cd frontend
npm install
```

### 4. 启动后端服务

```bash
cd backend
python app.py
```

后端服务将在 http://localhost:5000 启动

### 5. 启动前端服务

```bash
cd frontend
npm run dev
```

前端服务将在 http://localhost:3000 启动

### 6. 访问应用

打开浏览器访问 http://localhost:3000

## 使用说明

### 1. 注册/登录
- 首次使用时注册账号
- 使用注册的账号登录

### 2. 上传语料
- 进入 "Upload" 页面
- 上传 .srt, .txt 或 .json 格式的字幕文件
- 系统自动解析并提取对白

### 3. 文本分析
- 进入 "Analysis" 页面
- 选择已上传的文件
- 执行文本预处理和特征提取

### 4. 情感分析
- 进入 "Sentiment" 页面
- 选择文件进行情感分析
- 查看情绪分布和时间线

### 5. 角色分析
- 进入 "Characters" 页面
- 分析角色语言风格和关系网络

### 6. 数据可视化
- 进入 "Visualization" 页面
- 选择不同的图表类型查看分析结果

### 7. 导出报告
- 进入 "Settings" 页面
- 导出 PDF 分析报告

## API 文档

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/verify` - 验证 Token

### 语料接口
- `POST /api/corpus/upload` - 上传字幕文件
- `GET /api/corpus/files` - 获取文件列表
- `GET /api/corpus/files/<id>` - 获取文件详情

### 分析接口
- `POST /api/analysis/preprocess/<file_id>` - 文本预处理
- `POST /api/analysis/extract-features/<file_id>` - 特征提取
- `POST /api/analysis/sentiment/<file_id>` - 情感分析
- `POST /api/analysis/semantic/<file_id>` - 语义分析
- `GET /api/analysis/dashboard-stats` - 仪表盘统计

### 可视化接口
- `GET /api/visualization/word-cloud/<file_id>` - 词云数据
- `GET /api/visualization/sentiment-chart/<file_id>` - 情感图表
- `GET /api/visualization/character-analysis/<file_id>` - 角色分析

### 导出接口
- `GET /api/export/pdf-report/<file_id>` - 导出 PDF 报告

## 数据库模型

### 用户表 (users)
- id (主键)
- username (用户名)
- password_hash (密码哈希)
- email (邮箱)
- created_at (创建时间)

### 语料文件表 (corpus_files)
- id (主键)
- user_id (用户ID)
- filename (文件名)
- filepath (文件路径)
- file_type (文件类型)
- total_lines (总行数)
- status (状态)

### 台词数据表 (dialogues)
- id (主键)
- corpus_file_id (语料文件ID)
- line_number (行号)
- timestamp_start (开始时间)
- character (角色)
- original_text (原始文本)
- normalized_text (标准化文本)
- pos_tags (词性标注)
- is_formal (是否敬语)

### 情感分析表 (sentiments)
- id (主键)
- dialogue_id (台词ID)
- emotion (情绪)
- confidence (置信度)

### 角色关系表 (character_relationships)
- id (主键)
- corpus_file_id (语料文件ID)
- character1 (角色1)
- character2 (角色2)
- similarity_score (相似度)

## 核心 NLP 功能

### 1. 文本预处理
- HTML 标签去除
- 特殊字符过滤
- 韩语 Unicode 标准化
- 文本分词（使用 KoNLPy）
- 停用词过滤
- 词性标注

### 2. 语言特征提取
- 高频词统计
- 名词/动词提取
- 敬语识别
- 句式长度分析
- 角色语言风格分析
- 口头禅识别

### 3. 情感分析
使用基于关键词和规则的方法进行情感分类：
- 开心 (happy)
- 愤怒 (angry)
- 悲伤 (sad)
- 中性 (neutral)

### 4. 语义分析
- 角色台词模式提取
- 台词相似度计算（使用 Sentence-Transformers）
- 角色关系网络构建
- 语义关联分析

## 专利配套功能

本系统严格实现了"韩语影视台词语料挖掘与语言特征分析系统"专利中的所有核心功能：

1. **语料采集模块** - 支持多种字幕格式自动解析
2. **文本预处理模块** - 完整的韩语 NLP 预处理流程
3. **语言特征提取模块** - 多维度语言特征提取
4. **情感分析模块** - 基于 AI 的情绪分类
5. **语义关联分析模块** - 深度语义关系挖掘
6. **数据可视化模块** - 多样化的可视化展示

## 应用场景

- 🎓 大学生计算机设计大赛
- 📚 AI/NLP 课程设计
- 💼 软件著作权申请
- 📝 专利配套演示系统
- 🔬 科研展示

## 许可证

MIT License

---

## 🚀 云端部署

详细部署指南请查看以下文档：

- **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - 部署总结和快速开始
- **[RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)** - Railway + Cloudflare 快速部署
- **[CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md)** - 完整 Cloudflare 部署指南

### 推荐部署架构

```
Cloudflare Pages (前端) + Railway (后端)
```

**费用**: $0/月 (使用免费套餐)

### 快速部署步骤

1. **部署后端到 Railway**
   - 访问 https://railway.app
   - 创建项目 → Deploy from GitHub
   - Railway 自动配置 Java + KoNLPy

2. **部署前端到 Cloudflare Pages**
   - 访问 https://pages.cloudflare.com
   - 创建项目 → Connect to Git
   - 配置 `VITE_API_BASE_URL` 环境变量

3. **完成！**

详细步骤请查看 [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)

---

## 📞 获取帮助

- 查看 `README.md` 完整文档
- 查看 `QUICKSTART.md` 快速开始
- 查看 `DEPLOYMENT_SUMMARY.md` 部署总结
- 提交 GitHub Issue

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- KoNLPy 团队 - 韩语处理工具
- Hugging Face - Transformer 模型
- Flask 社区 - Web 框架
- React 团队 - 前端框架
- ECharts 团队 - 数据可视化

---

**K-Semantix AI** - 让韩语语义分析更智能！

© 2024 K-Semantix AI. All rights reserved.
