@echo off
setlocal enabledelayedexpansion
set JAVA_HOME=C:\Users\DELL\.sdkman\candidates\java\17.0.10-tem
echo JAVA_HOME is set to: !JAVA_HOME!
echo Testing Java version:
"!JAVA_HOME!\bin\java.exe" -version
cd /d c:\Users\DELL\OneDrive\Bureau\LICENCE2\Semestre2\TCPL\e-vaccin
echo Running: mvnw.cmd clean test-compile -q
call mvnw.cmd clean test-compile -q
echo Compilation completed with exit code: %ERRORLEVEL%
