@echo off
echo ===================================
echo Starting TradeMind System...
echo ===================================

echo Starting Backend (FastAPI)...
start "TradeMind Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

echo Starting Frontend (Next.js)...
start "TradeMind Frontend" cmd /k "cd frontend && npm run dev"

echo ===================================
echo Servers are launching in separate windows.
echo Please wait 10-20 seconds for them to initialize.
echo Then refresh your browser at localhost:3000.
echo ===================================
pause
