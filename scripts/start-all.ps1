# ProofHire — All-in-One Local Development Orchestrator (PowerShell)
# Launches all 4 microservices in labeled PowerShell windows with pre-flight checks and live readiness verification.

[CmdletBinding()]
param(
    [switch]$SkipBlockchain = $false,
    [switch]$ForceKillPorts = $false
)

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "       PROOFHIRE LOCAL ORCHESTRATION STARTUP            " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = Resolve-Path "$PSScriptRoot\.."

# 1. Check Node.js
try {
    $nodeVer = node -v
    Write-Host "[OK] Node.js active: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is required (v20+ LTS). Please install Node.js." -ForegroundColor Red
    exit 1
}

# 2. Check Python
try {
    $pythonVer = python --version
    Write-Host "[OK] Python active: $pythonVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python 3.12+ is required. Please install Python." -ForegroundColor Red
    exit 1
}

# 3. Port Pre-flight Checks (8545, 8000, 4000, 3000)
$requiredPorts = @(
    @{ Port = 8545; Name = "Hardhat EVM Node" },
    @{ Port = 8000; Name = "FastAPI AI Service" },
    @{ Port = 4000; Name = "NestJS REST API" },
    @{ Port = 3000; Name = "Next.js Web Frontend" }
)

Write-Host ""
Write-Host "Checking port allocations..." -ForegroundColor Yellow

$portConflict = $false
foreach ($p in $requiredPorts) {
    $conn = Get-NetTCPConnection -LocalPort $p.Port -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
        $ownerPid = ($conn | Select-Object -ExpandProperty OwningProcess -First 1)
        Write-Host "  [OCCUPIED] Port $($p.Port) ($($p.Name)) is in use by PID $ownerPid." -ForegroundColor Yellow
        $portConflict = $true
        if ($ForceKillPorts) {
            Write-Host "  -> Force terminating PID $ownerPid on port $($p.Port)..." -ForegroundColor Yellow
            Stop-Process -Id $ownerPid -Force -ErrorAction SilentlyContinue
            $portConflict = $false
        }
    } else {
        Write-Host "  [AVAILABLE] Port $($p.Port) ($($p.Name)) is ready." -ForegroundColor Green
    }
}

if ($portConflict -and -not $ForceKillPorts) {
    Write-Host ""
    Write-Host "[NOTE] Some ports are already occupied. Services may already be running." -ForegroundColor Cyan
    Write-Host "To clear ports automatically, re-run with: .\scripts\start-all.ps1 -ForceKillPorts" -ForegroundColor Gray
    Write-Host "Or run .\scripts\stop-all.ps1 first." -ForegroundColor Gray
}

# 4. Ensure Python Virtual Environment Exists
$aiPath = "$rootPath\services\ai"
$venvPath = "$aiPath\.venv"
if (-not (Test-Path $venvPath)) {
    Write-Host ""
    Write-Host "-> Initializing Python virtual environment in services\ai\.venv..." -ForegroundColor Yellow
    Push-Location $aiPath
    python -m venv .venv
    $pipExe = if (Test-Path "$venvPath\Scripts\pip.exe") { "$venvPath\Scripts\pip.exe" } else { "pip" }
    & $pipExe install -r requirements.txt --quiet
    Pop-Location
}

Write-Host ""
Write-Host "Starting microservices in separate windows..." -ForegroundColor Yellow

# A. Hardhat Node (Port 8545)
if (-not $SkipBlockchain) {
    $hardhatRunning = Get-NetTCPConnection -LocalPort 8545 -State Listen -ErrorAction SilentlyContinue
    if (-not $hardhatRunning) {
        Write-Host "-> Launching Hardhat EVM Node (Port 8545)..." -ForegroundColor Gray
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\blockchain'; Write-Host '--- Hardhat EVM Node (Port 8545) ---' -ForegroundColor Cyan; npx hardhat node"
        
        # Wait up to 10 seconds for Hardhat to become responsive
        Write-Host "-> Waiting for Hardhat node to initialize..." -ForegroundColor Gray
        $retries = 10
        $nodeReady = $false
        while ($retries -gt 0 -and -not $nodeReady) {
            Start-Sleep -Seconds 1
            $rpcTest = Get-NetTCPConnection -LocalPort 8545 -State Listen -ErrorAction SilentlyContinue
            if ($rpcTest) { $nodeReady = $true }
            $retries--
        }
        
        # Deploy smart contracts to local node
        Write-Host "-> Deploying CredentialRegistry to local Hardhat node..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
        $deployProc = Start-Process powershell -ArgumentList "-Command", "cd '$rootPath\blockchain'; npx hardhat run scripts/deploy.ts --network localhost" -Wait -PassThru
        if ($deployProc.ExitCode -eq 0) {
            Write-Host "[OK] Smart contract deployed and ABI synced to backend." -ForegroundColor Green
        } else {
            Write-Host "[WARN] Contract deployment returned non-zero code. Check blockchain window." -ForegroundColor Yellow
        }
    } else {
        Write-Host "  -> Hardhat node already active on port 8545." -ForegroundColor Green
    }
}

# B. FastAPI AI Intelligence Microservice (Port 8000)
$aiRunning = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
if (-not $aiRunning) {
    Write-Host "-> Launching FastAPI AI Microservice (Port 8000)..." -ForegroundColor Gray
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\services\ai'; Write-Host '--- FastAPI AI Service (Port 8000) ---' -ForegroundColor Cyan; if (Test-Path '.venv\Scripts\Activate.ps1') { .\.venv\Scripts\Activate.ps1 }; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
} else {
    Write-Host "  -> FastAPI AI Service already active on port 8000." -ForegroundColor Green
}

# C. NestJS Core API (Port 4000)
$apiRunning = Get-NetTCPConnection -LocalPort 4000 -State Listen -ErrorAction SilentlyContinue
if (-not $apiRunning) {
    Write-Host "-> Launching NestJS REST Core API (Port 4000)..." -ForegroundColor Gray
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\services\api'; Write-Host '--- NestJS Core REST API (Port 4000) ---' -ForegroundColor Cyan; npm run start:dev"
} else {
    Write-Host "  -> NestJS Core API already active on port 4000." -ForegroundColor Green
}

# D. Next.js Web Frontend (Port 3000)
$webRunning = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if (-not $webRunning) {
    Write-Host "-> Launching Next.js Web Frontend (Port 3000)..." -ForegroundColor Gray
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\apps\web'; Write-Host '--- Next.js Web Frontend (Port 3000) ---' -ForegroundColor Cyan; npm run dev"
} else {
    Write-Host "  -> Next.js Web Frontend already active on port 3000." -ForegroundColor Green
}

# 5. Live Readiness Check Loop
Write-Host ""
Write-Host "Verifying service readiness (polling health endpoints)..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Push-Location $rootPath
powershell -ExecutionPolicy Bypass -File scripts\health-check.ps1
Pop-Location

Write-Host "Application URLs:" -ForegroundColor White
Write-Host "  Web Frontend:        http://localhost:3000" -ForegroundColor Cyan
Write-Host "  NestJS Swagger Docs: http://localhost:4000/api/docs" -ForegroundColor Cyan
Write-Host "  FastAPI Docs:        http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  Hardhat JSON-RPC:    http://127.0.0.1:8545" -ForegroundColor Cyan
Write-Host ""
Write-Host 'Demo Logins available at http://localhost:3000/login (1-click login buttons)' -ForegroundColor Green
Write-Host 'Run npm run test:e2e to execute the complete automated integration suite.' -ForegroundColor Green
Write-Host ""
