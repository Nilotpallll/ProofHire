# ProofHire Credential API Endpoints Specification

## 1. Overview

The Credential Module in `services/api` (`CredentialsController`, `CredentialsService`, `BlockchainService`) exposes REST endpoints for issuing, revoking, querying, and verifying academic and professional credentials.

Base URL: `http://localhost:4000/api/v1`

---

## 2. Public Endpoints (No Authentication Required)

### `GET /credentials/:id/verify`
Performs comprehensive multi-factor verification against the Ethereum/Polygon smart contract and PostgreSQL registry.

#### Query Parameters
- `digest` (optional, string): Hexadecimal string (SHA-256 or Keccak-256) of the document to cross-reference against the on-chain digest.

#### Response: `200 OK`
```json
{
  "credentialId": "CRED-MIT-2024-001",
  "status": "VERIFIED",
  "title": "Bachelor of Science in Computer Science",
  "issuer": {
    "name": "Massachusetts Institute of Technology",
    "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "isAuthorized": true
  },
  "recipient": {
    "name": "Alex Mercer",
    "pseudonymousReference": "0x8fa40e70a3239a2f7c0068a49c95d989439a34bc3d4934094a974bfa58897914"
  },
  "documentVerification": {
    "digestProvided": true,
    "onChainDigest": "0x4f828a2bcfc0c804f38698ea7363f82cb557e03efb1c7ce6e8e040cfef485fc1",
    "matches": true
  },
  "blockchainProof": {
    "network": "hardhat",
    "chainId": 31337,
    "contractAddress": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "transactionHash": "0xd394c483a99182334812301823a0194819238120391203912803912830192381",
    "blockNumber": 12,
    "issuanceTimestamp": 1714200000,
    "revocationTimestamp": null,
    "revocationReason": null
  }
}
```

#### Status Values
- `VERIFIED`: Authentic, issuer is authorized, document hash matches, not revoked.
- `REVOKED`: Previously valid credential that has been revoked.
- `DOCUMENT_MISMATCH`: Credential exists, but file digest does not match on-chain record.
- `NOT_FOUND`: No record found for the provided credential ID.
- `UNAVAILABLE`: Blockchain node or RPC is unreachable.

---

## 3. Protected Institutional Endpoints (JWT Required, Role: `INSTITUTION`)

### `POST /credentials/issue`
Issues a new verifiable credential on-chain and in PostgreSQL.

#### Request Headers
- `Authorization`: `Bearer <jwt_token>`

#### Request Body (Multipart/form-data or JSON)
```json
{
  "studentId": "usr_student_01",
  "title": "Master of Science in Artificial Intelligence",
  "credentialType": "DEGREE",
  "documentDigest": "0x4f828a2bcfc0c804f38698ea7363f82cb557e03efb1c7ce6e8e040cfef485fc1",
  "metadataUri": "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  "metadata": {
    "graduationYear": 2024,
    "department": "EECS",
    "honors": "Cum Laude"
  }
}
```

#### Response: `201 Created`
```json
{
  "id": "cred_cm428x01",
  "credentialId": "CRED-MIT-2024-002",
  "status": "ISSUED",
  "transactionHash": "0xa9348e0283049182301982301982301928301928301928301928301928301928",
  "verificationUrl": "http://localhost:3000/verify/CRED-MIT-2024-002"
}
```

---

### `POST /credentials/:id/revoke`
Revokes an existing credential. Only the issuing institution or SuperAdmin can perform this operation.

#### Request Body
```json
{
  "reason": "Administrative correction: Academic misconduct or issued in clerical error."
}
```

#### Response: `200 OK`
```json
{
  "credentialId": "CRED-MIT-2024-002",
  "status": "REVOKED",
  "revokedAt": "2026-10-27T18:40:00.000Z",
  "transactionHash": "0xbc84019283019283019283019283019283019283019283019283019283019283"
}
```
