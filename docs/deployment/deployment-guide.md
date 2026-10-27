# ProofHire Deployment Guide & Cloud Infrastructure

## 1. Monorepo Production Topology

ProofHire consists of four independently deployable services:

```text
┌──────────────────────┐        ┌──────────────────────┐
│  Next.js Web (Vercel)│        │   NestJS REST API    │
│    apps/web:3000     │ ───►   │  services/api:4000   │
└──────────────────────┘        └──────────┬───────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
             ┌─────────────────────┐               ┌─────────────────────┐
             │ FastAPI AI Service  │               │   EVM Blockchain    │
             │  services/ai:8000   │               │   (Hardhat/Polygon) │
             └─────────────────────┘               └─────────────────────┘
```

---

## 2. Recommended Hosting Targets

| Component | Target Platform | Runtime / Build Command | Health Endpoint |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vercel / Cloudflare Pages | `npm run build --workspace=@proofhire/web` | `GET /` |
| **Backend API** | Railway / Render / AWS ECS | `npm run build --workspace=@proofhire/api` -> `node dist/main` | `GET /api/v1/health` |
| **AI Service** | AWS App Runner / Fly.io / Modal | `uvicorn app.main:app --host 0.0.0.0 --port 8000` | `GET /health` |
| **Database** | Supabase / AWS RDS PostgreSQL | `npx prisma migrate deploy` | Internal port 5432 |
| **Smart Contracts** | Ethereum Sepolia / Polygon Amoy | `npx hardhat run scripts/deploy.ts --network amoy` | Public RPC |

---

## 3. Environment Variables Reference

### Backend API (`services/api/.env`)
```env
# Application Port & Database
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/proofhire?schema=public"

# Authentication
JWT_SECRET="proofhire-production-jwt-super-secret-key-change-me"
JWT_EXPIRES_IN="7d"

# Microservices & Blockchain Integration
AI_SERVICE_URL="http://localhost:8000"
BLOCKCHAIN_RPC_URL="http://127.0.0.1:8545"
CREDENTIAL_CONTRACT_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"

# CORS Allowed Origins (Comma separated)
CORS_ORIGIN="http://localhost:3000,https://proofhire.io"
```

### Web Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
NEXT_PUBLIC_CHAIN_ID="31337"
NEXT_PUBLIC_EXPLORER_URL="https://amoy.polygonscan.com"
```

### AI Intelligence Microservice (`services/ai/.env`)
```env
AI_SERVICE_HOST="0.0.0.0"
AI_SERVICE_PORT=8000
MODEL_NAME="proofhire-nlp-rules-v2"
MAX_UPLOAD_SIZE_MB=5
```

---

## 4. Database Migration & Seeding Sequence

When deploying to a new environment:
```bash
# 1. Run migrations against remote PostgreSQL database
cd services/api
npx prisma migrate deploy

# 2. Seed default platform roles and demonstration data
npx prisma db seed
```

---

## 5. Local Docker Compose Alternative

For local containerized orchestration:
```bash
docker compose up -d
```
Starts PostgreSQL, redis (if configured), and connects the local network bridges.
