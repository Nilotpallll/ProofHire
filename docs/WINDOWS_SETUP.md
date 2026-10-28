# ProofHire — Windows PowerShell Setup & Troubleshooting Guide

**Target Environment:** Windows 10 / 11 (64-bit)  
**Shell Environment:** Windows PowerShell 5.1 or PowerShell 7+ (`pwsh`)  
**Monorepo Version:** v0.1.0  
**Updated:** October 2026  

---

## 1. System Architecture & Port Allocation

ProofHire is architected into 4 coordinated microservices running on dedicated, non-conflicting local ports:

| Service | Port | Directory | Tech Stack | Health Endpoint |
| :--- | :---: | :--- | :--- | :--- |
| **Next.js Web Frontend** | `3000` | `apps/web` | React 19, Next.js 15 App Router | `http://localhost:3000` |
| **NestJS REST API Gateway** | `4000` | `services/api` | NestJS 10, Prisma ORM, Passport JWT | `http://localhost:4000/api/health` |
| **FastAPI AI Intelligence** | `8000` | `services/ai` | Python 3.12+, FastAPI, Uvicorn, Pydantic | `http://localhost:8000/health` |
| **Hardhat EVM Local Blockchain** | `8545` | `blockchain` | Solidity 0.8.20, Hardhat, Ethers.js | `http://127.0.0.1:8545` (JSON-RPC) |
| **PostgreSQL Database** *(Optional)* | `5432` | `docker` | PostgreSQL 16 (or In-Memory Fallback) | `localhost:5432` |

> [!NOTE]
> **Docker is NOT mandatory.** ProofHire includes a built-in Resilient Fallback Mode with in-memory domain persistence. If PostgreSQL is not detected on port 5432, the API automatically operates seamlessly without crashing or requiring third-party tools.

---

## 2. Prerequisites & Workstation Setup

Before proceeding, confirm that your Windows workstation has the required runtimes installed:

### A. Runtime Verification
Open a PowerShell terminal and verify:

```powershell
# 1. Verify Node.js (v20+ or v22+ LTS required)
node -v
# Output example: v22.23.2

# 2. Verify npm (v10+ required)
npm -v
# Output example: 10.9.2

# 3. Verify Python (v3.12+ required)
python --version
# Output example: Python 3.13.2

# 4. Verify Git
git --version
```

### B. PowerShell Execution Policy
By default, Windows restricts running unsigned PowerShell scripts. Enable script execution for your current user account:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

Alternatively, all ProofHire scripts can be executed with `-ExecutionPolicy Bypass` without altering system-wide policies:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup-dev.ps1
```

---

## 3. Automated One-Command Initialization

ProofHire provides an automated setup script that configures npm packages, virtual environments, contract compilation, and database connectivity.

From the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup-dev.ps1
```

### What this script automates:
1. **Runtime Validation:** Confirms Node.js v20+ and Python 3.12+ are available in your `PATH`.
2. **Monorepo Dependencies:** Runs `npm install` across all root and workspace packages (`apps/web`, `services/api`, `packages/*`, `blockchain`).
3. **Python AI Virtual Environment:** Automatically provisions `services\ai\.venv` using `python -m venv` and installs `requirements.txt` (`fastapi`, `uvicorn`, `pydantic`, `python-docx`, `pypdf`, `python-multipart`).
4. **Smart Contract Compilation:** Executes `npx hardhat compile` inside `blockchain/` to generate contract artifacts, bytecodes, and TypeScript typings.
5. **Database Inspection & Migration:** Probes port 5432. If PostgreSQL is active, applies Prisma migrations (`prisma migrate dev`) and populates development seeds (`npm run seed:db`). If offline, enables Resilient Fallback Mode with clear console instructions.

---

## 4. Starting All Services (Orchestrated Workflow)

To launch all 4 microservices simultaneously in labeled PowerShell consoles with automated readiness checking:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\start-all.ps1
```

### Optional Parameters:
* **`-ForceKillPorts`**: Automatically detects and terminates any zombie processes occupying ports 8545, 8000, 4000, or 3000 before starting:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts\start-all.ps1 -ForceKillPorts
  ```
