# SMS Integration Test Suite - e-Vaccin (PowerShell)
# Usage: .\sms-test.ps1 -Provider "mock" -Verbose

param(
    [string]$Provider = "mock",
    [switch]$Verbose = $false,
    [string]$BaseUrl = "http://localhost:8080"
)

# Color codes
$Colors = @{
    Info = "Cyan"
    Success = "Green"
    Error = "Red"
    Warning = "Yellow"
    Header = "Magenta"
}

$TestStats = @{
    Passed = 0
    Failed = 0
}

###############################################################################
# Helper Functions
###############################################################################

function Write-TestInfo {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Info
}

function Write-TestSuccess {
    param([string]$Message)
    Write-Host "[PASS] $Message" -ForegroundColor $Colors.Success
    $TestStats.Passed++
}

function Write-TestError {
    param([string]$Message)
    Write-Host "[FAIL] $Message" -ForegroundColor $Colors.Error
    $TestStats.Failed++
}

function Write-TestWarning {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor $Colors.Warning
}

function Write-Header {
    param([string]$Title)
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor $Colors.Header
    Write-Host "  $Title" -ForegroundColor $Colors.Header
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor $Colors.Header
    Write-Host ""
}

function Invoke-ApiCall {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Data,
        [string]$Description
    )
    
    Write-TestInfo "Testing: $Description"
    Write-TestInfo "  Method: $Method $Endpoint"
    
    try {
        $url = "$BaseUrl$Endpoint"
        $headers = @{
            "Content-Type" = "application/json"
            "X-User-Id" = "1"
        }
        
        if ($Method -eq "POST" -and $Data) {
            Write-TestInfo "  Data: $Data"
            $response = Invoke-WebRequest -Uri $url -Method $Method -Headers $headers -Body $Data -UseBasicParsing
        } else {
            $response = Invoke-WebRequest -Uri $url -Method $Method -Headers $headers -UseBasicParsing
        }
        
        $httpCode = $response.StatusCode
        $body = $response.Content
        
        if ($httpCode -ge 200 -and $httpCode -lt 300) {
            Write-TestSuccess "Response HTTP $httpCode"
            if ($Verbose) {
                $bodyPreview = if ($body.Length -gt 200) { $body.Substring(0, 200) + "..." } else { $body }
                Write-Host "  Response: $bodyPreview" -ForegroundColor Gray
            }
            return $body
        } else {
            Write-TestError "Response HTTP $httpCode"
            Write-TestError "  Response: $body"
            return ""
        }
    }
    catch {
        Write-TestError "Exception: $($_.Exception.Message)"
        return ""
    }
}

###############################################################################
# Main Test Suite
###############################################################################

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║     SMS Integration Test Suite - e-Vaccin (PowerShell)        ║" -ForegroundColor Magenta
Write-Host "║     Provider: $Provider                                               ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# Test 1: API Health Check
Write-Header "TEST GROUP 1: API Health & Configuration"

Write-TestInfo "Checking API health..."
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/notifications/stats" -Method GET -UseBasicParsing
    $httpCode = $response.StatusCode
    
    if ($httpCode -eq 200) {
        Write-TestSuccess "API is running and responding (HTTP $httpCode)"
    } else {
        Write-TestError "API returned HTTP $httpCode. Is backend running on port 8080?"
        exit 1
    }
}
catch {
    Write-TestError "Cannot connect to API: $($_.Exception.Message)"
    Write-TestError "Make sure backend is running on port 8080"
    exit 1
}
Write-Host ""

# Test 2: Get Initial Statistics
Write-Header "TEST GROUP 2: Statistics & Monitoring"

Invoke-ApiCall -Method "GET" -Endpoint "/api/notifications/stats" `
    -Description "Get initial statistics" | Out-Null
Write-Host ""

# Test 3: Send Custom SMS
Write-Header "TEST GROUP 3: Custom SMS Sending"

$customSmsData = @{
    patientId = 1
    phoneNumber = "+221761234567"
    recipientName = "Test User"
    message = "Test SMS - Bienvenue sur e-Vaccin"
    templateType = "CUSTOM"
} | ConvertTo-Json

$customResponse = Invoke-ApiCall -Method "POST" -Endpoint "/api/notifications/send-sms" `
    -Data $customSmsData -Description "Send custom SMS"
Write-Host ""

# Extract notification ID
$notificationId = $null
if ($customResponse) {
    $parsed = $customResponse | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($parsed.data.id) {
        $notificationId = $parsed.data.id
    }
}

