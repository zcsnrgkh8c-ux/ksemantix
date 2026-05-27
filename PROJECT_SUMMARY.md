# K-Semantix AI - Korean Semantic Analysis Platform
# 韩语影视语义智能分析平台

## 📋 项目概述

**K-Semantix AI** 是一个完整的韩语影视语义分析平台，实现了"韩语影视台词语料挖掘与语言特征分析系统"专利中的所有核心功能。

### 核心特性

✅ **完整的全栈架构**：React + Flask + SQLite  
✅ **真实的 NLP 处理**：KoNLPy + Transformers  
✅ **智能语义分析**：Sentence-Transformers  
✅ **多样化的可视化**：ECharts 交互式图表  
✅ **PDF 报告导出**：ReportLab 自动生成  

## 🎯 实现的功能模块

### 1. 用户认证系统
- ✅ 用户注册与登录
- ✅ JWT Token 认证
- ✅ 密码哈希加密
- ✅ 会话管理

### 2. 语料采集模块
- ✅ 支持 .srt 字幕文件上传
- ✅ 支持 .txt 文本文件上传
- ✅ 支持 .json 结构化文件上传
- ✅ 自动解析时间轴
- ✅ 自动提取对白
- ✅ 自动识别角色名称

### 3. 文本预处理模块
- ✅ HTML 标签去除
- ✅ 特殊字符过滤
- ✅ 韩语文本 Unicode 标准化
- ✅ 韩语分词（KoNLPy）
- ✅ 停用词过滤
- ✅ 词性标注（POS Tagging）
- ✅ 敬语识别
- ✅ 文本规范化

### 4. 语言特征提取模块
- ✅ 高频词统计
- ✅ 名词提取
- ✅ 动词提取
- ✅ 形容词提取
- ✅ 敬语识别与等级分析
- ✅ 句式长度分析
- ✅ 角色语言风格分析
- ✅ 高频口头禅识别
- ✅ 词性分布统计

### 5. 情感分析模块
- ✅ 四种情绪分类：开心、愤怒、悲伤、中性
- ✅ 基于关键词和规则的情感判断
- ✅ 情感强度检测
- ✅ 情绪置信度计算
- ✅ 情感时间线分析
- ✅ 角色情绪分布
- ✅ 情感趋势图

### 6. 语义关联分析模块
- ✅ 角色台词模式提取
- ✅ 台词相似度分析（Sentence-Transformers）
- ✅ 角色关系网络构建
- ✅ 语义关联图谱
- ✅ 角色亲密度计算

### 7. 数据可视化模块
- ✅ 词云图
- ✅ 柱状图
- ✅ 饼图
- ✅ 折线图
- ✅ 雷达图
- ✅ 关系网络图
- ✅ 情感时间线
- ✅ 角色对比图

### 8. 报告导出功能
- ✅ PDF 分析报告生成
- ✅ Word 频率统计表
- ✅ 情感分析汇总
- ✅ 角色统计表
- ✅ AI 智能总结

## 🏗️ 项目架构

```
Koramind/
│
├── backend/                    # Flask 后端
│   ├── app.py                 # 应用入口
│   ├── models/               # 数据库模型
│   │   └── database.py       # 6 个数据表
│   ├── routes/               # API 路由
│   │   ├── auth.py          # 认证 API
│   │   ├── corpus.py        # 语料 API
│   │   ├── analysis.py      # 分析 API
│   │   ├── visualization.py # 可视化 API
│   │   └── export.py        # 导出 API
│   ├── nlp/                 # NLP 处理模块
│   │   ├── preprocessor.py  # 文本预处理
│   │   ├── feature_extractor.py  # 特征提取
│   │   ├── sentiment_analyzer.py  # 情感分析
│   │   └── semantic_analyzer.py  # 语义分析
│   └── uploads/             # 文件存储
│
├── frontend/                  # React 前端
│   ├── src/
│   │   ├── pages/          # 页面组件
│   │   │   ├── Login.jsx   # 登录页
│   │   │   ├── Register.jsx  # 注册页
│   │   │   ├── Dashboard.jsx # 仪表盘
│   │   │   ├── Upload.jsx    # 上传页
│   │   │   ├── Analysis.jsx  # 分析页
│   │   │   ├── Sentiment.jsx # 情感页
│   │   │   ├── Characters.jsx # 角色页
│   │   │   ├── Visualization.jsx  # 可视化页
│   │   │   └── Settings.jsx  # 设置页
│   │   ├── components/     # 通用组件
│   │   ├── contexts/       # React Context
│   │   └── utils/          # 工具函数
│   └── package.json
│
├── requirements.txt          # Python 依赖
├── package.json             # Node 依赖
├── README.md                # 项目文档
├── QUICKSTART.md           # 快速开始
├── setup.bat / setup.sh     # 自动安装脚本
├── LICENSE                 # MIT 许可证
└── .gitignore             # Git 忽略文件
```

