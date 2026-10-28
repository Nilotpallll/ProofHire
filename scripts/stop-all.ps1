# ProofHire — Service Shutdown & Port Release Utility (PowerShell)
# Gracefully stops processes listening on ports 8545, 8000, 4000, and 3000.

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "         PROOFHIRE SERVICE SHUTDOWN UTILITY            " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

$ports = @(8545, 8000, 4000, 3000)

foreach ($port in $ports) {
    Write-Host "Checking port $port..." -NoNewline
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $pids) {
            try {
                $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
                if ($proc) {
                    Write-Host " Terminating PID $procId ($($proc.ProcessName))..." -ForegroundColor Yellow
                    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                }
            } catch {
                Write-Host " Could not terminate PID ${procId}: $_" -ForegroundColor Red
            }
        }
        Write-Host " Port $port released." -ForegroundColor Green
    } else {
        Write-Host " [Clean] No active listeners." -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "           ALL PROOFHIRE PORTS ARE NOW FREE            " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