# Test 4: Vaccination Templates
Write-Header "TEST GROUP 4: Vaccination Templates"

$vaccinationConfirmData = @{
    patientId = 123
    patientName = "Moussa Konaté"
    guardianPhone = "+221761234567"
    guardianName = "Fatou Diallo"
    vaccineName = "BCG"
} | ConvertTo-Json

Invoke-ApiCall -Method "POST" -Endpoint "/api/notifications/vaccination-confirmation" `
    -Data $vaccinationConfirmData -Description "Send vaccination confirmation" | Out-Null
Write-Host ""

$alertData = @{
    patientId = 456
    patientName = "Awa Seck"
    guardianPhone = "+221765432109"
    guardianName = "Aminata Ndiaye"
    reason = "Outbreak detected - polio vaccination urgently needed"
} | ConvertTo-Json

Invoke-ApiCall -Method "POST" -Endpoint "/api/notifications/alert" `
    -Data $alertData -Description "Send urgent vaccination alert" | Out-Null
Write-Host ""

$appointmentTime = (Get-Date).AddHours(25).ToString("yyyy-MM-ddTHH:mm:ss")
$reminderData = @{
    patientId = 789
    patientName = "Demba Ba"
    guardianPhone = "+221769876543"
    guardianName = "Khadija Ba"
    vaccineName = "Polio 1"
    appointmentTime = $appointmentTime
    appointmentLocation = "Clinique Dia Dakar"
} | ConvertTo-Json

Invoke-ApiCall -Method "POST" -Endpoint "/api/notifications/vaccination-reminder" `
    -Data $reminderData -Description "Schedule vaccination reminder" | Out-Null
Write-Host ""

# Test 5: Retrieve Notifications
Write-Header "TEST GROUP 5: Retrieve Notifications"

Invoke-ApiCall -Method "GET" -Endpoint "/api/notifications/patient/1" `
    -Description "Get notifications for patient 1" | Out-Null
Write-Host ""

Invoke-ApiCall -Method "GET" -Endpoint "/api/notifications/patient/123" `
    -Description "Get notifications for patient 123" | Out-Null
Write-Host ""

if ($notificationId) {
    Invoke-ApiCall -Method "GET" -Endpoint "/api/notifications/$notificationId" `
        -Description "Get specific notification #$notificationId" | Out-Null
    Write-Host ""
}

# Test 6: Final Statistics
Write-Header "TEST GROUP 6: Final Verification"

Invoke-ApiCall -Method "GET" -Endpoint "/api/notifications/stats" `
    -Description "Get final statistics" | Out-Null
Write-Host ""

# Test 7: Performance Check
Write-Header "TEST GROUP 7: Performance Check (Non-blocking)"

Write-TestInfo "Sending 5 SMS rapidly to verify async processing..."
$startTime = Get-Date

for ($i = 1; $i -le 5; $i++) {
    $data = @{
        patientId = $i + 1000
        phoneNumber = "+221761234567"
        recipientName = "Guardian $i"
        message = "Batch test SMS #$i"
        templateType = "CUSTOM"
    } | ConvertTo-Json
    
    try {
        $null = Invoke-WebRequest -Uri "$BaseUrl/api/notifications/send-sms" -Method POST `
            -Headers @{"Content-Type" = "application/json"; "X-User-Id" = "1"} `
            -Body $data -UseBasicParsing -TimeoutSec 5
    }
    catch { }
}

$endTime = Get-Date
$elapsed = ($endTime - $startTime).TotalMilliseconds

if ($elapsed -lt 2000) {
    Write-TestSuccess "5 SMS sent in $([math]::Round($elapsed))ms (async processing confirmed)"
} else {
    Write-TestWarning "5 SMS took $([math]::Round($elapsed))ms (may indicate blocking behavior)"
}
Write-Host ""

###############################################################################
# Summary
###############################################################################

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║                        TEST SUMMARY                           ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

$total = $TestStats.Passed + $TestStats.Failed
Write-Host "Total Tests: $total"
Write-Host "Passed: $($TestStats.Passed)" -ForegroundColor Green
Write-Host "Failed: $($TestStats.Failed)" -ForegroundColor Red
Write-Host ""

if ($TestStats.Failed -eq 0) {
    Write-Host "✓ All tests passed! SMS integration is working correctly." -ForegroundColor Green
    exit 0
} else {
    Write-Host "✗ Some tests failed. Check the output above for details." -ForegroundColor Red
    exit 1
}
