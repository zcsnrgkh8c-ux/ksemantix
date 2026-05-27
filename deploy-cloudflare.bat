@echo off
REM K-Semantix AI Cloudflare Deployment Script

echo ======================================
echo K-Semantix AI - Cloudflare Deployment
echo ======================================
echo.

REM Check tools
echo [1/6] Checking required tools...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found
    echo Download: https://nodejs.org/
    exit /b 1
)
echo OK: Node.js found

REM Install Wrangler if needed
where wrangler >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Wrangler CLI...
    npm install -g wrangler
)
echo OK: Wrangler found
echo.

REM Backend deployment
echo [2/6] Backend deployment to Railway...
echo NOTE: Ensure Railway CLI is configured
echo Visit: https://railway.app/dashboard
echo.

set /p confirm="Is Railway configured? (Y/N): "
if /i "%confirm%"=="Y" (
    cd backend
    
    REM Create environment file
    (
        echo FLASK_APP=app_production.py
        echo FLASK_ENV=production
        echo SECRET_KEY=%RANDOM%%RANDOM%%RANDOM%
        echo DATABASE_PATH=/data
    ) > .env
    
    REM Deploy to Railway
    railway up
    
    cd ..
    echo OK: Backend deployed
) else (
    echo Skipping backend deployment
    echo Please deploy backend manually to Railway
)
echo.

REM Frontend setup
echo [3/6] Configuring frontend...

set /p backend_url="Enter backend API URL (e.g., https://your-backend.railway.app): "

cd frontend
call npm install

(
    echo VITE_API_BASE_URL=%backend_url%/api
) > .env.production

echo Building frontend...
call npm run build

cd ..
echo OK: Frontend built
echo.

REM Frontend deployment
echo [4/6] Deploying frontend to Cloudflare Pages...
echo.

call wrangler login
call wrangler pages project create k-semantix-ai --no-git-integration
call wrangler pages deploy frontend\dist --project-name=k-semantix-ai

echo OK: Frontend deployed
echo.

REM Domain setup
echo [5/6] Custom domain configuration...
set /p setup_domain="Configure custom domain? (Y/N): "
if /i "%setup_domain%"=="Y" (
    set /p domain="Enter domain (e.g., ksemantix.ai): "
    call wrangler pages domain add k-semantix-ai %domain%
    echo OK: Domain configured
    echo Please add DNS record at your domain provider:
    echo   CNAME www -^> k-semantix-ai.pages.dev
)
echo.

REM Verification
echo [6/6] Deployment verification...
echo.
echo ======================================
echo Deployment Complete!
echo ======================================
echo.
echo Access URLs:
echo   Frontend: https://k-semantix-ai.pages.dev
echo   Backend: %backend_url%
echo.
echo Next Steps:
echo 1. Configure Railway environment variables
echo 2. Initialize database
echo 3. Test all features
echo 4. Configure custom domain
echo.

pause
