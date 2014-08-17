@echo off
For /f "tokens=1-4 delims=/ " %%a in ('date /t') do (set mydate=%%a%%b%%c)
For /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set _my_datetime=#%mydate%%mytime%
git add --all
git commit -m "%_my_datetime%"
git push origin master

PAUSE