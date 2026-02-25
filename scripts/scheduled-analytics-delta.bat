@echo off
cd /d "C:\Users\cadeg\Projects\HD-ONECENT-GUIDE"
echo [%date% %time%] Starting analytics delta >> ".local\analytics-history\scheduled-run.log"
call npm run analytics:delta >> ".local\analytics-history\scheduled-run.log" 2>&1
echo [%date% %time%] Finished (exit code %ERRORLEVEL%) >> ".local\analytics-history\scheduled-run.log"
