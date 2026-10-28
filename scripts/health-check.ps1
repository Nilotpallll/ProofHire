# ProofHire — Multi-Service Health & Diagnostic Check (PowerShell)
# Pings all 4 microservices and reports operational readiness.

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "       PROOFHIRE MICROSERVICES HEALTH DIAGNOSTIC        " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

$services = @(
    @{
        Name = "Hardhat Local EVM Node"
        Port = 8545
        Url = "http://127.0.0.1:8545"
        Type = "RPC"
    },
    @{
        Name = "FastAPI AI Intelligence Service"
        Port = 8000
        Url = "http://localhost:8000/health"
        Type = "HTTP"
    },
    @{
        Name = "NestJS REST Core API"
        Port = 4000
        Url = "http://localhost:4000/api/health"
        Type = "HTTP"
    },
    @{
        Name = "Next.js Web Frontend"
        Port = 3000
        Url = "http://localhost:3000"
        Type = "HTTP"
    }
)

$allHealthy = $true

foreach ($svc in $services) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $statusText = "OFFLINE"
    $statusCode = 0
    $extraDetails = ""

    try {
        if ($svc.Type -eq "RPC") {
            $body = '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
            $response = Invoke-RestMethod -Uri $svc.Url -Method Post -Body $body -ContentType "application/json" -TimeoutSec 3 -ErrorAction Stop
            $sw.Stop()
            if ($response.result) {
                $statusText = "ONLINE"
                $statusCode = 200
                $blockNum = [Convert]::ToInt64($response.result, 16)
                $extraDetails = "(Block: #$blockNum)"
            }
        } else {
            $response = Invoke-WebRequest -UseBasicParsing -Uri $svc.Url -Method Get -TimeoutSec 4 -ErrorAction Stop
            $sw.Stop()
            $statusCode = $response.StatusCode
            if ($statusCode -ge 200 -and $statusCode -lt 400) {
                $statusText = "ONLINE"
            }
        }
    } catch {
        $sw.Stop()
        $statusText = "FAILED"
        $statusCode = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
        $extraDetails = "($($_.Exception.Message.Split([char]10)[0]))"
        $allHealthy = $false
    }

    $color = if ($statusText -eq "ONLINE") { "Green" } else { "Red" }
    $timeMs = "$($sw.ElapsedMilliseconds)ms"
    
    $line = "[{0,-7}] {1,-34} Port {2,-5} {3,7} {4}" -f $statusText, $svc.Name, $svc.Port, $timeMs, $extraDetails
    Write-Host $line -ForegroundColor $color
}

Write-Host ""
Write-Host "-------------------------------------------------------" -ForegroundColor Gray
if ($allHealthy) {
    Write-Host "[OK] ALL PROOFHIRE SERVICES OPERATIONAL AND HEALTHY" -ForegroundColor Green
} else {
    Write-Host "[WARN] SOME SERVICES ARE OFFLINE OR UNREACHABLE" -ForegroundColor Yellow
    Write-Host "Run .\scripts\start-all.ps1 or inspect individual service logs." -ForegroundColor Gray
}
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
