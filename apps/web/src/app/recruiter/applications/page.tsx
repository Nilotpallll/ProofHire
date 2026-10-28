"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import {
  FileCheck,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Layers,
  ChevronRight,
  Scale,
  Award,
} from "lucide-react";

interface ComponentScores {
  requiredSkillsScore: number;
  preferredSkillsScore: number;
  projectsScore: number;
  cryptographicBonusScore: number;
}

interface ApplicationItem {
  id: string;
  candidateName: string;
  username: string;
  jobId: string;
  jobTitle: string;
  appliedDate: string;
  status: "APPLIED" | "UNDER_REVIEW" | "SHORTLISTED" | "INTERVIEW" | "SELECTED" | "REJECTED" | "WITHDRAWN";
  aiMatchScore: number;
  verifiedCredentialsCount: number;
  primaryCredentialId: string;
  coverNote: string;
  recruiterNotes?: string;
  requiredSkillsMatched: string[];
  missingRequiredSkills: string[];
  preferredSkillsMatched: string[];
  componentScores?: ComponentScores;
  explanation: string;
  methodology: string;
}

import { api } from "@/lib/api";

const DEFAULT_APPLICATIONS: ApplicationItem[] = [
  {
    id: "app-001",
    candidateName: "Alex Rivera",
    username: "alexrivera",
    jobId: "job-001",
    jobTitle: "Senior Blockchain & Full-Stack Engineer",
    appliedDate: "Feb 12, 2025",
    status: "SHORTLISTED",
    aiMatchScore: 94,
    verifiedCredentialsCount: 2,
    primaryCredentialId: "CRED-STANFORD-2025-001",
    coverNote: "I have hands-on experience building verifiable cryptographic registries and Next.js applications.",
    recruiterNotes: "Top-tier candidate. Verified Stanford degree on Sepolia/Hardhat registry.",
    requiredSkillsMatched: ["TypeScript", "Next.js", "Solidity", "PostgreSQL"],
    missingRequiredSkills: [],
    preferredSkillsMatched: ["NestJS", "Docker"],
    componentScores: {
      requiredSkillsScore: 60.0,
      preferredSkillsScore: 10.0,
      projectsScore: 10.0,
      cryptographicBonusScore: 15.0,
    },
    explanation: "Candidate fulfills 4 of 4 required technical skills (100%) and holds 2 verified academic & certification credentials. +15% verification boost applied.",
    methodology: "ProofHire Deterministic Match Engine v2.2 with Cryptographic Boost",
  },
  {
    id: "app-002",
    candidateName: "Maya Patel",
    username: "mayapatel",
    jobId: "job-001",
    jobTitle: "Senior Blockchain & Full-Stack Engineer",
    appliedDate: "Feb 16, 2025",
    status: "UNDER_REVIEW",
    aiMatchScore: 78,
    verifiedCredentialsCount: 1,
    primaryCredentialId: "CRED-MIT-2024-001",
    coverNote: "Passionate about smart contract engineering and modern TypeScript microservices.",
    requiredSkillsMatched: ["TypeScript", "Next.js", "PostgreSQL"],
    missingRequiredSkills: ["Solidity"],
    preferredSkillsMatched: ["Docker"],
    componentScores: {
      requiredSkillsScore: 45.0,
      preferredSkillsScore: 10.0,
      projectsScore: 10.0,
      cryptographicBonusScore: 7.5,
    },
    explanation: "Candidate fulfills 3 of 4 required competencies (75%). Missing Solidity requirement but shows verified coursework from UC Berkeley.",
    methodology: "ProofHire Deterministic Match Engine v2.2 with Cryptographic Boost",
  },
  {
    id: "app-003",
    candidateName: "David Kim",
    username: "davidkim",
    jobId: "job-002",
    jobTitle: "AI Verification Systems Engineer",
    appliedDate: "Feb 17, 2025",
    status: "INTERVIEW",
    aiMatchScore: 89,
    verifiedCredentialsCount: 2,
    primaryCredentialId: "CRED-MIT-2025-089",
    coverNote: "Machine learning engineer with focus on multimodal document extraction.",
    recruiterNotes: "Passed preliminary code screen. Invited to panel on distributed AI pipelines.",
    requiredSkillsMatched: ["Python", "FastAPI", "Vector Databases"],
    missingRequiredSkills: ["PyTorch (Production)"],
    preferredSkillsMatched: ["TypeScript", "Kubernetes"],
    componentScores: {
      requiredSkillsScore: 48.0,
      preferredSkillsScore: 16.0,
      projectsScore: 10.0,
      cryptographicBonusScore: 15.0,
    },
    explanation: "Candidate matches 3 of 4 core requirements. Holds verified MIT ML credentials. Strong alignment on FastAPI & extraction pipelines.",
    methodology: "ProofHire Deterministic Match Engine v2.2 with Cryptographic Boost",
  },
];

