"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  FileCheck,
  Building2,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function StudentApplicationsPage() {
  const applications = [
    {
      id: "app-001",
      jobTitle: "Senior Blockchain & Full-Stack Engineer",
      company: "Aether Cryptographic Labs",
      appliedDate: "Feb 12, 2025",
      status: "SHORTLISTED",
      aiMatchScore: 94,
      verifiedCredentialsCount: 2,
      recruiterNotes: "Candidate advanced to technical screen based on verified Stanford CS degree & cryptography background.",
    },
    {
      id: "app-002",
      jobTitle: "AI Verification Systems Engineer",
      company: "Veritas Security",
      appliedDate: "Feb 15, 2025",
      status: "UNDER_REVIEW",
      aiMatchScore: 88,
      verifiedCredentialsCount: 2,
      recruiterNotes: "Under review by Principal Trust Architect.",
    },
    {
      id: "app-003",
      jobTitle: "Frontend React / Next.js Engineer",
      company: "Nexus Decentralized Finance",
      appliedDate: "Feb 16, 2025",
      status: "APPLIED",
      aiMatchScore: 91,
      verifiedCredentialsCount: 2,
      recruiterNotes: "Application received and queued for initial evaluation.",
    },
  ];

  return (
    <DashboardShell
      role="STUDENT"
      title="My Applications"
      subtitle="Track active recruiter pipelines, status changes, and AI matching evaluations."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {applications.map((app) => (
            <Card key={app.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {app.company}
                    </span>
                    <Badge
                      variant={
                        app.status === "SHORTLISTED"
                          ? "verified"
                          : app.status === "UNDER_REVIEW"
                          ? "pending"
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
                    <span className="text-[10px] uppercase font-semibold text-brand-700 block">
                      AI Match
                    </span>
                    <span className="text-sm font-bold text-brand-900">
                      {app.aiMatchScore}% Fit
                    </span>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-right">
                    <span className="text-[10px] uppercase font-semibold text-emerald-700 block">
                      Proofs
                    </span>
                    <span className="text-sm font-bold text-emerald-900">
                      {app.verifiedCredentialsCount} Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                <p className="italic">
                  &quot;{app.recruiterNotes}&quot;
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="verified" size="sm" icon>
                    Proofs Attached
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