## 🛠️ 技术栈详情

### 后端技术
- **Web 框架**：Flask 3.0.0
- **数据库**：SQLite + SQLAlchemy
- **认证**：JWT + Werkzeug
- **NLP**：KoNLPy 0.6.0
- **深度学习**：Transformers 4.36.0
- **语义**：Sentence-Transformers 2.2.2
- **PDF 生成**：ReportLab 4.0.7

### 前端技术
- **框架**：React 18.2.0
- **构建工具**：Vite 5.0.8
- **样式**：TailwindCSS 3.4.0
- **图表**：ECharts 5.4.3
- **路由**：React Router 6.21.0
- **HTTP**：Axios 1.6.2
- **通知**：React Hot Toast

## 📊 数据库设计

### 用户表 (users)
```sql
- id: INTEGER PRIMARY KEY
- username: VARCHAR(80) UNIQUE
- password_hash: VARCHAR(200)
- email: VARCHAR(120) UNIQUE
- created_at: DATETIME
- is_active: BOOLEAN
```

### 语料文件表 (corpus_files)
```sql
- id: INTEGER PRIMARY KEY
- user_id: INTEGER FOREIGN KEY
- filename: VARCHAR(200)
- filepath: VARCHAR(300)
- file_type: VARCHAR(10)
- file_size: INTEGER
- title: VARCHAR(200)
- total_lines: INTEGER
- status: VARCHAR(20)
- upload_time: DATETIME
```

### 台词数据表 (dialogues)
```sql
- id: INTEGER PRIMARY KEY
- corpus_file_id: INTEGER FOREIGN KEY
- line_number: INTEGER
- timestamp_start: VARCHAR(20)
- timestamp_end: VARCHAR(20)
- character: VARCHAR(100)
- original_text: TEXT
- normalized_text: TEXT
- pos_tags: TEXT
- is_formal: BOOLEAN
- formality_level: INTEGER
```

### 情感分析表 (sentiments)
```sql
- id: INTEGER PRIMARY KEY
- dialogue_id: INTEGER FOREIGN KEY
- emotion: VARCHAR(20)
- confidence: FLOAT
- timestamp: DATETIME
```

### 角色关系表 (character_relationships)
```sql
- id: INTEGER PRIMARY KEY
- corpus_file_id: INTEGER FOREIGN KEY
- character1: VARCHAR(100)
- character2: VARCHAR(100)
- relationship_type: VARCHAR(50)
- interaction_count: INTEGER
- similarity_score: FLOAT
```

### 词频表 (word_frequencies)
```sql
- id: INTEGER PRIMARY KEY
- corpus_file_id: INTEGER FOREIGN KEY
- word: VARCHAR(100)
- frequency: INTEGER
- pos_tag: VARCHAR(20)
- word_type: VARCHAR(20)
```