* **`-SkipBlockchain`**: Starts only the AI, API, and Frontend services (useful for UI or NLP development without EVM transactions):
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts\start-all.ps1 -SkipBlockchain
  ```

---

## 5. Manual Terminal-by-Terminal Mode

If you prefer starting each service individually in dedicated terminal tabs (e.g., in Windows Terminal or VS Code):

### Terminal 1: Hardhat EVM Blockchain (Port 8545)
```powershell
cd blockchain
npx hardhat node
```
*Keep this window running. It provides local Ethereum accounts and mining on block 0.*

### Terminal 2: Deploy Credential Contract & Sync ABI
```powershell
cd blockchain
npx hardhat run scripts/deploy.ts --network localhost
```
*This deploys `CredentialRegistry.sol` to block 1 and automatically updates `services/api/src/blockchain/contract-config.json` with the deployed address and ABI.*

### Terminal 3: FastAPI AI Intelligence Service (Port 8000)
```powershell
cd services\ai
# Activate the dedicated virtual environment
.\.venv\Scripts\Activate.ps1
# Start the Uvicorn ASGI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Interactive Swagger docs available at [http://localhost:8000/docs](http://localhost:8000/docs).*

### Terminal 4: NestJS REST Core API (Port 4000)
```powershell
cd services\api
npm run start:dev
```
*Interactive Swagger docs available at [http://localhost:4000/api/docs](http://localhost:4000/api/docs).*

### Terminal 5: Next.js Web Frontend (Port 3000)
```powershell
cd apps\web
npm run dev
```
*Application web interface available at [http://localhost:3000](http://localhost:3000).*

---

## 6. Database Persistence Configurations

ProofHire supports three database operating modes:

### Mode A: Resilient In-Memory Fallback (Default — Zero Installation)
* **Status:** Built-in. Requires no setup or Docker.
* **Behavior:** When PostgreSQL is unreachable on port 5432, NestJS automatically loads seed users, credential stores, and jobs into resilient in-memory domain memory.
* **Use Case:** Instant local evaluation, frontend development, and automated test runs.

### Mode B: Docker Compose PostgreSQL (Optional)
If you have Docker Desktop installed and want containerized database persistence:
```powershell
# Start PostgreSQL container on port 5432
docker compose -f docker/docker-compose.yml up -d

# Apply database migrations
npx prisma migrate dev --schema=services/api/prisma/schema.prisma --skip-generate

# Seed development data
npm run seed:db

# To shut down when finished
docker compose -f docker/docker-compose.yml down
```

### Mode C: Native Windows PostgreSQL Service
If you have PostgreSQL installed natively as a Windows Service:
1. Verify the service is running (`Get-Service -Name postgresql*`).
2. Verify `DATABASE_URL` in `services/api/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/proofhire?schema=public"
   ```
3. Apply migrations and load seed records without resetting the database:
   ```powershell
   npx prisma migrate dev --schema=services/api/prisma/schema.prisma --skip-generate
   npm run seed:db
   ```

---

## 7. Health Checking & System Diagnostics

To verify that all microservices are online, responsive, and communicating properly, run:

```powershell
npm run health
```

Or invoke the PowerShell script directly:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\health-check.ps1
```

### Expected Output:
```text
=======================================================
       PROOFHIRE MICROSERVICES HEALTH DIAGNOSTIC        
=======================================================

[ONLINE ] Hardhat Local EVM Node             Port 8545     48ms (Block: #15)
[ONLINE ] FastAPI AI Intelligence Service    Port 8000   2054ms 
[ONLINE ] NestJS REST Core API               Port 4000     20ms 
[ONLINE ] Next.js Web Frontend               Port 3000    291ms 

-------------------------------------------------------
[OK] ALL PROOFHIRE SERVICES OPERATIONAL AND HEALTHY
=======================================================
```

---

## 8. Stopping All Services & Releasing Ports

To shut down all background listeners on ports 8545, 8000, 4000, and 3000 cleanly:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\stop-all.ps1
```

This utility identifies listening PIDs on the four ports and terminates them safely, ensuring clean workspace ports for the next run.

---

## 9. Demonstration Persona Accounts

Once services are running, navigate to **[http://localhost:3000/login](http://localhost:3000/login)**. The login screen includes **1-Click Quick Login Buttons** for instant persona switching:

| Role | Email | Password | Primary Route | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `student@proofhire.io` | `Student123!` | `/student/dashboard` | View credentials, upload PDF resume, review 100-pt AI rubric, apply for jobs. |
| **Recruiter** | `recruiter@proofhire.io` | `Recruiter123!` | `/recruiter/dashboard` | Post job requisitions, review candidate match scores, verify on-chain proofs. |
| **Institution** | `institution@proofhire.io` | `Institution123!` | `/institution/dashboard` | Issue credentials with Keccak-256 digests, manage issued credentials, revoke on-chain. |
| **SuperAdmin** | `admin@proofhire.io` | `Admin123!` | `/admin/dashboard` | Vet and approve institutions, review system-wide audit logs, monitor verifications. |

---

## 10. Troubleshooting & FAQ

### Issue 1: Script execution disabled (`PSSecurityException`)
* **Symptom:** `File scripts\setup-dev.ps1 cannot be loaded because running scripts is disabled on this system.`
* **Solution:** Add `-ExecutionPolicy Bypass` when calling PowerShell, or execute:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
  ```

---

### Issue 2: Port Conflict (`EADDRINUSE` or `Port already in use`)
* **Symptom:** Next.js binds to port 3001 instead of 3000, or NestJS throws `Error: listen EADDRINUSE: address already in use :::4000`.
* **Solution:** Run the port release utility:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts\stop-all.ps1
  ```
  Or restart services using `-ForceKillPorts`:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts\start-all.ps1 -ForceKillPorts
  ```

---

### Issue 3: Python Virtual Environment Activation Error
* **Symptom:** `Activate.ps1 cannot be loaded` or `uvicorn: The term 'uvicorn' is not recognized`.
* **Solution:**
  1. Ensure the virtual environment exists:
     ```powershell
     cd services\ai
     python -m venv .venv
     ```
  2. Install packages directly through the virtual environment's pip:
     ```powershell
     .\.venv\Scripts\python.exe -m pip install -r requirements.txt
     ```
  3. Run Uvicorn directly through the virtual environment's Python executable:
     ```powershell
     .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
     ```

---

### Issue 4: Smart Contract Address Not Found / RPC Error
* **Symptom:** NestJS logs `Contract not deployed at address 0x0...` or verification returns `UNAVAILABLE`.
* **Solution:**
  1. Verify Hardhat is running on port 8545:
     ```powershell
     Test-NetConnection -ComputerName localhost -Port 8545
     ```
  2. Redeploy the contract to the local node:
     ```powershell
     npm run deploy:blockchain
     ```
  3. Verify `services/api/src/blockchain/contract-config.json` contains a non-zero address (e.g., `0x5FbDB2315678afecb367f032d93F642f64180aa3`).

---

### Issue 5: PowerShell `Invoke-WebRequest` Freezes or Prompts for Setup
* **Symptom:** `Invoke-WebRequest` hangs indefinitely during health checks.
* **Root Cause:** Windows PowerShell 5.1 attempts to initialize Internet Explorer parsing by default if `-UseBasicParsing` is omitted.
* **Solution:** ProofHire's `scripts/health-check.ps1` explicitly includes `-UseBasicParsing`. Always include `-UseBasicParsing` when querying HTTP endpoints in Windows PowerShell 5.1.

---

### Issue 6: Git Line Endings (CRLF vs LF) or Long Paths
* **Symptom:** `Filename too long` during clone or build.
* **Solution:** Enable long path support in Git:
  ```powershell
  git config --global core.longpaths true
  ```
