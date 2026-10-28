# ProofHire — Deployment, Operations & Production Readiness Guide

This document defines the deployment topology, operations, environment specifications, and security checklists for ProofHire across **Local Development**, **Staging**, and **Production** environments.

---

## 1. Local-Demo Readiness vs. Production Deployment Readiness

It is essential to distinguish between a functional local demonstration and production cloud readiness:

| Dimension | Local Development / Demo | Production Deployment Target |
| :--- | :--- | :--- |
| **Blockchain Network** | Hardhat Local EVM (`ChainID: 31337`) | Ethereum Sepolia (`11155111`) or Polygon Amoy (`80002`) |
| **Relayer Private Key** | Pre-funded Hardhat test accounts | Cloud HSM / AWS KMS / Vault hardware signers |
| **Database** | In-memory fallback + Local PostgreSQL | Managed High-Availability PostgreSQL (RDS / Supabase) |
| **Document Storage** | Local simulated cryptographic store | Pinata IPFS Cluster / AWS S3 with client-side KMS encryption |
| **Secret Management** | Local `.env` files (Git-ignored) | Doppler / AWS Secrets Manager / Infisical |
| **SSL / Ingress** | Plaintext `http://localhost:*` | TLS 1.3 / Cloudflare Edge Protection / Let's Encrypt |
| **Process Management** | Node/Uvicorn dev servers (`powershell`) | Containerized Docker / Kubernetes / AWS ECS / PM2 |

> **IMPORTANT:** ProofHire is currently certified for **Local-Demo Readiness**. Deploying to production requires executing the Cloud Infrastructure Steps in Section 4.

---

## 2. Monorepo Service Topology

```text
┌────────────────────────┐         ┌────────────────────────┐
│  Next.js 15 Frontend   │         │    NestJS Core API     │
│   (Port 3000 / Web)    │ ──────► │   (Port 4000 / REST)   │
└────────────────────────┘         └───────────┬────────────┘
                                               │
                          ┌────────────────────┴────────────────────┐
                          ▼                                         ▼
              ┌───────────────────────┐                 ┌───────────────────────┐
              │  FastAPI AI Service   │                 │   Ethereum EVM Node   │
              │   (Port 8000 / NLP)   │                 │   (Port 8545 / RPC)   │
              └───────────────────────┘                 └───────────────────────┘
```

---

## 3. Step-by-Step Local Deployment & Startup Sequence

### Step 1: Clone & Install Dependencies
```powershell
git clone https://github.com/Nilotpallll/ProofHire.git
cd ProofHire
npm install
```

### Step 2: Configure Python Virtual Environment
```powershell
cd services\ai
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..\..
```

### Step 3: Launch Services via Orchestration Script
```powershell
# Launches Hardhat, deploys contracts, starts AI service, API, and Next.js
powershell -ExecutionPolicy Bypass -File scripts\start-all.ps1
```

### Step 4: Verify Live Service Health
```powershell
npm run health
```

---

## 4. Production Cloud Infrastructure Setup

### 1. Database Setup (PostgreSQL)
1. Provision a PostgreSQL 15+ database instance (e.g., Supabase, Neon, AWS RDS).
2. Set the connection string in `services/api/.env`:
   ```env
   DATABASE_URL="postgresql://proofhire_app:SECURE_PASSWORD@db.example.com:5432/proofhire?sslmode=require"
   ```
3. Run migrations and database seeds:
   ```bash
   cd services/api
   npx prisma migrate deploy
   npx prisma db seed
   ```

### 2. Smart Contract Deployment on EVM Networks
1. Fund a deployment relayer wallet with native testnet ETH / MATIC.
2. In `blockchain/.env`:
   ```env
   SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
   PRIVATE_KEY="0xYOUR_RELAYER_PRIVATE_KEY"
   ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
   ```
3. Execute deployment script:
   ```bash
   cd blockchain
   npx hardhat run scripts/deploy.ts --network sepolia
   ```
4. Verify contract on Etherscan:
   ```bash
   npx hardhat verify --network sepolia <DEPLOYED_CONTRACT_ADDRESS>
   ```

### 3. Backend REST API Deployment (Docker / AWS ECS / Render)
1. Build production bundle:
   ```bash
   npm run build --workspace=@proofhire/api
   ```
2. Set production environment variables in container runtime:
   * `PORT=4000`
   * `NODE_ENV=production`
   * `JWT_SECRET=<64-char-random-hex-secret>`
   * `RPC_URL=https://sepolia.infura.io/v3/...`
   * `PROOFHIRE_CONTRACT_ADDRESS=<DEPLOYED_CONTRACT_ADDRESS>`
   * `AI_SERVICE_URL=https://ai.proofhire.io`
   * `CORS_ORIGINS=https://proofhire.io,https://app.proofhire.io`

### 4. AI Intelligence Microservice Deployment (AWS App Runner / Fly.io / Modal)
1. Deploy with Gunicorn / Uvicorn worker manager:
   ```bash
   cd services/ai
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```
2. Configure memory requirements: minimum 2 GB RAM recommended for multi-format PDF/DOCX processing.

### 5. Web Frontend Deployment (Vercel)
1. Connect the `ProofHire` Git repository to Vercel.
2. Root Directory: `apps/web`.
3. Build Command: `npm run build`.
4. Environment Variables:
   * `NEXT_PUBLIC_API_URL=https://api.proofhire.io/api`
   * `NEXT_PUBLIC_CHAIN_ID=11155111`
   * `NEXT_PUBLIC_PROOFHIRE_CONTRACT=<DEPLOYED_CONTRACT_ADDRESS>`
   * `NEXT_PUBLIC_SEPOLIA_EXPLORER=https://sepolia.etherscan.io`

---

## 5. Security & Pre-Release Checklist

Before promoting any build to public or staging environments:

- [x] **No Hardcoded Secrets in Git:** Audit git history (`git log -p`) to ensure no real private keys or database passwords were committed.
- [x] **`.gitignore` Enforced:** Verify `.env`, `.env.*`, `dist/`, `build/`, `*.db`, and cache directories are strictly excluded.
- [x] **Role Boundary Enforcement:** Confirm public registration endpoints reject self-assigned `ADMIN` roles.
- [x] **Strict DTO Validation:** Confirm `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true` is enabled on the API.
- [x] **CORS Lockdown:** Verify `CORS_ORIGINS` is restricted to authorized company domains in production.
- [x] **Cryptographic Digest Matching:** Public verification checks Keccak-256 byte digests against the smart contract registry.
- [x] **Test Suite Passing:** All 110 automated tests (Solidity, NestJS, FastAPI, E2E runner) pass with zero failures.

---

## 6. Known Limitations & Future Roadmap

1. **Local Node Ephemerality:**
   * When using the local Hardhat node (`http://127.0.0.1:8545`), stopping the node resets the blockchain ledger. In a persistent staging environment, use Sepolia or an Arbitrum Orbit testnet.
2. **Relayer Gas Management:**
   * In local mode, the deployer wallet acts as relayer with infinite test ETH. In production, a gas station / meta-transaction relayer (Biconomy / Gelato / OpenZeppelin Defender) is required to sponsor student gas fees.
3. **Decentralized Storage Pinning:**
   * Currently, document metadata links use standardized IPFS URIs (`ipfs://bafy...`). Integrating a dedicated Pinata or Filecoin storage cluster is planned for milestone v2.
