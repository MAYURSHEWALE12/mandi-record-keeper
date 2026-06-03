@echo off
echo ========================================
echo  Trambkaraj Traders - PHP Backend Setup
echo ========================================
echo.

REM Check PHP
where php >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PHP is not installed. Install PHP 8.2+ first.
    echo https://windows.php.net/download/
    pause
    exit /b 1
)

REM Check Composer
where composer >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Composer is not installed.
    echo https://getcomposer.org/download/
    pause
    exit /b 1
)

echo [1/5] Installing Composer dependencies...
call composer install
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b 1
)

echo.
echo [2/5] Creating MySQL database...
echo Make sure MySQL is running. Enter root password when prompted.
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS mandi_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Could not create database automatically.
    echo        Please create it manually: CREATE DATABASE mandi_app;
)

echo.
echo [3/5] Running migrations...
php database/migrate.php
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b 1
)

echo.
echo [4/5] Seeding admin user...
php database/seed.php
if %ERRORLEVEL% NEQ 0 (
    pause
    exit /b 1
)

echo.
echo [5/5] Setup complete!
echo.
echo ========================================
echo  To start the server:
echo     php -S localhost:8000 -t public
echo.
echo  Or use:
echo     composer start
echo ========================================
echo.
echo  Admin login: admin@example.com / admin123
echo.
pause
