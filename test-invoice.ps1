#!/usr/bin/env pwsh
<#
.SYNOPSIS
Test Invoice Generation System
.DESCRIPTION
Complete diagnostic test for the invoice generation feature
#>

param(
    [string]$Token = ""
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Invoice Generation System Diagnostics" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test 1: Backend Connectivity
Write-Host "`n[TEST 1] Backend Connectivity" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/invoices" `
        -Headers @{"Authorization"="Bearer test"} `
        -Method Get `
        -ErrorAction SilentlyContinue
    Write-Host "✓ Backend is reachable" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend is NOT reachable on port 8000" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Frontend Connectivity
Write-Host "`n[TEST 2] Frontend Connectivity" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173/" `
        -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Frontend is running on port 5173" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Frontend is NOT reachable on port 5173" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Database Connection
Write-Host "`n[TEST 3] MongoDB Connection" -ForegroundColor Yellow
Write-Host "Note: Check backend logs for MongoDB connection status" -ForegroundColor Gray

# Test 4: Authentication
Write-Host "`n[TEST 4] Authentication" -ForegroundColor Yellow
if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "Warning: No token provided. Attempting test login..." -ForegroundColor Yellow
    try {
        $loginBody = @{
            email = "test@example.com"
            password = "password123"
        } | ConvertTo-Json
        
        $loginResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/auth/login" `
            -Method Post `
            -ContentType "application/json" `
            -Body $loginBody `
            -ErrorAction SilentlyContinue
        
        $loginData = $loginResponse.Content | ConvertFrom-Json
        if ($loginData.token) {
            $Token = $loginData.token
            Write-Host "OK: Login successful, using token: $($Token.Substring(0,20))..." -ForegroundColor Green
        } else {
            Write-Host "FAIL: Login failed - token not returned" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "FAIL: Login failed - invalid credentials or user does not exist" -ForegroundColor Red
        Write-Host "  Please create a test account and run: .\test-invoice.ps1 -Token YOUR_TOKEN" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "OK: Using provided token: $($Token.Substring(0,20))..." -ForegroundColor Green
}

# Test 5: Generate from Model
Write-Host "`n[TEST 5] Generate Invoice from Model" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        clientName = "Test Client Ltd"
        clientEmail = "test@client.com"
        numItems = 3
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/ai/generate-from-model" `
        -Headers $headers `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction SilentlyContinue
    
    $data = $response.Content | ConvertFrom-Json
    if ($data.invoiceId) {
        Write-Host "✓ Invoice generated successfully!" -ForegroundColor Green
        Write-Host "  Invoice ID: $($data.invoiceId)" -ForegroundColor Green
    } else {
        Write-Host "⚠ Response received but no invoiceId" -ForegroundColor Yellow
        Write-Host "  Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Generate from Model failed" -ForegroundColor Red
    Write-Host "  Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    try {
        $errorBody = $_.Exception.Response.Content.ToString() | ConvertFrom-Json
        Write-Host "  Error: $($errorBody.message)" -ForegroundColor Red
        Write-Host "  Details: $($errorBody.details)" -ForegroundColor Red
    } catch {
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 6: Parse from Text
Write-Host "`n[TEST 6] Parse Invoice from Text (Gemini AI)" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        text = "Invoice for Demo Corp: 5 hours of web development at $150 per hour, 2 hours of UI design at $120 per hour, 10% tax"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/ai/parse-invoice-text" `
        -Headers $headers `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction SilentlyContinue
    
    $data = $response.Content | ConvertFrom-Json
    if ($data.invoiceId) {
        Write-Host "✓ Invoice parsed successfully!" -ForegroundColor Green
        Write-Host "  Invoice ID: $($data.invoiceId)" -ForegroundColor Green
    } else {
        Write-Host "⚠ Response received but no invoiceId" -ForegroundColor Yellow
        Write-Host "  Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Parse from Text failed" -ForegroundColor Red
    Write-Host "  Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    try {
        $errorBody = $_.Exception.Response.Content.ToString() | ConvertFrom-Json
        Write-Host "  Error: $($errorBody.message)" -ForegroundColor Red
        Write-Host "  Details: $($errorBody.details)" -ForegroundColor Red
    } catch {
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Diagnostic Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nIf all tests passed, your system is working correctly!" -ForegroundColor Green
Write-Host "`nIf a test failed:" -ForegroundColor Yellow
Write-Host "1. Check the error message above" -ForegroundColor Yellow
Write-Host "2. Review DEBUGGING_INVOICE_GENERATION.md for solutions" -ForegroundColor Yellow
Write-Host "3. Check backend logs for more details" -ForegroundColor Yellow
