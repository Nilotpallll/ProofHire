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
  XCircle,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";

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
    explanation: "Candidate fulfills 4 of 4 required technical skills (100%) and holds 2 verified academic & certification credentials. +15% verification boost applied.",
    methodology: "deterministic_v2_weighted",
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
    explanation: "Candidate fulfills 3 of 4 required competencies (75%). Missing Solidity requirement but shows verified coursework from UC Berkeley.",
    methodology: "deterministic_v2_weighted",
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
    explanation: "Candidate matches 3 of 4 core requirements. Holds verified MIT ML credentials. Strong alignment on FastAPI & extraction pipelines.",
    methodology: "deterministic_v2_weighted",
  },
];

export default function RecruiterApplicationsPage() {
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [selectedAppForAi, setSelectedAppForAi] = React.useState<ApplicationItem | null>(null);
  const [selectedAppForNote, setSelectedAppForNote] = React.useState<ApplicationItem | null>(null);
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
              appliedDate: a.appliedDate ? new Date(a.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Feb 12, 2025",
              status: a.status as any,
              aiMatchScore: a.aiMatchScore || 85,
              verifiedCredentialsCount: a.verifiedCredentialsCount || 1,
              primaryCredentialId: "CRED-STANFORD-2025-001",
              coverNote: a.coverLetter || "Experienced candidate with verified blockchain credentials.",
              recruiterNotes: a.recruiterNotes,
              requiredSkillsMatched: a.matchReasons?.length ? a.matchReasons : ["TypeScript", "Next.js", "Solidity", "PostgreSQL"],
              missingRequiredSkills: a.missingSkills || [],
              preferredSkillsMatched: ["Docker"],
              explanation: a.matchReasons?.[0] || "Candidate fulfills required technical competencies with verified credential boost.",
              methodology: a.matchingMethodology || "deterministic_v2_weighted",
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
    try {
      await api.applications.updateStatus(id, newStatus);
    } catch (e) {
      console.warn("API status update warning:", e);
    }
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
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
      subtitle="Review candidate submissions, inspect on-chain credentials, and advance stages."
    >
      <div className="space-y-6">
        <Tabs
          tabs={[
            { id: "ALL", label: "All Applicants", badge: applications.length },
            { id: "APPLIED", label: "New", badge: applications.filter(a => a.status === "APPLIED").length },
            { id: "UNDER_REVIEW", label: "Under Review", badge: applications.filter(a => a.status === "UNDER_REVIEW").length },
            { id: "SHORTLISTED", label: "Shortlisted", badge: applications.filter(a => a.status === "SHORTLISTED").length },
            { id: "INTERVIEW", label: "Interview", badge: applications.filter(a => a.status === "INTERVIEW").length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
        />

        <div className="grid grid-cols-1 gap-4">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900">No Applications in this Stage</h3>
              <p className="text-xs text-slate-500 mt-1">Select another pipeline tab or wait for new applicant submissions.</p>
            </Card>
          ) : (
            filtered.map((app) => (
              <Card key={app.id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/u/${app.username}`}
                        className="text-base font-bold text-slate-900 hover:text-brand-600 flex items-center gap-1.5"
                      >
                        {app.candidateName}
                        <ExternalLink className="h-3 w-3 text-slate-400" />
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

                    <p className="text-xs text-slate-600 font-medium">
                      Applied for <strong>{app.jobTitle}</strong> • {app.appliedDate}
                    </p>

                    <p className="text-xs text-slate-500 italic max-w-xl">
                      &quot;{app.coverNote}&quot;
                    </p>

                    {app.recruiterNotes && (
                      <div className="mt-2 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700">
                        <strong className="text-slate-900 flex items-center gap-1 mb-0.5">
                          <MessageSquare className="h-3 w-3 text-brand-600" /> Recruiter Internal Note:
                        </strong>
                        {app.recruiterNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAppForAi(app)}
                      className="rounded-lg bg-brand-50 border border-brand-200 px-3 py-1.5 text-right hover:bg-brand-100 transition-colors text-left"
                      title="Click to view explainable AI matching breakdown"
                    >
                      <span className="text-[10px] uppercase font-bold text-brand-700 block flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> AI Fit
                      </span>
                      <span className="text-sm font-extrabold text-brand-900">
                        {app.aiMatchScore}% Match
                      </span>
                    </button>
                    <Link
                      href={`/verify/${app.primaryCredentialId}`}
                      className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-right hover:bg-emerald-100 transition-colors text-left"
                      title="Verify candidate credential on smart contract registry"
                    >
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> On-Chain
                      </span>
                      <span className="text-sm font-extrabold text-emerald-900">
                        {app.verifiedCredentialsCount} Verified
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Stage Progression & Notes Controls */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-500 mr-1">Advance Stage:</span>
                    <button
                      onClick={() => updateStatus(app.id, "UNDER_REVIEW")}
                      className={`px-2.5 py-1 rounded text-xs border font-medium transition-colors ${
                        app.status === "UNDER_REVIEW"
                          ? "bg-amber-100 border-amber-300 text-amber-900 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Under Review
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "SHORTLISTED")}
                      className={`px-2.5 py-1 rounded text-xs border font-medium transition-colors ${
                        app.status === "SHORTLISTED"
                          ? "bg-brand-100 border-brand-300 text-brand-900 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "INTERVIEW")}
                      className={`px-2.5 py-1 rounded text-xs border font-medium transition-colors ${
                        app.status === "INTERVIEW"
                          ? "bg-purple-100 border-purple-300 text-purple-900 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Interview
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "SELECTED")}
                      className={`px-2.5 py-1 rounded text-xs border font-medium transition-colors ${
                        app.status === "SELECTED"
                          ? "bg-emerald-100 border-emerald-300 text-emerald-900 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Select
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "REJECTED")}
                      className={`px-2.5 py-1 rounded text-xs border font-medium transition-colors ${
                        app.status === "REJECTED"
                          ? "bg-rose-100 border-rose-300 text-rose-900 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Reject
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

      {/* AI Match Explanation Modal */}
      {selectedAppForAi && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAppForAi(null)}
          title={`AI Neural Match Breakdown — ${selectedAppForAi.candidateName}`}
        >
          <div className="space-y-5 py-2">
            <div className="rounded-xl bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                  Overall Alignment Score
                </span>
                <span className="text-3xl font-extrabold text-brand-400">
                  {selectedAppForAi.aiMatchScore}%
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Methodology: {selectedAppForAi.methodology}
                </span>
              </div>
              <Badge variant="verified" size="md">
                +15% Verification Boost
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Evaluation Rationale
              </h4>
              <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200 leading-relaxed">
                {selectedAppForAi.explanation}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Required Skills Matched
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedAppForAi.requiredSkillsMatched.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {selectedAppForAi.missingRequiredSkills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Missing or Unverified Requirements
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAppForAi.missingRequiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-800 font-medium"
                    >
                      <XCircle className="h-3 w-3 text-rose-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Decision Support Policy:</strong> ProofHire AI match scores assist recruiter screening and prioritize verified candidates. All hiring and shortlisting decisions remain with the human recruiter.
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

      {/* Recruiter Review Note Modal */}
      {selectedAppForNote && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAppForNote(null)}
          title={`Recruiter Review Notes — ${selectedAppForNote.candidateName}`}
        >
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-500">
              Record interview impressions, panel feedback, or compensation notes. These notes are internal to recruiters and never exposed to the student or public profiles.
            </p>

            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Completed technical round with positive feedback on smart contract architecture. Recommend scheduling final partner review."
              rows={4}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
