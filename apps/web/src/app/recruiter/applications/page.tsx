"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import {
  FileCheck,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function RecruiterApplicationsPage() {
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [applications, setApplications] = React.useState([
    {
      id: "app-001",
      candidateName: "Alex Rivera",
      username: "alexrivera",
      jobTitle: "Senior Blockchain & Full-Stack Engineer",
      appliedDate: "Feb 12, 2025",
      status: "SHORTLISTED",
      aiMatchScore: 94,
      verifiedCredentialsCount: 2,
      coverNote: "I have hands-on experience building verifiable cryptographic registries and Next.js applications.",
    },
    {
      id: "app-002",
      candidateName: "Maya Patel",
      username: "mayapatel",
      jobTitle: "Senior Blockchain & Full-Stack Engineer",
      appliedDate: "Feb 16, 2025",
      status: "UNDER_REVIEW",
      aiMatchScore: 78,
      verifiedCredentialsCount: 1,
      coverNote: "Passionate about smart contract engineering and modern TypeScript microservices.",
    },
    {
      id: "app-003",
      candidateName: "David Kim",
      username: "davidkim",
      jobTitle: "AI Verification Systems Engineer",
      appliedDate: "Feb 17, 2025",
      status: "INTERVIEW",
      aiMatchScore: 89,
      verifiedCredentialsCount: 2,
      coverNote: "Machine learning engineer with focus on multimodal document extraction.",
    },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
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
            { id: "UNDER_REVIEW", label: "Under Review" },
            { id: "SHORTLISTED", label: "Shortlisted" },
            { id: "INTERVIEW", label: "Interview" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
        />

        <div className="grid grid-cols-1 gap-4">
          {filtered.map((app) => (
            <Card key={app.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/u/${app.username}`}
                      className="text-base font-bold text-slate-900 hover:text-brand-600"
                    >
                      {app.candidateName}
                    </Link>
                    <Badge
                      variant={
                        app.status === "INTERVIEW" || app.status === "SHORTLISTED"
                          ? "verified"
                          : "pending"
                      }
                      size="sm"
                    >
                      {app.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    Applied for <strong>{app.jobTitle}</strong> • {app.appliedDate}
                  </p>

                  <p className="text-xs text-slate-500 italic max-w-xl">
                    &quot;{app.coverNote}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-brand-50 border border-brand-200 px-3 py-1 text-right">
                    <span className="text-[10px] uppercase font-semibold text-brand-700 block">
                      AI Match
                    </span>
                    <span className="text-sm font-bold text-brand-900">
                      {app.aiMatchScore}% Fit
                    </span>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-right">
                    <span className="text-[10px] uppercase font-semibold text-emerald-700 block">
                      Proofs
                    </span>
                    <span className="text-sm font-bold text-emerald-900">
                      {app.verifiedCredentialsCount} Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Stage Progression Controls */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-500">Move Stage:</span>
                  <button
                    onClick={() => updateStatus(app.id, "UNDER_REVIEW")}
                    className={`px-2 py-1 rounded text-xs border font-medium ${
                      app.status === "UNDER_REVIEW"
                        ? "bg-amber-100 border-amber-300 text-amber-900 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Under Review
                  </button>
                  <button
                    onClick={() => updateStatus(app.id, "SHORTLISTED")}
                    className={`px-2 py-1 rounded text-xs border font-medium ${
                      app.status === "SHORTLISTED"
                        ? "bg-brand-100 border-brand-300 text-brand-900 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => updateStatus(app.id, "INTERVIEW")}
                    className={`px-2 py-1 rounded text-xs border font-medium ${
                      app.status === "INTERVIEW"
                        ? "bg-emerald-100 border-emerald-300 text-emerald-900 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Schedule Interview
                  </button>
                </div>

                <Link href={`/u/${app.username}`}>
                  <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3 w-3" />}>
                    View Verified Candidate
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
