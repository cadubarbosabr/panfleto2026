@echo off
title Panfleto Eleitoral 2026
echo ========================================================
echo   INICIANDO PANFLETO ELEITORAL 2026 (COLA DIGITAL)
echo ========================================================
echo.

set DENO_PATH=%USERPROFILE%\AppData\Local\agy\bin\deno.exe
if not exist "%DENO_PATH%" (
    where deno >nul 2>&1
    if %errorlevel% equ 0 (
        set DENO_PATH=deno
    ) else (
        echo [ERRO] Deno nao foi encontrado no sistema.
        pause
        exit /b 1
    )
)

echo [1/2] Iniciando Servidor Local em http://localhost:3000 ...
start /B "" "%DENO_PATH%" run --allow-net --allow-read server.ts

timeout /t 2 /nobreak >nul

echo [2/2] Abrindo navegador...
start http://localhost:3000

echo.
echo ========================================================
echo   Servidor ativo em: http://localhost:3000
echo   Pressione Ctrl+C nesta janela para encerrar.
echo ========================================================
"%DENO_PATH%" run --allow-net --allow-read server.ts
