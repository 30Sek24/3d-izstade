@echo off
echo ===============================
echo WARPALA CITY ENGINE PERSISTENT START
echo ===============================

set UE=D:\UE_5.7
set PROJECT=C:\3d\WarpalaUE5\WarpalaUE5.uproject
set UBT="%UE%\Engine\Binaries\DotNET\UnrealBuildTool\UnrealBuildTool.exe"

echo [CHECK] Engine: %UE%
echo [CHECK] Project: %PROJECT%

echo.
echo STEP 1 - Generate project files...
%UBT% -projectfiles -project="%PROJECT%" -game -rocket -progress
if %ERRORLEVEL% NEQ 0 (
    echo KLUDA: Neizdevas uzgeneret projektus.
    pause
    exit /b %ERRORLEVEL%
)
echo [OK] Project files generated.
pause

echo.
echo STEP 2 - Build project (See build_log.txt for details)...
call "%UE%\Engine\Build\BatchFiles\Build.bat" WarpalaUE5Editor Win64 Development -Project="%PROJECT%" -WaitMutex > build_log.txt 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo KLUDA: Kompilacija neizdevas. Parbaudi build_log.txt!
    pause
    exit /b %ERRORLEVEL%
)
echo [OK] Build successful.
pause

echo.
echo STEP 3 - Launch Unreal Editor...
echo Starting Editor...
"%UE%\Engine\Binaries\Win64\UnrealEditor.exe" "%PROJECT%" -log
if %ERRORLEVEL% NEQ 0 (
    echo KLUDA: Editoru neizdevas palaist.
)

echo.
echo Skripta darbiba beigusies.
pause
