# ProofHire Security Review & Compliance Assessment

## 1. Executive Summary

This document evaluates the security implementation of the ProofHire monorepo against industry standards (OWASP Top 10, WCAG 2.2 AA, and Web3 Smart Contract Best Practices).

**Target Status:** Pre-Production Developer MVP  
**External Audit Status:** Self-Audited & Internally Verified (No external third-party audit performed).

---

## 2. Review Checklist & Controls

### A. Authentication & Session Management
- [x] **Password Hashing**: Passwords hashed using bcrypt with salt rounds >= 10.
- [x] **Token Security**: JWT tokens signed with HMAC-SHA256, strictly validated on protected endpoints with expiration.
- [x] **No Secrets in Frontend**: `NEXT_PUBLIC_` prefixes restricted strictly to non-sensitive API URLs and network chain IDs. Private keys and database credentials strictly isolated to `.env`.
- [x] **Logout Invalidation**: Client-side token flush accompanied by HTTP cookie revocation.

### B. Authorization & Multi-Tenancy Boundaries
- [x] **Server-Side Enforcement**: All role checks implemented using NestJS `@Roles()` decorator and `RolesGuard`.
- [x] **Recruiter Job Isolation**: Recruiters can only modify, publish, or close jobs they created (`assertOwnership`).
- [x] **Student Data Protection**: Candidates cannot inspect or modify other candidates' application records or recruiter review notes.
- [x] **Closed Job Protection**: Jobs in `CLOSED` state reject new applications with HTTP 400.
- [x] **Duplicate Application Prevention**: Candidates cannot submit multiple concurrent applications for the same job requisition.

### C. Smart Contract & Cryptographic Safety
- [x] **Access Control**: OpenZeppelin `Ownable` pattern for contract ownership; `onlyAuthorizedIssuer` for credential issuance.
- [x] **Re-entrancy Protection**: No external calls to untrusted contracts with state changes; all internal state updated before event emission.
- [x] **Privacy Preservation**: Salted Keccak-256 subject references prevent cross-institutional student identity correlation.
- [x] **Permanent Revocations**: Revocations do not delete storage slots or historical event logs.
- [x] **Digest Comparison**: Authoritative smart contract check ensures byte-level equality between physical PDF certificates and on-chain records.

### D. AI Microservice & NLP Hardening
- [x] **Passive Document Extraction**: Resumes parsed without executing JavaScript, macros, or external OS binaries.
- [x] **Deterministic Scoring**: 100-point rubric calculated using published mathematical criteria rather than opaque LLM prompts.
- [x] **Anti-Bias Measures**: Demographics and protected characteristics excluded from ranking signals.
- [x] **Graceful Failure**: If the AI microservice is offline, the backend degrades gracefully to deterministic local heuristics without crashing.

### E. File Upload & Input Sanitization
- [x] **MIME Validation**: Uploads restricted to `application/pdf` and `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
- [x] **Size Limits**: Enforced 5 MB maximum file size.
- [x] **Path Traversal Protection**: Uploaded files named via cryptographic UUIDs or in-memory streams; no user-supplied filenames used in filesystem paths.

---

## 3. Disclosed Limitations & Recommendations

1. **Testnet RPC Reliability**: Public EVM testnets (e.g. Polygon Amoy) may experience transient RPC throttling or rate limiting. The system returns explicit `UNAVAILABLE` status rather than falsifying state.
2. **KMS Integration**: In enterprise production, institution wallets should be managed using AWS KMS or HashiCorp Vault rather than raw environment variable keys.
3. **Formal Verification**: Smart contracts should undergo Certora or Slither static analysis and external smart contract auditing before mainnet deployment.
