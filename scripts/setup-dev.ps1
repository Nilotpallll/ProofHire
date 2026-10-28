# ProofHire — Developer Environment Setup Script (PowerShell)
# Automates prerequisite checks, npm installs, Python virtual environment, and contract compilation.

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "     PROOFHIRE DEVELOPMENT ENVIRONMENT INITIALIZATION   " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = Resolve-Path "$PSScriptRoot\.."

# 1. Validate Node.js
Write-Host "[1/6] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVer = node -v
    Write-Host "  -> Node.js active: $nodeVer" -ForegroundColor Green
    $majorVer = [int]($nodeVer.TrimStart('v').Split('.')[0])
    if ($majorVer -lt 20) {
        Write-Host "  [WARN] Node.js version 20+ is recommended. Found $nodeVer." -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [ERROR] Node.js is not installed or not in PATH. Please install Node.js v20+ LTS." -ForegroundColor Red
    exit 1
}

# 2. Validate Python
Write-Host "[2/6] Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVer = python --version
    Write-Host "  -> Python active: $pythonVer" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Python 3.12+ is required for the AI microservice. Please install Python." -ForegroundColor Red
    exit 1
}

# 3. Install Node.js Dependencies
Write-Host "[3/6] Installing root & workspace Node.js dependencies..." -ForegroundColor Yellow
Push-Location $rootPath
try {
    npm install
    Write-Host "  -> Node dependencies installed successfully." -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] npm install encountered an error: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# 4. Setup Python Virtual Environment
Write-Host "[4/6] Setting up Python virtual environment for FastAPI AI microservice..." -ForegroundColor Yellow
$aiPath = "$rootPath\services\ai"
$venvPath = "$aiPath\.venv"

Push-Location $aiPath
try {
    if (-not (Test-Path $venvPath)) {
        Write-Host "  -> Creating virtual environment in $venvPath..." -ForegroundColor Gray
        python -m venv .venv
    }
    
    $pipExe = if (Test-Path "$venvPath\Scripts\pip.exe") { "$venvPath\Scripts\pip.exe" } else { "pip" }
    Write-Host "  -> Installing Python requirements from requirements.txt..." -ForegroundColor Gray
    & $pipExe install -r requirements.txt --quiet
    Write-Host "  -> Python AI environment ready." -ForegroundColor Green
} catch {
    Write-Host "  [WARN] Python dependency setup warning: $_" -ForegroundColor Yellow
}
Pop-Location

# 5. Compile Smart Contracts
Write-Host "[5/6] Compiling Solidity smart contracts (Hardhat)..." -ForegroundColor Yellow
Push-Location "$rootPath\blockchain"
try {
    npx hardhat compile
    Write-Host "  -> Smart contracts compiled successfully." -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Contract compilation failed: $_" -ForegroundColor Red
}
Pop-Location

# 6. Database Check & Migration
Write-Host "[6/6] Checking database connectivity..." -ForegroundColor Yellow
$pgTest = Test-NetConnection -ComputerName "localhost" -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($pgTest) {
    Write-Host "  -> PostgreSQL detected on port 5432. Applying Prisma migrations..." -ForegroundColor Green
    Push-Location $rootPath
    try {
        npx prisma migrate dev --schema=services/api/prisma/schema.prisma --skip-generate
        npm run seed:db
        Write-Host "  -> Database migrations and seed data applied successfully." -ForegroundColor Green
    } catch {
        Write-Host "  [WARN] Prisma migration/seed note: $_" -ForegroundColor Yellow
    }
    Pop-Location
} else {
    Write-Host "  -> PostgreSQL not detected on port 5432." -ForegroundColor Gray
    Write-Host "  -> NOTE: ProofHire operates in Resilient Fallback Mode with in-memory domain catalogs." -ForegroundColor Cyan
    Write-Host "  -> If you wish to use PostgreSQL: start the service or run 'docker compose -f docker/docker-compose.yml up -d'." -ForegroundColor Gray
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "       PROOFHIRE ENVIRONMENT READY FOR DEVELOPMENT      " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor White
Write-Host "  1. Start all services:  powershell -ExecutionPolicy Bypass -File scripts\start-all.ps1" -ForegroundColor Yellow
Write-Host "  2. Check health status: npm run health" -ForegroundColor Yellow
Write-Host "  3. Run integration:     npm run test:e2e" -ForegroundColor Yellow
Write-Host ""
