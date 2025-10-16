@echo off
setlocal EnableDelayedExpansion

:: ============================================
:: AA Admin Portal - Production Launcher
:: Version: 2.0.0
:: ============================================

title AA Admin Portal Launcher v2.0.0
color 0B
cls

set "SCRIPT_DIR=%~dp0"
set "PORTAL_DIR=%SCRIPT_DIR%admin-portal"
set "NODE_VERSION=20.11.0"
set "NODE_INSTALLER_URL=https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
set "MIN_NODE_MAJOR=16"
set "ERROR_COUNT=0"
set "LOG_FILE=%TEMP%\aa-portal-setup.log"

echo [%date% %time%] AA Admin Portal Setup Started > "%LOG_FILE%"

:: Display banner
echo.
echo ============================================
echo   AA EVENT DECOR - ADMIN PORTAL
echo   Production Launcher v2.0.0
echo ============================================
echo.
echo Log: %LOG_FILE%
echo.

:: ============================================
:: STEP 1: Check Prerequisites
:: ============================================
echo [STEP 1/4] Checking System Prerequisites
echo --------------------------------------------
echo [%date% %time%] Checking prerequisites >> "%LOG_FILE%"

for /f "tokens=4-5 delims=. " %%i in ('ver') do set "WIN_VERSION=%%i.%%j"
echo [*] Windows Version: %WIN_VERSION%
echo Windows Version: %WIN_VERSION% >> "%LOG_FILE%"

:: Check Node.js
echo.
echo Checking Node.js...
call :CheckAndInstallNode
if !ERRORLEVEL! NEQ 0 (
    set /a ERROR_COUNT+=1
    goto :Cleanup
)

:: Check npm
echo.
echo Checking npm...
where npm >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo [X] npm not installed
    echo npm not found >> "%LOG_FILE%"
    set /a ERROR_COUNT+=1
    goto :Cleanup
)
for /f "tokens=*" %%a in ('npm --version 2^>nul') do set "NPM_VER=%%a"
echo [OK] npm v!NPM_VER! installed
echo npm v!NPM_VER! verified >> "%LOG_FILE%"

:: Check Git (optional)
echo.
echo Checking Git...
where git >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo [!] Git not installed (optional)
    echo [!] Some features may be limited
    echo Git not found (optional) >> "%LOG_FILE%"
) else (
    for /f "tokens=*" %%a in ('git --version 2^>nul') do set "GIT_VER=%%a"
    echo [OK] !GIT_VER!
    echo Git installed: !GIT_VER! >> "%LOG_FILE%"
)

:: ============================================
:: STEP 2: Validate Application
:: ============================================
echo.
echo [STEP 2/4] Validating Application Files
echo --------------------------------------------
echo [%date% %time%] Validating application >> "%LOG_FILE%"

if not exist "%PORTAL_DIR%" (
    echo [X] admin-portal directory not found
    echo Expected location: %PORTAL_DIR%
    echo.
    echo Please ensure admin-portal folder is in the same directory as this launcher
    echo admin-portal directory not found >> "%LOG_FILE%"
    set /a ERROR_COUNT+=1
    goto :Cleanup
)
echo [OK] admin-portal directory found

cd /d "%PORTAL_DIR%" 2>nul
if !ERRORLEVEL! NEQ 0 (
    echo [X] Cannot access admin-portal directory
    set /a ERROR_COUNT+=1
    goto :Cleanup
)

if not exist "package.json" (
    echo [X] package.json not found
    set /a ERROR_COUNT+=1
    goto :Cleanup
)
echo [OK] package.json found

if not exist "main.js" (
    echo [X] main.js not found
    set /a ERROR_COUNT+=1
    goto :Cleanup
)
echo [OK] main.js found

if not exist "admin" (
    echo [X] admin directory not found
    set /a ERROR_COUNT+=1
    goto :Cleanup
)
echo [OK] admin directory found

if not exist "admin\index.html" (
    echo [X] admin\index.html not found
    set /a ERROR_COUNT+=1
    goto :Cleanup
)
echo [OK] admin\index.html found

:: ============================================
:: STEP 3: Install Dependencies
:: ============================================
echo.
echo [STEP 3/4] Managing Dependencies
echo --------------------------------------------
echo [%date% %time%] Installing dependencies >> "%LOG_FILE%"

if exist "node_modules\electron" (
    echo [OK] Dependencies already installed
    echo Dependencies cache found >> "%LOG_FILE%"
    goto :LaunchApp
)

echo [*] Installing npm packages...
echo [*] This may take 5-10 minutes depending on your internet speed
echo [*] Please wait, do not close this window...
echo.

call npm install --loglevel=error

if !ERRORLEVEL! NEQ 0 (
    echo.
    echo [X] Failed to install dependencies
    echo.
    echo Troubleshooting:
    echo 1. Check your internet connection
    echo 2. Run as Administrator
    echo 3. Temporarily disable antivirus
    echo 4. Try manually: cd "%PORTAL_DIR%" and run: npm install
    echo Dependency installation failed >> "%LOG_FILE%"
    set /a ERROR_COUNT+=1
    goto :Cleanup
)

echo [OK] Dependencies installed successfully
echo Dependencies installation completed >> "%LOG_FILE%"

call npm rebuild >nul 2>&1
echo [OK] Native modules rebuilt

:: ============================================
:: STEP 4: Launch Application
:: ============================================
:LaunchApp
echo.
echo [STEP 4/4] Launching Application
echo --------------------------------------------
echo [%date% %time%] Launching application >> "%LOG_FILE%"
echo.
echo [*] Starting AA Admin Portal...
echo.
echo ============================================
echo   PORTAL IS STARTING...
echo   Close the portal window to exit
echo ============================================
echo.

