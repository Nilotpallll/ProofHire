# ProofHire — Safe Demonstration Data Reset Utility (PowerShell)
# Resets demonstration personas, sample jobs, and smart contract state
# WITHOUT dropping database tables or deleting non-demo developer records.

[CmdletBinding()]
param(
    [switch]$ResetBlockchain = $false,
    [switch]$RestartServices = $false
)

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "       PROOFHIRE SAFE DEMO DATA RESET UTILITY           " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = Resolve-Path "$PSScriptRoot\.."

# 1. Reset Local Blockchain State (if requested or Hardhat is active)
if ($ResetBlockchain) {
    Write-Host "[1/3] Resetting Local Blockchain State..." -ForegroundColor Yellow
    $rpcRunning = Get-NetTCPConnection -LocalPort 8545 -State Listen -ErrorAction SilentlyContinue
    if ($rpcRunning) {
        Write-Host "  -> Redeploying CredentialRegistry to local Hardhat node..." -ForegroundColor Gray
        Push-Location "$rootPath\blockchain"
        try {
            npx hardhat run scripts/deploy.ts --network localhost
            Write-Host "  -> Smart contract redeployed and fresh ABI synchronized." -ForegroundColor Green
        } catch {
            Write-Host "  [WARN] Blockchain redeploy note: $_" -ForegroundColor Yellow
        }
        Pop-Location
    } else {
        Write-Host "  -> Hardhat node is not running on port 8545. Skipping on-chain redeploy." -ForegroundColor Gray
    }
} else {
    Write-Host "[1/3] Blockchain state preserved (use -ResetBlockchain to re-anchor contract)." -ForegroundColor Gray
}

# 2. Reset Database Seed Records (Safe Non-Destructive Refresh)
Write-Host "[2/3] Checking Database Persistence Layer..." -ForegroundColor Yellow
$pgTest = Test-NetConnection -ComputerName "localhost" -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($pgTest) {
    Write-Host "  -> PostgreSQL active on port 5432. Executing safe seed upsert..." -ForegroundColor Green
    Push-Location $rootPath
    try {
        npm run seed:db
        Write-Host "  -> Fictional demonstration accounts and records refreshed safely." -ForegroundColor Green
    } catch {
        Write-Host "  [WARN] Database seed note: $_" -ForegroundColor Yellow
    }
    Pop-Location
} else {
    Write-Host "  -> PostgreSQL not active on port 5432." -ForegroundColor Gray
    Write-Host "  -> ProofHire is running in Resilient In-Memory Mode." -ForegroundColor Cyan
    Write-Host "  -> In-memory demo stores are automatically reset whenever services restart." -ForegroundColor Gray
}

# 3. Optional Service Restart
if ($RestartServices) {
    Write-Host "[3/3] Restarting microservices..." -ForegroundColor Yellow
    Push-Location $rootPath
    powershell -ExecutionPolicy Bypass -File scripts\stop-all.ps1
    Start-Sleep -Seconds 2
    powershell -ExecutionPolicy Bypass -File scripts\start-all.ps1
    Pop-Location
} else {
    Write-Host "[3/3] Microservices are running. Checking live health..." -ForegroundColor Yellow
    Push-Location $rootPath
    powershell -ExecutionPolicy Bypass -File scripts\health-check.ps1
    Pop-Location
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "       DEMONSTRATION ENVIRONMENT READY FOR REVIEW       " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Fictional Demo Accounts Available at http://localhost:3000/login :" -ForegroundColor White
Write-Host "  - Student:     student@proofhire.io     (Alex Rivera)" -ForegroundColor Cyan
Write-Host "  - Recruiter:   recruiter@proofhire.io   (Sarah Chen, Aether Labs)" -ForegroundColor Cyan
Write-Host "  - Institution: institution@proofhire.io (Dr. Marcus Vance, Stanford)" -ForegroundColor Cyan
Write-Host "  - SuperAdmin:  admin@proofhire.io       (Platform Admin)" -ForegroundColor Cyan
Write-Host ""
