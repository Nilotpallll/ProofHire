# ProofHire — Database Design & Prisma Schema

## Entity Relationship Overview

The ProofHire PostgreSQL schema is modeled and managed via Prisma ORM (`services/api/prisma/schema.prisma`).

```mermaid
erDiagram
    User ||--o| StudentProfile : "has"
    User ||--o| RecruiterProfile : "has"
    User ||--o{ InstitutionMembership : "belongs to"
    User ||--o{ Wallet : "owns"
    User ||--o{ AuditLog : "records"
    
    Institution ||--o{ Credential : "issues"
    Institution ||--o{ InstitutionMembership : "members"
    
    StudentProfile ||--o{ Credential : "receives"
    StudentProfile ||--o{ Resume : "uploads"
    StudentProfile ||--o{ Application : "submits"
    StudentProfile ||--o{ StudentSkill : "possesses"
    
    RecruiterProfile ||--o{ Job : "posts"
    Job ||--o{ Application : "receives"
    Job ||--o{ JobSkill : "requires"
    
    Credential ||--o{ CredentialVerification : "audits"
    Resume ||--o| ResumeAnalysis : "evaluated by"
```

---

## Core Entities

1. **User:** Central identity table containing email, password hash, role (`STUDENT`, `RECRUITER`, `INSTITUTION`, `ADMIN`), and account status (`ACTIVE`, `PENDING_APPROVAL`, `SUSPENDED`).
2. **StudentProfile:** Extends User for candidates with academic affiliation, bio, graduation cohort, GPA, and portfolio links.
3. **RecruiterProfile:** Extends User for corporate recruiters with company credentials and verification status.
4. **Institution:** Accredited university or certification body with registration code, verification timestamp, and issuer wallet address.
5. **Credential:** The primary verifiable credential record holding public hash ID, recipient ID, issuing institution ID, IPFS hash, transaction hash, block number, certified skills, and revocation status.
6. **CredentialVerification:** Audit trail of all verification queries (public web, recruiter, or API).
7. **Job & Application:** Requisitions and candidate pipeline records with AI match scores and match rationales.
8. **AuditLog:** Security audit records capturing IP address, actor, action, and target entity.
