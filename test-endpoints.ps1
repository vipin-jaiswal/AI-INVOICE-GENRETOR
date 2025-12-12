# Test Invoice Generation Endpoints
# First, get a valid JWT token by logging in

$loginUrl = "http://localhost:8000/api/auth/login"
$loginData = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

# Try to login
try {
    $loginResponse = Invoke-WebRequest -Uri $loginUrl -Method Post -ContentType "application/json" -Body $loginData -ErrorAction SilentlyContinue
    $loginBody = $loginResponse.Content | ConvertFrom-Json
    $token = $loginBody.token
    Write-Host "Login successful! Token: $($token.Substring(0, 20))..."
} catch {
    Write-Host "Login failed. Please create a test account first or use an existing token."
    exit
}

# Test Generate from Text endpoint
$headers = @{"Authorization" = "Bearer $token"}
$textUrl = "http://localhost:8000/api/ai/parse-invoice-text"
$textData = @{
    text = "Invoice for ABC Corp: 5 hours of web development at $150/hour, 2 hours of design at $120/hour"
} | ConvertTo-Json

Write-Host "`n--- Testing Generate from Text ---"
try {
    $response = Invoke-WebRequest -Uri $textUrl -Method Post -Headers $headers -ContentType "application/json" -Body $textData -ErrorAction SilentlyContinue
    $body = $response.Content | ConvertFrom-Json
    Write-Host "✓ Text parsing successful! Invoice ID: $($body.invoiceId)"
} catch {
    Write-Host "✗ Text parsing failed: $($_.Exception.Message)"
}

# Test Generate from Model endpoint
$modelUrl = "http://localhost:8000/api/ai/generate-from-model"
$modelData = @{
    clientName = "Demo Client"
    clientEmail = "demo@example.com"
    numItems = 5
} | ConvertTo-Json

Write-Host "`n--- Testing Generate from Model ---"
try {
    $response = Invoke-WebRequest -Uri $modelUrl -Method Post -Headers $headers -ContentType "application/json" -Body $modelData -ErrorAction SilentlyContinue
    $body = $response.Content | ConvertFrom-Json
    Write-Host "✓ Model generation successful! Invoice ID: $($body.invoiceId)"
} catch {
    Write-Host "✗ Model generation failed: $($_.Exception.Message)"
}

Write-Host "`n--- Test Complete ---"
