# PowerShell script to test authentication endpoint

$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmI5MTY2NTk0ZGUwMmE5YzcwZGIzMiIsImlhdCI6MTc0NzY5MDI0M30.JNVjQySt6dmq0VdFRuFgfYPOWJPaUCsZY5o9zTxnSTA"
$url = "http://localhost:5000/api/debug/auth-test"

# Create headers object
$headers = @{
    "Authorization" = "Bearer $token"
}

# Make the request
try {
    Write-Host "Testing authentication with token..."
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
    Write-Host "Authentication successful!" -ForegroundColor Green
    Write-Host "Response:"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Authentication failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)"
    }
}
