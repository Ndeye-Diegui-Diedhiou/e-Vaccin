@echo off
setlocal enabledelayedexpansion
set JAVA_HOME=C:\Users\DELL\.sdkman\candidates\java\17.0.10-tem
cd /d c:\Users\DELL\OneDrive\Bureau\LICENCE2\Semestre2\TCPL\e-vaccin
echo Running: mvnw.cmd clean test -q
call mvnw.cmd clean test -q
echo Test execution completed with exit code: %ERRORLEVEL%
if %ERRORLEVEL% equ 0 (
    echo Tests PASSED
) else (
    echo Tests FAILED with code %ERRORLEVEL%
)
