"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  FileCheck,
  Building2,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

interface ApplicationRecord {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "APPLIED" | "UNDER_REVIEW" | "SHORTLISTED" | "INTERVIEW" | "SELECTED" | "REJECTED" | "WITHDRAWN";
  aiMatchScore: number;
  verifiedCredentialsCount: number;
  recruiterNotes?: string;
  timeline: { step: string; completed: boolean; current: boolean }[];
}

export default function StudentApplicationsPage() {
  const [appToWithdraw, setAppToWithdraw] = React.useState<ApplicationRecord | null>(null);

  const [applications, setApplications] = React.useState<ApplicationRecord[]>([
    {
      id: "app-001",
      jobTitle: "Senior Blockchain & Full-Stack Engineer",
      company: "Aether Cryptographic Labs",
      appliedDate: "Feb 12, 2025",
      status: "SHORTLISTED",
      aiMatchScore: 94,
      verifiedCredentialsCount: 2,
      recruiterNotes: "Candidate advanced to technical screen based on verified Stanford CS degree & cryptography background.",
      timeline: [
        { step: "Applied", completed: true, current: false },
        { step: "Under Review", completed: true, current: false },
        { step: "Shortlisted", completed: true, current: true },
        { step: "Interview", completed: false, current: false },
        { step: "Decision", completed: false, current: false },
      ],
    },
    {
      id: "app-002",
      jobTitle: "AI Verification Systems Engineer",
      company: "Veritas Security",
      appliedDate: "Feb 15, 2025",
      status: "UNDER_REVIEW",
      aiMatchScore: 88,
      verifiedCredentialsCount: 2,
      recruiterNotes: "Under review by Principal Trust Architect. Code portfolio verified.",
      timeline: [
        { step: "Applied", completed: true, current: false },
        { step: "Under Review", completed: true, current: true },
        { step: "Shortlisted", completed: false, current: false },
        { step: "Interview", completed: false, current: false },
        { step: "Decision", completed: false, current: false },
      ],
    },
    {
      id: "app-003",
      jobTitle: "Frontend React / Next.js Engineer",
      company: "Nexus Decentralized Finance",
      appliedDate: "Feb 16, 2025",
      status: "APPLIED",
      aiMatchScore: 91,
      verifiedCredentialsCount: 2,
      recruiterNotes: "Application received and queued for recruiter evaluation.",
      timeline: [
        { step: "Applied", completed: true, current: true },
        { step: "Under Review", completed: false, current: false },
        { step: "Shortlisted", completed: false, current: false },
        { step: "Interview", completed: false, current: false },
        { step: "Decision", completed: false, current: false },
      ],
    },
  ]);

  const confirmWithdraw = () => {
    if (appToWithdraw) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === appToWithdraw.id
            ? {
                ...a,
                status: "WITHDRAWN",
                recruiterNotes: "Candidate withdrew this application.",
                timeline: a.timeline.map((t) => ({ ...t, current: false })),
              }
            : a
        )
      );
      setAppToWithdraw(null);
    }
  };

  return (
    <DashboardShell
      role="STUDENT"
      title="My Applications Pipeline"
      subtitle="Track your active job applications, recruiter review stages, and verified credential shortlisting status."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {app.company}
                    </span>
                    <Badge
                      variant={
                        app.status === "SHORTLISTED" || app.status === "SELECTED"
                          ? "verified"
                          : app.status === "UNDER_REVIEW"
                          ? "pending"
                          : app.status === "WITHDRAWN" || app.status === "REJECTED"
                          ? "revoked"
                          : "neutral"
                      }
                      size="sm"
                    >
                      {app.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {app.jobTitle}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Applied on {app.appliedDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-brand-50 border border-brand-200 px-3 py-1.5 text-right">
                    <span className="text-[10px] uppercase font-bold text-brand-700 block">
                      AI Match
                    </span>
                    <span className="text-sm font-extrabold text-brand-900">
                      {app.aiMatchScore}% Fit
                    </span>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                      Proofs
                    </span>
                    <span className="text-sm font-extrabold text-emerald-900">
                      {app.verifiedCredentialsCount} Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Stage Tracker */}
              {app.status !== "WITHDRAWN" && app.status !== "REJECTED" && (
                <div className="py-4 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Application Stage
                  </span>
                  <div className="flex items-center justify-between gap-1 sm:gap-2">
                    {app.timeline.map((step, idx) => (
                      <div key={step.step} className="flex-1 flex flex-col items-center text-center">
                        <div
                          className={`h-2 w-full rounded-full mb-1.5 ${
                            step.completed
                              ? "bg-brand-600"
                              : step.current
                              ? "bg-brand-400 animate-pulse"
                              : "bg-slate-200"
                          }`}
                        />
                        <span
                          className={`text-[10px] sm:text-xs font-semibold ${
                            step.current
                              ? "text-brand-700 font-bold"
                              : step.completed
                              ? "text-slate-800"
                              : "text-slate-400"
                          }`}
                        >
                          {step.step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recruiter feedback & actions */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                <p className="italic max-w-xl">
                  {app.recruiterNotes ? `"${app.recruiterNotes}"` : "Awaiting recruiter review."}
                </p>

                <div className="flex items-center gap-2 shrink-0">
                  {app.status !== "WITHDRAWN" && app.status !== "SELECTED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAppToWithdraw(app)}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      Withdraw Application
                    </Button>
                  )}
                  <Badge variant="verified" size="sm" icon>
                    Proofs Attached
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Confirmation Modal for Withdrawing Application */}
      {appToWithdraw && (
        <Modal
          isOpen={true}
          onClose={() => setAppToWithdraw(null)}
          title={`Withdraw Application: ${appToWithdraw.jobTitle}`}
        >
          <div className="space-y-4 py-2">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>
                Withdrawing your application will remove you from active consideration for <strong>{appToWithdraw.jobTitle}</strong> at <strong>{appToWithdraw.company}</strong>. You will need to submit a new application if you change your mind.
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to proceed with withdrawing?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setAppToWithdraw(null)}>
                Keep Application
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={confirmWithdraw}
                className="bg-rose-600 hover:bg-rose-700"
              >
                Confirm Withdrawal
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