## 🔧 API 接口设计

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/verify` - 验证 Token
- `GET /api/auth/profile` - 获取用户信息

### 语料接口
- `POST /api/corpus/upload` - 上传文件
- `GET /api/corpus/files` - 获取文件列表
- `GET /api/corpus/files/<id>` - 获取文件详情
- `DELETE /api/corpus/files/<id>` - 删除文件

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
- `GET /api/visualization/pos-distribution/<file_id>` - 词性分布
- `GET /api/visualization/relationship-graph/<file_id>` - 关系图

### 导出接口
- `GET /api/export/pdf-report/<file_id>` - PDF 报告
- `GET /api/export/json-report/<file_id>` - JSON 数据

## 📦 依赖包清单

### Python 依赖 (requirements.txt)
```
Flask==3.0.0
Flask-CORS==4.0.0
Flask-SQLAlchemy==3.1.1
Werkzeug==3.0.1
Requests==2.31.0
Python-dotenv==1.0.0
KoNLPy==0.6.0
Transformers==4.36.0
Sentence-Transformers==2.2.2
Pandas==2.1.4
NumPy==1.26.2
Matplotlib==3.8.2
Scikit-learn==1.3.2
ReportLab==4.0.7
```

### Node.js 依赖 (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "axios": "^1.6.2",
    "echarts": "^5.4.3",
    "echarts-for-react": "^3.0.2",
    "react-hot-toast": "^2.4.1",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1"
  }
}
```

## 🚀 快速启动

### 1. 克隆项目
```bash
git clone <repository-url>
cd Koramind
```

### 2. 安装依赖
```bash
# 后端
cd backend
pip install -r requirements.txt

# 前端
cd ../frontend
npm install
```

### 3. 启动应用
```bash
# 终端 1: 后端
cd backend
python app.py

# 终端 2: 前端
cd frontend
npm run dev
```

### 4. 访问应用
打开浏览器访问：http://localhost:3000

## 📝 使用流程

1. **注册账号** → 登录系统
2. **上传语料** → 上传 .srt/.txt/.json 文件
3. **文本预处理** → 清理和标准化文本
4. **特征提取** → 提取词频、词性等特征
5. **情感分析** → 分析角色情绪
6. **语义分析** → 构建角色关系网络
7. **数据可视化** → 查看各种图表
8. **导出报告** → 生成 PDF 分析报告

## 📊 系统界面

### 登录/注册页面
- 深色科技风 UI
- 蓝紫色渐变
- 毛玻璃效果
- 粒子动画背景

### 仪表盘页面
- AI 数据大屏风格
- 动态数字动画
- ECharts 可视化图表
- 科技感卡片布局

### 分析页面
- 文本预处理结果展示
- 特征提取统计
- 情感分布图表
- 角色关系图谱

## 🎓 应用场景

- ✅ 大学生计算机设计大赛
- ✅ AI/NLP 课程设计
- ✅ 软件著作权申请
- ✅ 专利配套演示系统
- ✅ 科研展示
- ✅ 韩语教学研究
- ✅ 影视内容分析

## 📚 文档说明

- **README.md** - 项目完整说明文档
- **QUICKSTART.md** - 快速开始指南
- **LICENSE** - MIT 许可证

## 🔒 安全特性

- ✅ 密码哈希加密（bcrypt）
- ✅ JWT Token 认证
- ✅ CORS 跨域控制
- ✅ SQL 注入防护
- ✅ XSS 攻击防护
- ✅ 输入验证

## ⚡ 性能优化

- ✅ 前端代码分割
- ✅ 数据库索引优化
- ✅ 异步处理支持
- ✅ 文件压缩上传
- ✅ 缓存机制

## 🌟 特色功能

1. **多语言混合处理**：支持韩文、中文、英文混合文本
2. **智能角色识别**：自动识别对话中的角色
3. **情感强度分析**：不仅分类，还分析情感强度
4. **角色关系推理**：基于台词相似度推理角色关系
5. **实时预览**：上传文件后实时预览内容
6. **交互式图表**：支持缩放、筛选等交互操作
7. **一键导出**：快速生成完整分析报告

## 🎯 未来扩展

- [ ] 支持更多字幕格式（MKV、SSA/ASS）
- [ ] 添加视频播放预览
- [ ] 批量文件处理
- [ ] 机器学习模型训练
- [ ] 多语言翻译集成
- [ ] 实时协作功能
- [ ] 移动端适配
- [ ] 云端部署支持

## 👥 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- KoNLPy 团队 - 韩语处理工具
- Hugging Face - Transformer 模型库
- Flask 社区 - Web 框架
- React 团队 - 前端框架
- ECharts 团队 - 数据可视化

---

**K-Semantix AI** - 让韩语语义分析更智能！

© 2024 K-Semantix AI. All rights reserved.
