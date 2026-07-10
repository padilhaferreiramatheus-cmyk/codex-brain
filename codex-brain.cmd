@echo off
setlocal

set "CODEX_BRAIN_DIR=%~dp0"
set "CODEX_BRAIN_CLI=%CODEX_BRAIN_DIR%dist\src\cli.js"

if not exist "%CODEX_BRAIN_CLI%" (
  echo Codex Brain ainda nao foi buildado.
  echo Rode primeiro:
  echo   cd /d "%CODEX_BRAIN_DIR%"
  echo   npm.cmd run build
  exit /b 1
)

node "%CODEX_BRAIN_CLI%" %*
