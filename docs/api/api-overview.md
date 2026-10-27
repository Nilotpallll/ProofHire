# ProofHire — REST API Specification & Swagger Overview

## Base URL
Local Development: `http://localhost:4000/api`
Interactive Swagger Documentation: `http://localhost:4000/api/docs`

---

## Endpoint Summary

### 1. Authentication (`/api/auth`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register student, recruiter, or institution | No |
| `POST` | `/api/auth/login` | Email and password authentication (returns JWT) | No |
| `POST` | `/api/auth/seed-login` | Instant demo login for testing | No |
| `GET` | `/api/auth/me` | Current authenticated user profile | Bearer JWT |

### 2. Credentials (`/api/credentials`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/credentials/verify/:id` | Public verification check | No |
| `GET` | `/api/credentials` | List all public credentials | No |
| `GET` | `/api/credentials/my` | List credentials of current student | Student |
| `POST` | `/api/credentials/issue` | Issue new credential on-chain | Institution / Admin |
| `POST` | `/api/credentials/revoke` | Revoke an issued credential | Institution / Admin |

### 3. Jobs (`/api/jobs`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | List active job requisitions | No |
| `GET` | `/api/jobs/:id` | Get details of a job | No |
| `POST` | `/api/jobs` | Post new job requisition | Recruiter / Admin |

### 4. Applications (`/api/applications`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/applications/my` | Get current student applications | Student |
| `GET` | `/api/applications/recruiter` | Candidate applications for recruiter | Recruiter / Admin |
| `POST` | `/api/applications/apply` | Apply for job with verified credentials | Student |
| `PATCH` | `/api/applications/:id/status` | Update candidate pipeline stage | Recruiter / Admin |

### 5. Institutions (`/api/institutions`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/institutions` | List accredited institutions | No |
| `GET` | `/api/institutions/pending` | Institution approval queue | Admin |
| `PATCH` | `/api/institutions/:id/approve` | Approve institution for on-chain issuance | Admin |
| `PATCH` | `/api/institutions/:id/reject` | Reject institution application | Admin |

### 6. System Health (`/api/health`)
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Uptime and service status check | No |
