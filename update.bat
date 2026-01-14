@echo off
git add .
:: 這一行會停下來問你更新說明
set /p msg="Enter update details (e.g., modified data.json): "
:: 使用你輸入的文字作為上傳說明
git commit -m "%msg%"
git push
echo ===============================
echo   SUCCESS: Webpage Updated!
echo ===============================
pause