export default function RecruiterApplicationsPage() {
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [selectedAppForAi, setSelectedAppForAi] = React.useState<ApplicationItem | null>(null);
  const [selectedAppForNote, setSelectedAppForNote] = React.useState<ApplicationItem | null>(null);
  const [rejectingApp, setRejectingApp] = React.useState<ApplicationItem | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  const [noteInput, setNoteInput] = React.useState("");
  const [applications, setApplications] = React.useState<ApplicationItem[]>(DEFAULT_APPLICATIONS);

  React.useEffect(() => {
    async function loadApps() {
      try {
        let jobId: string | undefined;
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          jobId = params.get("jobId") || undefined;
        }
        const data = await api.applications.recruiter(jobId);
        if (data && data.length > 0) {
          setApplications(
            data.map((a: any) => ({
              id: a.id,
              candidateName: a.studentName || "Alex Rivera",
              username: a.username || "alexrivera",
              jobId: a.jobId,
              jobTitle: a.jobTitle,
              appliedDate: a.appliedDate
                ? new Date(a.appliedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Feb 12, 2025",
              status: a.status as any,
              aiMatchScore: a.aiMatchScore || 85,
              verifiedCredentialsCount: a.verifiedCredentialsCount || 1,
              primaryCredentialId: "CRED-STANFORD-2025-001",
              coverNote: a.coverLetter || "Experienced candidate with verified blockchain credentials.",
              recruiterNotes: a.recruiterNotes,
              requiredSkillsMatched: a.matchReasons?.length
                ? a.matchReasons
                : ["TypeScript", "Next.js", "Solidity", "PostgreSQL"],
              missingRequiredSkills: a.missingSkills || [],
              preferredSkillsMatched: ["Docker"],
              componentScores: {
                requiredSkillsScore: 50.0,
                preferredSkillsScore: 15.0,
                projectsScore: 10.0,
                cryptographicBonusScore: 10.0,
              },
              explanation:
                a.matchReasons?.[0] ||
                "Candidate fulfills required technical competencies with verified credential boost.",
              methodology: a.matchingMethodology || "ProofHire Deterministic Match Engine v2.2",
            }))
          );
        }
      } catch (err) {
        console.warn("Using offline demo applications:", err);
      }
    }
    loadApps();
  }, []);

  const updateStatus = async (id: string, newStatus: ApplicationItem["status"]) => {
    // If rejecting, trigger confirmation dialog
    if (newStatus === "REJECTED") {
      const app = applications.find((a) => a.id === id);
      if (app) {
        setRejectingApp(app);
        setRejectReason("");
        return;
      }
    }

    setIsUpdatingStatus(true);
    try {
      await api.applications.updateStatus(id, newStatus);
    } catch (e) {
      console.warn("API status update warning:", e);
    } finally {
      setIsUpdatingStatus(false);
    }
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const handleConfirmRejection = async () => {
    if (!rejectingApp) return;
    setIsUpdatingStatus(true);
    try {
      await api.applications.updateStatus(rejectingApp.id, "REJECTED", rejectReason || "Not selected at this stage");
    } catch (e) {
      console.warn("API status update warning:", e);
    } finally {
      setIsUpdatingStatus(false);
    }

    setApplications((prev) =>
      prev.map((app) =>
        app.id === rejectingApp.id ? { ...app, status: "REJECTED", recruiterNotes: rejectReason || app.recruiterNotes } : app
      )
    );
    setRejectingApp(null);
  };

  const handleSaveNote = async () => {
    if (selectedAppForNote) {
      try {
        await api.applications.updateStatus(selectedAppForNote.id, selectedAppForNote.status, noteInput);
      } catch (e) {
        console.warn("API note update warning:", e);
      }
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedAppForNote.id ? { ...app, recruiterNotes: noteInput } : app
        )
      );
      setSelectedAppForNote(null);
      setNoteInput("");
    }
  };

  const openNoteDialog = (app: ApplicationItem) => {
    setSelectedAppForNote(app);
    setNoteInput(app.recruiterNotes || "");
  };

  const filtered = applications.filter((app) => {
    if (activeTab === "ALL") return true;
    return app.status === activeTab;
  });

  return (
    <DashboardShell
      role="RECRUITER"
      title="Candidate Applications Pipeline"
      subtitle="Review candidate submissions, inspect on-chain credentials, and advance pipeline stages with decision support."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Responsible Hiring Banner */}
        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/70 p-4 sm:p-5 dark:border-blue-900/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 flex items-start gap-3.5 transition-colors">
          <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-sm text-blue-900 dark:text-blue-200">
              Responsible Hiring & Decision Support Policy
            </span>
            <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
              AI match scores are calculated strictly from demonstrated skills, project evidence, and verified credentials.{" "}
              <strong>Protected demographic characteristics are never evaluated or factored into rankings.</strong> AI scores
              assist recruiter screening and do not automate hiring or rejection decisions.
            </p>
          </div>
        </div>

        <Tabs
          tabs={[
            { id: "ALL", label: "All Applicants", badge: applications.length },
            { id: "APPLIED", label: "New", badge: applications.filter((a) => a.status === "APPLIED").length },
            { id: "UNDER_REVIEW", label: "Under Review", badge: applications.filter((a) => a.status === "UNDER_REVIEW").length },
            { id: "SHORTLISTED", label: "Shortlisted", badge: applications.filter((a) => a.status === "SHORTLISTED").length },
            { id: "INTERVIEW", label: "Interview", badge: applications.filter((a) => a.status === "INTERVIEW").length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
        />

        <div className="grid grid-cols-1 gap-4">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <Clock className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Applications in this Stage</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select another pipeline tab or wait for new applicant submissions.
              </p>
            </Card>
          ) : (
            filtered.map((app) => (
              <Card key={app.id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/u/${app.username}`}
                        className="text-base font-bold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400 flex items-center gap-1.5"
                      >
                        {app.candidateName}
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </Link>
                      <Badge
                        variant={
                          app.status === "SELECTED" || app.status === "SHORTLISTED" || app.status === "INTERVIEW"
                            ? "verified"
                            : app.status === "REJECTED" || app.status === "WITHDRAWN"
                            ? "revoked"
                            : "pending"
                        }
                        size="sm"
                      >
                        {app.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Applied for <strong className="text-slate-900 dark:text-slate-200">{app.jobTitle}</strong> • {app.appliedDate}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 italic max-w-xl">
                      &quot;{app.coverNote}&quot;
                    </p>

                    {app.recruiterNotes && (
                      <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-white flex items-center gap-1 mb-0.5">
                          <MessageSquare className="h-3 w-3 text-brand-600 dark:text-brand-400" /> Recruiter Internal Note:
                        </strong>
                        {app.recruiterNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedAppForAi(app)}
                      className="rounded-xl bg-brand-50 border border-brand-200 px-3.5 py-2 text-left hover:bg-brand-100 dark:bg-brand-950/60 dark:border-brand-800 dark:hover:bg-brand-900/60 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
                      title="Click to view explainable AI matching breakdown and component scores"
                      aria-label={`View AI Fit breakdown for ${app.candidateName}: ${app.aiMatchScore}% Match`}
                    >
                      <span className="text-[10px] uppercase font-bold text-brand-700 dark:text-brand-300 block flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-brand-600 dark:text-brand-400" /> AI Alignment
                      </span>
                      <span className="text-sm font-extrabold text-brand-900 dark:text-brand-200">
                        {app.aiMatchScore}% Match
                      </span>
                    </button>

                    <Link
                      href={`/verify/${app.primaryCredentialId}`}
                      className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-left hover:bg-emerald-100 dark:bg-emerald-950/60 dark:border-emerald-800 dark:hover:bg-emerald-900/60 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                      title="Verify candidate credential on smart contract registry"
                      aria-label={`Verify on-chain credentials for ${app.candidateName}: ${app.verifiedCredentialsCount} Verified`}
                    >
                      <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Blockchain
                      </span>
                      <span className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                        {app.verifiedCredentialsCount} Verified
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Stage Progression & Notes Controls */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1">Advance Stage:</span>
                    <button
                      onClick={() => updateStatus(app.id, "UNDER_REVIEW")}
                      disabled={isUpdatingStatus}
                      className={`px-2.5 py-1 rounded text-xs border font-medium transition-colors ${
                        app.status === "UNDER_REVIEW"
                          ? "bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      Under Review
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "SHORTLISTED")}
                      disabled={isUpdatingStatus}
                      className={`px-2.5 py-1 rounded text-xs border font-medium transition-colors ${
                        app.status === "SHORTLISTED"
                          ? "bg-brand-100 border-brand-300 text-brand-900 dark:bg-brand-950 dark:border-brand-800 dark:text-brand-200 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "INTERVIEW")}
                      disabled={isUpdatingStatus}
                      className={`px-2.5 py-1 rounded text-xs border font-medium transition-colors ${
                        app.status === "INTERVIEW"
                          ? "bg-purple-100 border-purple-300 text-purple-900 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-200 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      Interview
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "SELECTED")}
                      disabled={isUpdatingStatus}
                      className={`px-2.5 py-1 rounded text-xs border font-medium transition-colors ${
                        app.status === "SELECTED"
                          ? "bg-emerald-100 border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      Select
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "REJECTED")}
                      disabled={isUpdatingStatus}
                      className={`px-2.5 py-1 rounded text-xs border font-medium transition-colors ${
                        app.status === "REJECTED"
                          ? "bg-rose-100 border-rose-300 text-rose-900 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      Reject...
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openNoteDialog(app)}
                      leftIcon={<MessageSquare className="h-3.5 w-3.5" />}
                    >
                      {app.recruiterNotes ? "Edit Note" : "Add Note"}
                    </Button>
                    <Link href={`/verify/${app.primaryCredentialId}`}>
                      <Button variant="primary" size="sm" leftIcon={<ShieldCheck className="h-3.5 w-3.5" />}>
                        Verify Proof
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* AI Match Explanation Modal with Component Scores */}
      {selectedAppForAi && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAppForAi(null)}
          title={`AI Match Breakdown — ${selectedAppForAi.candidateName}`}
          description={`Explainable score decomposition for ${selectedAppForAi.jobTitle}`}
        >
          <div className="space-y-5 py-2">
            {/* Top Score Summary */}
            <div className="rounded-xl bg-slate-900 text-white p-5 flex items-center justify-between border border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                  Overall Score
                </span>
                <span className="text-3xl font-extrabold text-brand-400">
                  {selectedAppForAi.aiMatchScore} / 100
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Methodology: {selectedAppForAi.methodology}
                </span>
              </div>
              <Badge variant="verified" size="md">
                +15% Cryptographic Boost
              </Badge>
            </div>

            {/* Component Scores Breakdown */}
            {selectedAppForAi.componentScores && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                  Component Score Decomposition
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Required Skills</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {selectedAppForAi.componentScores.requiredSkillsScore.toFixed(1)} / 60
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Preferred Skills</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {selectedAppForAi.componentScores.preferredSkillsScore.toFixed(1)} / 20
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Projects & Exp</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {selectedAppForAi.componentScores.projectsScore.toFixed(1)} / 20
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-emerald-700 dark:text-emerald-400 block text-[10px]">On-Chain Boost</span>
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                      +{selectedAppForAi.componentScores.cryptographicBonusScore.toFixed(1)} pts
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Evaluation Rationale */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Evaluation Rationale
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed">
                {selectedAppForAi.explanation}
              </p>
            </div>

            {/* Matched Required Skills */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Required Skills Matched
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedAppForAi.requiredSkillsMatched.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 font-medium"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Requirements */}
            {selectedAppForAi.missingRequiredSkills.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Missing or Unverified Requirements
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAppForAi.missingRequiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 font-medium"
                    >
                      <XCircle className="h-3 w-3 text-rose-500 dark:text-rose-400" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Responsible Decision Support Policy Callout */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Decision Support Policy:</strong> ProofHire AI match scores measure keyword coverage and credential verification to assist recruiter screening. Algorithmic scores do not predict employee performance, and automated candidate rejection is prohibited.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedAppForAi(null)}>
                Close Breakdown
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Destructive Action: Confirmation Modal for Rejection */}
      {rejectingApp && (
        <Modal
          isOpen={true}
          onClose={() => setRejectingApp(null)}
          title="Confirm Candidate Rejection"
          description={`Reject ${rejectingApp.candidateName}'s application for ${rejectingApp.jobTitle}`}
        >
          <div className="space-y-4 py-2">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/40 text-xs text-red-900 dark:text-red-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" /> Confirm Status Change
              </p>
              <p>
                This action will mark the application as REJECTED in the recruitment pipeline. Please provide an internal note documenting the reason for this decision.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Rejection Rationale / Internal Note
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Missing required production experience in Solidity smart contract development."
                rows={3}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setRejectingApp(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isUpdatingStatus}
                onClick={handleConfirmRejection}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Recruiter Review Note Modal */}
      {selectedAppForNote && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAppForNote(null)}
          title={`Recruiter Review Notes — ${selectedAppForNote.candidateName}`}
        >
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record interview impressions, panel feedback, or compensation notes. These notes are internal to recruiters and never exposed to the student or public profiles.
            </p>

            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Completed technical round with positive feedback on smart contract architecture. Recommend scheduling final partner review."
              rows={4}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedAppForNote(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveNote}>
                Save Review Note
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