call npm start

set "APP_EXIT_CODE=!ERRORLEVEL!"

if !APP_EXIT_CODE! NEQ 0 (
    echo.
    echo [X] Application exited with error code !APP_EXIT_CODE!
    echo Application error code: !APP_EXIT_CODE! >> "%LOG_FILE%"
) else (
    echo.
    echo [*] Portal closed normally
    echo Portal closed normally >> "%LOG_FILE%"
)

goto :Cleanup

:: ============================================
:: FUNCTION: Check and Install Node
:: ============================================
:CheckAndInstallNode

:: Check if node exists
where node >nul 2>&1
set "NODE_EXISTS=%ERRORLEVEL%"

if %NODE_EXISTS% NEQ 0 (
    echo [X] Node.js not installed
    echo Node.js not found >> "%LOG_FILE%"
    call :InstallNodeJS
    exit /b !ERRORLEVEL!
)

:: Node exists, check version
for /f "tokens=*" %%a in ('node --version 2^>nul') do set "NODE_VER=%%a"
if "%NODE_VER%"=="" (
    echo [X] Cannot get Node.js version
    echo Cannot get Node.js version >> "%LOG_FILE%"
    exit /b 1
)

:: Remove the 'v' prefix
set "NODE_VER=%NODE_VER:v=%"

:: Extract major version
for /f "tokens=1 delims=." %%a in ("%NODE_VER%") do set "NODE_MAJOR=%%a"

:: Remove any spaces
set "NODE_MAJOR=%NODE_MAJOR: =%"

if "%NODE_MAJOR%"=="" (
    echo [X] Cannot parse Node.js version
    echo Cannot parse Node.js version >> "%LOG_FILE%"
    exit /b 1
)

echo Node version detected: v%NODE_VER% (major: %NODE_MAJOR%)

:: Simple direct comparison
echo Checking if %NODE_MAJOR% LSS %MIN_NODE_MAJOR%

if %NODE_MAJOR% LSS %MIN_NODE_MAJOR% (
    echo Version too old, need to install
    echo [X] Node.js v%NODE_VER% is too old
    call :InstallNodeJS
    exit /b !ERRORLEVEL!
)

echo Version is fine, skipping install
echo [OK] Node.js v%NODE_VER% is acceptable
echo Node.js verified >> "%LOG_FILE%"
exit /b 0

:: ============================================
:: FUNCTION: Install Node.js
:: ============================================
:InstallNodeJS
echo.
echo [*] Installing Node.js v%NODE_VERSION%...
echo Installing Node.js v%NODE_VERSION% >> "%LOG_FILE%"

set "INSTALLER_PATH=%TEMP%\node-installer.msi"

echo [*] Downloading installer...
echo     URL: %NODE_INSTALLER_URL%
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;" ^
    "$ProgressPreference = 'SilentlyContinue';" ^
    "try {" ^
    "    Invoke-WebRequest -Uri '%NODE_INSTALLER_URL%' -OutFile '%INSTALLER_PATH%' -UseBasicParsing -TimeoutSec 300;" ^
    "    exit 0;" ^
    "} catch {" ^
    "    Write-Host 'Download failed: ' $_.Exception.Message;" ^
    "    exit 1;" ^
    "}"

if %ERRORLEVEL% NEQ 0 (
    echo [X] Failed to download Node.js installer
    echo Download failed >> "%LOG_FILE%"
    echo.
    echo Alternative: Download manually from https://nodejs.org/
    exit /b 1
)

echo [OK] Download complete
echo.

echo [*] Installing Node.js (this may take 3-5 minutes)...
echo     Please wait, do not close this window...
echo.
echo [*] Note: You may see a User Account Control (UAC) prompt
echo [*] Click "Yes" to allow the installation
echo.

start /wait msiexec /i "%INSTALLER_PATH%" /qn /norestart ADDLOCAL=ALL

if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js installation failed (Error Code: %ERRORLEVEL%)
    echo Installation failed with code %ERRORLEVEL% >> "%LOG_FILE%"
    echo.
    echo Common solutions for error 1603:
    echo 1. Close all Node.js and terminal windows
    echo 2. Right-click this launcher and select "Run as Administrator"
    echo 3. Manually uninstall existing Node.js first from Control Panel
    echo 4. Reboot your computer and try again
    echo.
    del "%INSTALLER_PATH%" >nul 2>&1
    exit /b 1
)

del "%INSTALLER_PATH%" >nul 2>&1

:: Refresh PATH
for /f "skip=2 tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "SYS_PATH=%%b"
for /f "skip=2 tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USR_PATH=%%b"
set "PATH=%SYS_PATH%;%USR_PATH%;%ProgramFiles%\nodejs"

echo [*] Verifying installation...
timeout /t 3 /nobreak >nul

where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js installation verification failed
    echo Installation verification failed >> "%LOG_FILE%"
    exit /b 1
)

for /f "tokens=*" %%a in ('node --version 2^>nul') do set "NODE_VER=%%a"
echo [OK] Node.js !NODE_VER! installed successfully
echo Node.js installation completed >> "%LOG_FILE%"
echo.
exit /b 0

:: ============================================
:: FUNCTION: Cleanup
:: ============================================
:Cleanup
echo.
echo [%date% %time%] Launcher completed >> "%LOG_FILE%"

if %ERROR_COUNT% GTR 0 (
    echo.
    echo [ERROR] Setup completed with %ERROR_COUNT% error(s)
    echo Check log file: %LOG_FILE%
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
) else (
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 0
)

endlocal