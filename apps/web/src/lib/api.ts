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
      if (!res.ok) {
        return [];
      }
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

    async health() {
      const res = await fetch(`${AI_BASE}/health`).catch(() => null);
      return res ? res.ok : false;
    },
  },

  // Jobs
  jobs: {
    async list() {
      const res = await fetch(`${API_BASE}/jobs`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },

    async create(jobData: any) {
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
  },
};
