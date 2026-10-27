// ProofHire Domain Types & Enums

export enum UserRole {
  STUDENT = 'STUDENT',
  RECRUITER = 'RECRUITER',
  INSTITUTION = 'INSTITUTION',
  ADMIN = 'ADMIN',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

export enum InstitutionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum CredentialStatus {
  PENDING = 'PENDING',
  ISSUED = 'ISSUED',
  REVOKED = 'REVOKED',
}

export enum CredentialType {
  DEGREE = 'DEGREE',
  DIPLOMA = 'DIPLOMA',
  CERTIFICATE = 'CERTIFICATE',
  BADGE = 'BADGE',
  INTERNSHIP = 'INTERNSHIP',
  TRANSCRIPT = 'TRANSCRIPT',
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW = 'INTERVIEW',
  SELECTED = 'SELECTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  REMOTE = 'REMOTE',
}

export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
}

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  createdAt: string;
}

export interface StudentProfileData {
  id: string;
  userId: string;
  headline?: string;
  bio?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  gpa?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  verifiedCredentialsCount: number;
}

export interface RecruiterProfileData {
  id: string;
  userId: string;
  companyName: string;
  companyWebsite?: string;
  designation?: string;
  industry?: string;
  verifiedCompany: boolean;
}

export interface InstitutionData {
  id: string;
  name: string;
  code: string;
  website?: string;
  status: InstitutionStatus;
  contactEmail: string;
  contactPhone?: string;
  logoUrl?: string;
  verifiedAt?: string;
  totalIssued: number;
}

export interface CredentialData {
  id: string;
  credentialId: string; // Public identifier or cryptographic hash
  title: string;
  type: CredentialType;
  recipientId: string;
  recipientName: string;
  recipientEmail?: string;
  institutionId: string;
  institutionName: string;
  institutionCode: string;
  issueDate: string;
  expiryDate?: string;
  status: CredentialStatus;
  ipfsHash?: string;
  merkleRoot?: string;
  txHash?: string;
  blockNumber?: number;
  gradeOrScore?: string;
  skills: string[];
  metadata?: Record<string, unknown>;
  revocationReason?: string;
  revokedAt?: string;
}

export interface PublicVerificationResult {
  isValid: boolean;
  credential?: CredentialData;
  verificationTimestamp: string;
  issuerVerified: boolean;
  blockchainConfirmed: boolean;
  blockchainNetwork?: string;
  contractAddress?: string;
  message?: string;
}

export interface JobListing {
  id: string;
  recruiterId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  department: string;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  requiredSkills: string[];
  preferredSkills?: string[];
  applicantsCount: number;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: ApplicationStatus;
  appliedDate: string;
  coverLetter?: string;
  resumeUrl?: string;
  aiMatchScore?: number;
  matchReasons?: string[];
  missingSkills?: string[];
  verifiedCredentialsCount: number;
}

export interface ResumeAnalysisResult {
  score: number; // 0-100
  summary: string;
  detectedSkills: string[];
  verifiedSkills: string[];
  unverifiedSkills: string[];
  strengths: string[];
  improvements: string[];
  recommendedRoles: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  role?: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress?: string;
  details?: Record<string, unknown>;
}
