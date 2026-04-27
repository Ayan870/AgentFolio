@echo off
title AgentFolio Dev Server

echo Starting AgentFolio Backend on port 8001...
start "AgentFolio Backend" cmd /k "cd /d C:\Users\user\AgentFolio\backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8001"

timeout /t 4 /nobreak > nul

echo Starting AgentFolio Frontend on port 3001...
start "AgentFolio Frontend" cmd /k "cd /d C:\Users\user\AgentFolio\frontend && npm run dev -- --port 3001"

echo.
echo Both servers starting...
echo Backend  --^>  http://localhost:8001
echo Frontend --^>  http://localhost:3001
echo API Docs --^>  http://localhost:8001/docs
echo.
pause