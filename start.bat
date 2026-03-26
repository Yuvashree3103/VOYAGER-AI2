@echo off
title Voyager AI - Starting Servers
color 0A

echo.
echo  =========================================
echo   VOYAGER AI - Smart Travel Platform
echo  =========================================
echo.
echo  Starting Backend (Flask)...
start "Voyager Backend" cmd /k "cd /d d:\VOYAGER AI2\backend && d:\VOYAGER AI2\backend\venv_new\Scripts\activate && python app.py"

timeout /t 3 /nobreak >nul

echo  Starting Frontend (Vite)...
start "Voyager Frontend" cmd /k "cd /d d:\VOYAGER AI2\frontend && npx vite"

timeout /t 4 /nobreak >nul

echo  Opening browser...
start http://localhost:5173

echo.
echo  Both servers are running!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo.
echo  Close the two terminal windows to stop the servers.
pause
