"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CredentialStatusIndicator } from "@/components/ui/CredentialStatusIndicator";
import {
  Award,
  FileText,
  Briefcase,
  Eye,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { api } from "@/lib/api";

export default function StudentDashboardPage() {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [credentials, setCredentials] = React.useState<any[]>([]);
  const [applications, setApplications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [creds, apps] = await Promise.all([
          api.credentials.my().catch(() => []),
          api.applications.my().catch(() => []),
        ]);
        if (creds && Array.isArray(creds) && creds.length > 0) {
          setCredentials(creds);
        }
        if (apps && Array.isArray(apps) && apps.length > 0) {
          setApplications(apps);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/u/alexrivera`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <DashboardShell
      role="STUDENT"
      title="Student Overview"
      subtitle="Track your verified academic credentials, AI resume scores, and recruitment pipeline."
      actions={
        <div className="flex items-center gap-2">
          <Button
            onClick={copyProfileLink}
            variant="outline"
            size="sm"
            leftIcon={<Share2 className="h-3.5 w-3.5" />}
          >
            {copiedLink ? "Link Copied!" : "Public Profile Link"}
          </Button>
          <Link href="/student/credentials">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              My Credentials
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Profile Completion Callout */}
        <div className="rounded-2xl border border-brand-200 dark:border-brand-800/60 bg-gradient-to-r from-brand-50 via-white to-brand-50/40 dark:from-brand-950/40 dark:via-slate-900 dark:to-brand-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-base shadow-sm shrink-0">
              92%
            </div>
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Your Verifiable Profile is Almost Complete!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You have 2 credentials verified on Ethereum Sepolia. Add your personal portfolio URL to reach 100%.
              </p>
            </div>
          </div>
          <Link href="/student/profile" className="shrink-0">
            <Button variant="primary" size="sm">
              Complete Profile
            </Button>
          </Link>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Verified Credentials"
            value={credentials.length > 0 ? credentials.length.toString() : "2"}
            change={credentials.length > 0 ? `${credentials.length} verified on-chain` : "+1 this month"}
            trend="up"
            subtitle="Anchored on-chain"
            icon={<Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          />
          <MetricCard
            title="AI Resume Score"
            value="94/100"
            change="Top 5% decile"
            trend="up"
            subtitle="NLP parsed with proof boost"
            icon={<Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
          />
          <MetricCard
            title="Active Applications"
            value={applications.length > 0 ? applications.length.toString() : "3"}
            change={applications.length > 0 ? `${applications.length} submitted` : "1 Shortlisted"}
            trend="up"
            subtitle="Recruiter pipeline"
            icon={<Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
          />
          <MetricCard
            title="Recruiter Profile Views"
            value="128"
            change="+24% this week"
            trend="up"
            subtitle="Via public verifier"
            icon={<Eye className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
          />
        </div>

        {/* Middle Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Credentials (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Verified Credentials</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Academically certified credentials anchored on Ethereum
                  </p>
                </div>
                <Link
                  href="/student/credentials"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  View All ({credentials.length > 0 ? credentials.length : 2})
                </Link>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                {credentials.length > 0 ? (
                  credentials.slice(0, 3).map((c: any) => (
                    <div
                      key={c.id || c.credentialId}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/60 p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400">
                            {c.credentialId}
                          </span>
                          <CredentialStatusIndicator status={c.isRevoked ? "REVOKED" : (c.status || "ISSUED")} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {c.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {c.institutionName || "Stanford School of Engineering"} • {c.gradeOrScore || "Passed with Distinction"}
                        </p>
                      </div>
                      <Link href={`/verify/${encodeURIComponent(c.credentialId)}`} className="shrink-0">
                        <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3 w-3" />}>
                          Verify
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/60 p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400">
                            CRED-STANFORD-2025-001
                          </span>
                          <CredentialStatusIndicator status="ISSUED" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          Bachelor of Science in Computer Science
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Stanford School of Engineering • GPA 3.92 (Summa Cum Laude)
                        </p>
                      </div>
                      <Link href="/verify/CRED-STANFORD-2025-001" className="shrink-0">
                        <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3 w-3" />}>
                          Verify
                        </Button>
                      </Link>
                    </div>

                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/60 p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400">
                            CRED-MIT-2025-089
                          </span>
                          <CredentialStatusIndicator status="ISSUED" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          Advanced Cryptographic Engineering Certificate
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          MIT Decentralized Media Lab • Top Decile (98%)
                        </p>
                      </div>
                      <Link href="/verify/CRED-MIT-2025-089" className="shrink-0">
                        <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3 w-3" />}>
                          Verify
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Active Applications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Recent Job Applications</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Positions applied with verified credentials
                  </p>
                </div>
                <Link
                  href="/student/applications"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  Manage Applications
                </Link>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                {applications.length > 0 ? (
                  applications.slice(0, 3).map((a: any) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {a.jobTitle || "Engineering Position"}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {a.companyName || "Partner Company"} • Applied {a.appliedDate ? new Date(a.appliedDate).toLocaleDateString() : "Recently"}
                        </p>
                      </div>
                      <Badge variant={a.status === "SHORTLISTED" ? "verified" : "brand"} size="sm">
                        {a.status} (AI Fit: {a.aiMatchScore || 85}%)
                      </Badge>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          Senior Blockchain & Full-Stack Engineer
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Aether Cryptographic Labs • Applied Feb 12, 2025
                        </p>
                      </div>
                      <Badge variant="verified" size="sm">
                        SHORTLISTED (AI Fit: 94%)
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          AI Verification Systems Engineer
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Veritas Security • Applied Feb 15, 2025
                        </p>
                      </div>
                      <Badge variant="pending" size="sm">
                        UNDER REVIEW (AI Fit: 88%)
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Resume Intelligence Sidebar (1 col) */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-b from-white to-brand-50/30 dark:from-slate-900 dark:to-brand-950/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                    AI Resume Intelligence
                  </CardTitle>
                  <Badge variant="brand" size="sm">
                    Score: 94/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  FastAPI NLP parsed your resume text. Your profile holds a <strong>+20pt verified credential boost</strong> because key skills are backed by Stanford & MIT on-chain records.
                </p>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Verified Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["TypeScript", "Solidity", "PostgreSQL", "Zero Knowledge"].map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-white dark:bg-slate-800/70 p-3 border border-slate-200/80 dark:border-slate-700 space-y-1.5 text-xs">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                    AI Improvement Tip:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    Consider adding quantifiable scale metrics (e.g. TPS throughput, users served) to your Distributed Systems bullet points.
                  </p>
                </div>

                <Link href="/student/resume" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    Upload & Re-Analyze Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-1 text-xs">
                <Link
                  href="/student/jobs"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  <span>Browse Web3 & Engineering Jobs</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/u/alexrivera"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  <span>Preview Public Portfolio</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/student/settings"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  <span>Manage Connected Wallet</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
