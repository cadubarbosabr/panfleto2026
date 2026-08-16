@echo off
title Panfleto Eleitoral 2026
echo ========================================================
echo   INICIANDO PANFLETO ELEITORAL 2026 (COLA DIGITAL)
echo ========================================================
echo.

set DENO_PATH=%USERPROFILE%\AppData\Local\agy\bin\deno.exe
if exist "%DENO_PATH%" goto RUN_DENO

where deno >nul 2>&1
if %errorlevel% equ 0 (
    set DENO_PATH=deno
    goto RUN_DENO
)

where python >nul 2>&1
if %errorlevel% equ 0 (
    echo [1/2] Iniciando Servidor Local via Python na porta 3000...
    start http://localhost:3000
    python -m http.server 3000
    exit /b 0
)

echo Abrindo index.html diretamente no navegador...
start index.html
exit /b 0

:RUN_DENO
echo [1/2] Iniciando Servidor Local na porta 3000...
start http://localhost:3000
"%DENO_PATH%" run --allow-net --allow-read "data:text/typescript,import { serveDir } from 'jsr:@std/http/file-server'; Deno.serve({ port: 3000 }, (req) => serveDir(req, { fsRoot: '.' }));"
