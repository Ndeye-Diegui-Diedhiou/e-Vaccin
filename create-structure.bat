@echo off
REM Create e-Vaccin Project Directory Structure
REM Run this from the root e-vaccin directory

setlocal enabledelayedexpansion

set "BASE_DIR=%cd%"
echo Creating e-Vaccin Project Structure...
echo.

REM Create Frontend structure
echo Creating frontend structure...
mkdir frontend\src\components
mkdir frontend\src\pages
mkdir frontend\src\hooks
mkdir frontend\src\utils
mkdir frontend\src\config
mkdir frontend\src\assets
mkdir frontend\public
echo ✓ Frontend structure created

REM Create Documentation structure
echo Creating documentation structure...
mkdir docs\OVERVIEW
mkdir docs\GUIDES
mkdir docs\SMS_Module
mkdir docs\SMS_Testing
mkdir docs\REFERENCE
mkdir docs\CHANGELOG
echo ✓ Documentation structure created

REM Create Scripts structure
echo Creating scripts structure...
mkdir scripts\test
mkdir scripts\deployment
mkdir scripts\setup
echo ✓ Scripts structure created

REM Create Database structure
echo Creating database structure...
mkdir database\migrations
mkdir database\seeds
echo ✓ Database structure created

REM Create Docker structure
echo Creating docker structure...
mkdir docker
echo ✓ Docker structure created

REM Create Config structure
echo Creating config structure...
mkdir config
echo ✓ Config structure created

REM Create GitHub workflows structure
echo Creating GitHub workflows structure...
mkdir .github\workflows
echo ✓ GitHub structure created

echo.
echo ✅ All directories created successfully!
echo.
echo Next steps:
echo 1. Review the new structure
echo 2. Move files to appropriate locations
echo 3. Update configuration paths
echo 4. Test the project
