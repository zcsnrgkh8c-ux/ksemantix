@echo off
echo ========================================
echo K-Semantix AI Setup Script
echo ========================================
echo.

echo [1/4] Installing Python dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing Node.js dependencies...
cd ..\frontend
npm install
if %errorlevel% neq 0 (
    echo Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Creating necessary directories...
cd ..\backend
if not exist "uploads" mkdir uploads
if not exist "instance" mkdir instance

echo.
echo [4/4] Initializing database...
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database initialized!')"

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the application:
echo 1. Open terminal 1: cd backend ^&^& python app.py
echo 2. Open terminal 2: cd frontend ^&^& npm run dev
echo.
echo Access the application at: http://localhost:3000
echo.
pause
