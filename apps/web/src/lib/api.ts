/**
 * ProofHire Centralized API Client
 * Clean, resilient, strongly-typed HTTP layer connecting frontend to:
 * 1. NestJS REST API (Port 4000)
 * 2. FastAPI AI Intelligence Microservice (Port 8000)
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const AI_BASE =
  process.env.NEXT_PUBLIC_AI_URL || "http://localhost:8000";

// Helper for JWT authentication headers
function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("proofhire_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

export interface VerificationResult {
  verificationStatus: "VERIFIED" | "REVOKED" | "DOCUMENT_MISMATCH" | "NOT_FOUND" | "ISSUER_INVALID" | "UNAVAILABLE";
  isValid: boolean;
  credential?: {
    id: string;
    credentialId: string;
    title: string;
    type: string;
    recipientId?: string;
    recipientName?: string;
    institutionId?: string;
    institutionName?: string;
    institutionCode?: string;
    issueDate?: string;
    status?: string;
    documentDigest?: string;
    ipfsHash?: string;
    txHash?: string;
    blockNumber?: number;
    gradeOrScore?: string;
    skills?: string[];
    isRevoked?: boolean;
    revocationReason?: string;
    revokedAt?: string;
  };
  verificationTimestamp?: string;
  issuerVerified?: boolean;
  blockchainConfirmed?: boolean;
  contractAddress?: string;
  network?: string;
  qrVerificationUrl?: string;
  digestMatches?: boolean;
  message?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "STUDENT" | "RECRUITER" | "INSTITUTION" | "ADMIN";
    organization?: string;
    status: string;
  };
}

export interface JobRecord {
  id: string;
  recruiterId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  department: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  requiredSkills: string[];
  preferredSkills?: string[];
  applicantsCount?: number;
  verifiedApplicantsCount?: number;
  status: "OPEN" | "CLOSED" | "DRAFT";
  createdAt?: string;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  username: string;
  status: "APPLIED" | "UNDER_REVIEW" | "SHORTLISTED" | "INTERVIEW" | "SELECTED" | "REJECTED" | "WITHDRAWN";
  appliedDate: string;
  coverLetter?: string;
  aiMatchScore: number;
  matchReasons: string[];
  missingSkills: string[];
  requiredSkillCoverage?: number;
  preferredSkillCoverage?: number;
  matchingMethodology?: string;
  verifiedCredentialsCount: number;
  recruiterNotes?: string;
  statusHistory?: { status: string; timestamp: string; changedBy: string; note?: string }[];
}

export const api = {
  // Authentication
  auth: {
    async login(email: string, password: string): Promise<LoginResponse> {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Login failed (${res.status})`);
      }
      return res.json();
    },

    async register(data: {
      name: string;
      email: string;
      password: string;
      role: "STUDENT" | "RECRUITER" | "INSTITUTION";
      organizationOrUniversity?: string;
    }) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Registration failed (${res.status})`);
      }
      return res.json();
    },

    async seedLogin(role: "STUDENT" | "RECRUITER" | "INSTITUTION" | "ADMIN"): Promise<LoginResponse> {
      const res = await fetch(`${API_BASE}/auth/seed-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Seed login failed (${res.status})`);
      }
      return res.json();
    },
  },

  // Credentials Verification & Issuance
  credentials: {
    async verify(credentialId: string, digest?: string): Promise<VerificationResult> {
      const url = new URL(`${API_BASE}/credentials/${encodeURIComponent(credentialId)}/verify`);
      if (digest) {
        url.searchParams.set("digest", digest);
      }
      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Verification query failed (${res.status})`);
      }
      return res.json();
    },

    async issue(payload: {
      credentialId: string;
      recipientEmail: string;
      recipientName?: string;
      recipientId?: string;
      title: string;
      type: "DEGREE" | "DIPLOMA" | "CERTIFICATE" | "BADGE";
      gradeOrScore?: string;
      skills?: string[];
      documentDigest: string;
      ipfsHash?: string;
    }) {
      const res = await fetch(`${API_BASE}/credentials/issue`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Issuance failed (${res.status})`);
      }
      return res.json();
    },

    async revoke(credentialId: string, reason: string) {
      const res = await fetch(
        `${API_BASE}/credentials/${encodeURIComponent(credentialId)}/revoke`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ reason }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Revocation failed (${res.status})`);
      }
      return res.json();
    },

    async list(params?: { status?: string; studentId?: string; institutionId?: string }) {
      const url = new URL(`${API_BASE}/credentials`);
      if (params?.status) url.searchParams.set("status", params.status);
      if (params?.studentId) url.searchParams.set("studentId", params.studentId);
      if (params?.institutionId) url.searchParams.set("institutionId", params.institutionId);

      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },

    async my(): Promise<any[]> {
      const res = await fetch(`${API_BASE}/credentials/my`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },
  },

  // Jobs
  jobs: {
    async list(filters?: { search?: string; department?: string; location?: string; status?: string }): Promise<JobRecord[]> {
      const url = new URL(`${API_BASE}/jobs`);
      if (filters?.search) url.searchParams.set("search", filters.search);
      if (filters?.department) url.searchParams.set("department", filters.department);
      if (filters?.location) url.searchParams.set("location", filters.location);
      if (filters?.status) url.searchParams.set("status", filters.status);

      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },

    async get(id: string): Promise<JobRecord> {
      const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error(`Job not found (${res.status})`);
      }
      return res.json();
    },

    async my(): Promise<JobRecord[]> {
      const res = await fetch(`${API_BASE}/jobs/recruiter/my`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },

    async create(jobData: {
      title: string;
      department: string;
      location: string;
      jobType: string;
      experienceLevel: string;
      salaryMin?: number;
      salaryMax?: number;
      description: string;
      requiredSkills: string[];
      preferredSkills?: string[];
    }): Promise<JobRecord> {
      const res = await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(jobData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create job posting");
      }
      return res.json();
    },

    async close(id: string): Promise<JobRecord> {
      const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}/close`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to close job requisition");
      return res.json();
    },

    async publish(id: string): Promise<JobRecord> {
      const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}/publish`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to publish job requisition");
      return res.json();
    },
  },

  // Applications
  applications: {
    async my(): Promise<ApplicationRecord[]> {
      const res = await fetch(`${API_BASE}/applications/my`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },

    async withdraw(id: string): Promise<ApplicationRecord> {
      const res = await fetch(`${API_BASE}/applications/${encodeURIComponent(id)}/withdraw`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to withdraw application");
      }
      return res.json();
    },

    async recruiter(jobId?: string): Promise<ApplicationRecord[]> {
      const url = new URL(`${API_BASE}/applications/recruiter`);
      if (jobId) url.searchParams.set("jobId", jobId);
      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },

    async get(id: string): Promise<ApplicationRecord> {
      const res = await fetch(`${API_BASE}/applications/${encodeURIComponent(id)}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error("Application not found");
      }
      return res.json();
    },

    async apply(dto: { jobId: string; coverLetter?: string; resumeId?: string }): Promise<ApplicationRecord> {
      const res = await fetch(`${API_BASE}/applications/apply`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(dto),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to submit application");
      }
      return res.json();
    },

    async updateStatus(id: string, status: string, notes?: string): Promise<ApplicationRecord> {
      const res = await fetch(`${API_BASE}/applications/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update application status");
      }
      return res.json();
    },
  },

  // Institutions Management
  institutions: {
    async list() {
      const res = await fetch(`${API_BASE}/institutions`);
      if (!res.ok) return [];
      return res.json();
    },

    async pending() {
      const res = await fetch(`${API_BASE}/institutions/pending`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },

    async approve(id: string) {
      const res = await fetch(`${API_BASE}/institutions/${encodeURIComponent(id)}/approve`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Approval failed");
      return res.json();
    },

    async reject(id: string) {
      const res = await fetch(`${API_BASE}/institutions/${encodeURIComponent(id)}/reject`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Rejection failed");
      return res.json();
    },

    async suspend(id: string) {
      const res = await fetch(`${API_BASE}/institutions/${encodeURIComponent(id)}/suspend`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Suspension failed");
      return res.json();
    },
  },

  // Admin
  admin: {
    async getUsers(search?: string, role?: string, status?: string) {
      const url = new URL(`${API_BASE}/admin/users`);
      if (search) url.searchParams.set("search", search);
      if (role) url.searchParams.set("role", role);
      if (status) url.searchParams.set("status", status);

      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },

    async updateUserStatus(id: string, status: "ACTIVE" | "SUSPENDED" | "REJECTED") {
      const res = await fetch(`${API_BASE}/admin/users/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update user status");
      return res.json();
    },

    async getAuditLogs(query?: string, entityType?: string, action?: string) {
      const url = new URL(`${API_BASE}/admin/audit-logs`);
      if (query) url.searchParams.set("query", query);
      if (entityType) url.searchParams.set("entityType", entityType);
      if (action) url.searchParams.set("action", action);

      const res = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },
  },

  // AI Intelligence Microservice
  ai: {
    async analyze(rawText: string, jobDescription: string = "", verifiedSkills: string[] = []) {
      const res = await fetch(`${AI_BASE}/api/v1/resumes/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText,
          jobDescription,
          verifiedSkills,
        }),
      });
      if (!res.ok) {
        throw new Error(`AI analysis failed (${res.status})`);
      }
      return res.json();
    },

    async parse(file: File) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${AI_BASE}/api/v1/resumes/parse`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Resume parsing failed (${res.status})`);
      }
      return res.json();
    },

    async match(candidateSkills: string[], requiredSkills: string[], verifiedSkills: string[] = []) {
      const res = await fetch(`${AI_BASE}/api/v1/jobs/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requiredSkills,
          preferredSkills: [],
          candidateSkills,
          verifiedSkills,
          candidateProjects: ["Production EIP-712 Registry", "Next.js Cryptographic Portal"],
        }),
      });
      if (!res.ok) {
        throw new Error("AI Job matching failed");
      }
      return res.json();
    },

    async health() {
      const res = await fetch(`${AI_BASE}/health`).catch(() => null);
      return res ? res.ok : false;
    },
  },
};
