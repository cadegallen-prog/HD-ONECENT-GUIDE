@echo off
cd /d "C:\Users\cadeg\Projects\HD-ONECENT-GUIDE"

echo [%date% %time%] Starting staging warmer >> ".local\staging-warmer-scheduled.log"
call npm run warm:staging >> ".local\staging-warmer-scheduled.log" 2>&1
set EXIT_CODE=%ERRORLEVEL%
echo [%date% %time%] Finished (exit code %EXIT_CODE%) >> ".local\staging-warmer-scheduled.log"

if %EXIT_CODE% NEQ 0 (
    echo [%date% %time%] FAILURE DETECTED - sending notification >> ".local\staging-warmer-scheduled.log"
    powershell -ExecutionPolicy Bypass -File "C:\Users\cadeg\Projects\HD-ONECENT-GUIDE\scripts\notify-warmer-failure.ps1"
)
