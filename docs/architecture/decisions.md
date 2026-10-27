# ProofHire — Architectural Decision Records (ADRs)

## ADR-001: Monorepo Architecture with npm Workspaces
- **Status:** Accepted
- **Context:** ProofHire comprises frontend, backend API, AI service, smart contracts, and shared domain models.
- **Decision:** Utilize npm workspaces with clean top-level boundaries (`apps/web`, `services/api`, `services/ai`, `blockchain`, `packages/*`).
- **Consequences:** Simplified dependency management, single repository history, shared TypeScript interfaces via `@proofhire/types`.

## ADR-002: Dual Storage Model (PostgreSQL + IPFS + Ethereum)
- **Status:** Accepted
- **Context:** Sensitive student records (GPA, transcripts, personal PII) cannot be placed unencrypted on a public blockchain due to GDPR and FERPA regulations.
- **Decision:** 
  1. Relational data (user accounts, applications, audit logs) reside in PostgreSQL via Prisma.
  2. Credential documents and metadata are encrypted and pinned to IPFS.
  3. Only the Keccak-256 Merkle root hash and issuer signature are anchored to Ethereum Sepolia.
- **Consequences:** Maximum privacy compliance with tamper-proof mathematical verification.

## ADR-003: Controlled Institutional Issuance & Non-Custodial Ownership
- **Status:** Accepted
- **Context:** Anyone can generate a wallet; however, only authorized educational authorities should have issuance rights.
- **Decision:** The smart contract implements an `onlyIssuer` modifier managed by the contract owner / platform governance. Institution accounts default to `PENDING_APPROVAL` status upon public registration and must be vetted by SuperAdmins.
- **Consequences:** Prevents diploma mills and protects accredited universities.

## ADR-004: Decoupled AI Microservice
- **Status:** Accepted
- **Context:** AI resume parsing and candidate ranking require dedicated Python scientific and NLP libraries.
- **Decision:** Run FastAPI as a standalone microservice on Port 8000.
- **Consequences:** Independent scaling and zero impact on NestJS API memory footprint.
