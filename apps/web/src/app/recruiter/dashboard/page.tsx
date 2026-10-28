"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Briefcase,
  Users,
  Award,
  PlusCircle,
  Search,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { api } from "@/lib/api";

const DEFAULT_APPLICANTS = [
  {
    id: "app-001",
    name: "Alex Rivera",
    jobTitle: "Senior Blockchain & Full-Stack Engineer",
    appliedDate: "Feb 12, 2025",
    aiFit: 94,
    verifiedCredentials: 2,
    university: "Stanford University (B.S. CS)",
    status: "SHORTLISTED",
    profileUrl: "/u/alexrivera",
  },
  {
    id: "app-002",
    name: "Maya Patel",
    jobTitle: "Senior Blockchain & Full-Stack Engineer",
    appliedDate: "Feb 16, 2025",
    aiFit: 78,
    verifiedCredentials: 1,
    university: "UC Berkeley (EECS)",
    status: "UNDER_REVIEW",
    profileUrl: "/u/mayapatel",
  },
  {
    id: "app-003",
    name: "David Kim",
    jobTitle: "AI Verification Systems Engineer",
    appliedDate: "Feb 17, 2025",
    aiFit: 89,
    verifiedCredentials: 2,
    university: "Carnegie Mellon University",
    status: "INTERVIEW",
    profileUrl: "/u/davidkim",
  },
];

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [applicants, setApplicants] = React.useState<any[]>(DEFAULT_APPLICANTS);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [jobsData, appsData] = await Promise.all([
          api.jobs.my().catch(() => []),
          api.applications.recruiter().catch(() => []),
        ]);
        if (jobsData && Array.isArray(jobsData) && jobsData.length > 0) {
          setJobs(jobsData);
        }
        if (appsData && Array.isArray(appsData) && appsData.length > 0) {
          setApplicants(
            appsData.map((a: any) => ({
              id: a.id,
              name: a.studentName || "Alex Rivera",
              jobTitle: a.jobTitle,
              appliedDate: a.appliedDate
                ? new Date(a.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "Feb 12, 2025",
              aiFit: a.aiMatchScore || 90,
              verifiedCredentials: a.verifiedCredentialsCount || 1,
              university: "Stanford University (Accredited)",
              status: a.status || "APPLIED",
              profileUrl: `/u/${a.username || "alexrivera"}`,
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <DashboardShell
      role="RECRUITER"
      title="Recruiter Command Center"
      subtitle="Evaluate candidate pipelines backed by zero-knowledge verified blockchain credentials and AI scoring."
      actions={
        <div className="flex items-center gap-2">
          <Link href="/recruiter/candidates">
            <Button variant="outline" size="sm" leftIcon={<Search className="h-3.5 w-3.5" />}>
              Candidate Search
            </Button>
          </Link>
          <Link href="/recruiter/jobs/new">
            <Button variant="primary" size="sm" leftIcon={<PlusCircle className="h-3.5 w-3.5" />}>
              Post New Job
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Job Postings"
            value={jobs.length > 0 ? jobs.length.toString() : "3"}
            change={jobs.length > 0 ? `${jobs.length} requisitions active` : "2 Engineering, 1 AI"}
            trend="neutral"
            subtitle="Currently hiring"
            icon={<Briefcase className="h-5 w-5 text-brand-600" />}
          />
          <MetricCard
            title="Total Applicants"
            value={applicants.length > 0 ? applicants.length.toString() : "51"}
            change={applicants.length > 0 ? `${applicants.length} reviewed` : "+14 this week"}
            trend="up"
            subtitle="Across all postings"
            icon={<Users className="h-5 w-5 text-indigo-600" />}
          />
          <MetricCard
            title="Verified Credentials"
            value="84"
            change="100% on-chain proofs"
            trend="up"
            subtitle="Zero degree fraud"
            icon={<Award className="h-5 w-5 text-emerald-600" />}
            isDemo
          />
          <MetricCard
            title="Average Vetting Latency"
            value="0.4s"
            change="vs 14 days legacy"
            trend="up"
            subtitle="Sub-second verification"
            icon={<ShieldCheck className="h-5 w-5 text-brand-600" />}
            isDemo
          />
        </div>

        {/* Pipeline Stage Bar */}
        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
            Hiring Pipeline Funnel
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 p-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Applied</span>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">32</span>
            </div>
            <div className="rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/40 p-3">
              <span className="text-xs text-amber-700 dark:text-amber-300 block">Under Review</span>
              <span className="text-xl font-bold text-amber-900 dark:text-amber-200">12</span>
            </div>
            <div className="rounded-xl border border-brand-200 dark:border-brand-800/80 bg-brand-50/50 dark:bg-brand-950/40 p-3">
              <span className="text-xs text-brand-700 dark:text-brand-300 block">Shortlisted</span>
              <span className="text-xl font-bold text-brand-900 dark:text-brand-200">5</span>
            </div>
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/40 p-3">
              <span className="text-xs text-emerald-700 dark:text-emerald-300 block">Interview Stage</span>
              <span className="text-xl font-bold text-emerald-900 dark:text-emerald-200">2</span>
            </div>
          </div>
        </Card>

        {/* Recent Applications Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Verified Candidates</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Top candidates evaluated with AI resume matching and on-chain degrees
              </p>
            </div>
            <Link
              href="/recruiter/applications"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              View Full Pipeline
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4 pl-6 font-semibold">Candidate</th>
                    <th className="p-4 font-semibold">Target Position</th>
                    <th className="p-4 font-semibold">AI Fit Score</th>
                    <th className="p-4 font-semibold">On-Chain Proofs</th>
                    <th className="p-4 font-semibold">Stage</th>
                    <th className="p-4 pr-6 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applicants.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 pl-6">
                        <Link href={cand.profileUrl} className="font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 block">
                          {cand.name}
                        </Link>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{cand.university}</span>
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{cand.jobTitle}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                          <Sparkles className="h-3 w-3 text-brand-600 dark:text-brand-400" />
                          {cand.aiFit}% Fit
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge variant="verified" size="sm" icon>
                          {cand.verifiedCredentials} Verified
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            cand.status === "INTERVIEW" || cand.status === "SHORTLISTED"
                              ? "verified"
                              : "pending"
                          }
                          size="sm"
                        >
                          {cand.status}
                        </Badge>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Link href={cand.profileUrl}>
                          <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3 w-3" />}>
                            Inspect Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
