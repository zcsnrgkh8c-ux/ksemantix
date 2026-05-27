#!/bin/bash

echo "========================================"
echo "K-Semantix AI Setup Script"
echo "========================================"
echo ""

echo "[1/4] Installing Python dependencies..."
cd backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Failed to install Python dependencies"
    read -p "Press Enter to exit..."
    exit 1
fi

echo ""
echo "[2/4] Installing Node.js dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install Node.js dependencies"
    read -p "Press Enter to exit..."
    exit 1
fi

echo ""
echo "[3/4] Creating necessary directories..."
cd ../backend
mkdir -p uploads instance

echo ""
echo "[4/4] Initializing database..."
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database initialized!')"

echo ""
echo "========================================"
echo "Setup completed successfully!"
echo "========================================"
echo ""
echo "To start the application:"
echo "1. Terminal 1: cd backend && python app.py"
echo "2. Terminal 2: cd frontend && npm run dev"
echo ""
echo "Access the application at: http://localhost:3000"
echo ""
read -p "Press Enter to exit..."
