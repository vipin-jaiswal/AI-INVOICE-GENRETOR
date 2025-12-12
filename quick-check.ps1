Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Invoice Generation System Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test 1: Backend
Write-Host "`n[1] Testing Backend (port 8000)..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://localhost:8000/api/invoices" `
        -Headers @{"Authorization"="Bearer test"} `
        -Method Get -ErrorAction SilentlyContinue | Out-Null
    Write-Host "PASS: Backend is running" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Backend not responding" -ForegroundColor Red
    exit 1
}

# Test 2: Frontend
Write-Host "`n[2] Testing Frontend (port 5173)..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://localhost:5173/" `
        -ErrorAction SilentlyContinue | Out-Null
    Write-Host "PASS: Frontend is running" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Frontend not responding" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "2. Login with your credentials" -ForegroundColor White
Write-Host "3. Click 'Generate with AI' button" -ForegroundColor White
Write-Host "4. Try either tab (Parse Text or Generate Model)" -ForegroundColor White
Write-Host "5. Check browser console (F12) for error details" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
