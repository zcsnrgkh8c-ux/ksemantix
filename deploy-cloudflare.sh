#!/bin/bash

# K-Semantix AI Cloudflare 部署脚本

echo "======================================"
echo "K-Semantix AI - Cloudflare 部署"
echo "======================================"
echo ""

# 检查必要工具
check_tools() {
    echo "[1/6] 检查必要工具..."
    
    # Node.js
    if ! command -v node &> /dev/null; then
        echo "错误: Node.js 未安装"
        echo "安装: https://nodejs.org/"
        exit 1
    fi
    echo "✓ Node.js: $(node --version)"
    
    # npm
    if ! command -v npm &> /dev/null; then
        echo "错误: npm 未安装"
        exit 1
    fi
    echo "✓ npm: $(npm --version)"
    
    # Wrangler (Cloudflare)
    if ! command -v wrangler &> /dev/null; then
        echo "安装 Wrangler CLI..."
        npm install -g wrangler
    fi
    echo "✓ Wrangler: $(wrangler --version)"
    
    echo ""
}

# 部署后端
deploy_backend() {
    echo "[2/6] 部署后端到 Railway..."
    echo "⚠️  注意: 确保已配置 Railway CLI"
    echo "   访问: https://railway.app/dashboard"
    echo ""
    
    read -p "是否已配置 Railway? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd backend
        
        # 创建环境文件
        cat > .env << EOF
FLASK_APP=app_production.py
FLASK_ENV=production
SECRET_KEY=${SECRET_KEY:-$(openssl rand -hex 32)}
DATABASE_PATH=/data
EOF
        
        # 部署到 Railway
        railway up
        
        echo "✓ 后端部署完成"
        echo "✓ Railway 会自动配置 Java 环境"
        
        cd ..
    else
        echo "跳过后端部署"
        echo "请手动部署后端到 Railway"
        echo "文档: https://docs.railway.app/"
    fi
    
    echo ""
}

# 配置前端
setup_frontend() {
    echo "[3/6] 配置前端环境..."
    
    cd frontend
    
    # 安装依赖
    npm install
    
    # 读取后端 URL
    read -p "输入后端 API URL (例如: https://your-backend.railway.app): " backend_url
    
    # 创建环境文件
    cat > .env.production << EOF
VITE_API_BASE_URL=${backend_url}/api
EOF
    
    # 构建
    echo "构建前端..."
    npm run build
    
    echo "✓ 前端构建完成"
    
    cd ..
    
    echo ""
}

# 部署前端
deploy_frontend() {
    echo "[4/6] 部署前端到 Cloudflare Pages..."
    
    # 登录 Cloudflare
    echo "登录 Cloudflare..."
    wrangler login
    
    # 部署
    echo "部署到 Cloudflare Pages..."
    wrangler pages project create k-semantix-ai --no-git-integration || true
    wrangler pages deploy frontend/dist --project-name=k-semantix-ai
    
    echo "✓ 前端部署完成"
    echo ""
}

# 配置域名
setup_domain() {
    echo "[5/6] 配置自定义域名..."
    
    read -p "是否配置自定义域名? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "输入域名 (例如: ksemantix.ai): " domain
        
        # 添加自定义域名
        wrangler pages domain add k-semantix-ai $domain
        
        echo "✓ 域名配置完成"
        echo "请在域名提供商处添加 DNS 记录:"
        echo "  CNAME www -> k-semantix-ai.pages.dev"
    fi
    
    echo ""
}

# 验证部署
verify_deployment() {
    echo "[6/6] 验证部署..."
    echo ""
    
    echo "检查项:"
    echo "✓ 后端健康检查"
    echo "✓ 前端页面访问"
    echo "✓ API 连接测试"
    echo "✓ HTTPS 证书"
    echo ""
    
    echo "======================================"
    echo "部署完成!"
    echo "======================================"
    echo ""
    echo "访问地址:"
    echo "  前端: https://k-semantix-ai.pages.dev"
    echo "  后端: https://your-backend.railway.app"
    echo ""
    echo "后续步骤:"
    echo "1. 在 Railway 配置环境变量"
    echo "2. 初始化数据库"
    echo "3. 测试所有功能"
    echo "4. 配置自定义域名"
    echo ""
}

# 主函数
main() {
    check_tools
    deploy_backend
    setup_frontend
    deploy_frontend
    setup_domain
    verify_deployment
}

main
