"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Briefcase,
  PlusCircle,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Power,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from "lucide-react";

import { api } from "@/lib/api";

interface JobItem {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  jobType: string;
  applicantsCount: number;
  verifiedApplicantsCount: number;
  requiredSkills: string[];
  status: "OPEN" | "CLOSED";
  postedDate: string;
}

const DEFAULT_DEMO_JOBS: JobItem[] = [
  {
    id: "job-001",
    title: "Senior Blockchain & Full-Stack Engineer",
    department: "Core Platform",
    location: "San Francisco, CA / Hybrid",
    salary: "$145,000 - $190,000",
    jobType: "FULL_TIME",
    applicantsCount: 14,
    verifiedApplicantsCount: 12,
    requiredSkills: ["TypeScript", "Next.js", "Solidity", "PostgreSQL"],
    status: "OPEN",
    postedDate: "Feb 1, 2025",
  },
  {
    id: "job-002",
    title: "AI Verification Systems Engineer",
    department: "Trust Engineering",
    location: "New York, NY / Remote",
    salary: "$160,000 - $210,000",
    jobType: "FULL_TIME",
    applicantsCount: 8,
    verifiedApplicantsCount: 7,
    requiredSkills: ["Python", "FastAPI", "PyTorch", "Vector Databases"],
    status: "OPEN",
    postedDate: "Feb 10, 2025",
  },
  {
    id: "job-003",
    title: "Frontend React / Next.js Engineer",
    department: "Design & UX",
    location: "Remote",
    salary: "$90,000 - $120,000",
    jobType: "CONTRACT",
    applicantsCount: 29,
    verifiedApplicantsCount: 21,
    requiredSkills: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    status: "OPEN",
    postedDate: "Feb 14, 2025",
  },
];

export default function RecruiterJobsPage() {
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "OPEN" | "CLOSED">("ALL");
  const [jobToClose, setJobToClose] = React.useState<JobItem | null>(null);
  const [jobs, setJobs] = React.useState<JobItem[]>(DEFAULT_DEMO_JOBS);
  const [loading, setLoading] = React.useState(true);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    async function loadJobs() {
      try {
        const fetched = await api.jobs.my();
        if (fetched && fetched.length > 0) {
          setJobs(
            fetched.map((j: any) => ({
              id: j.id,
              title: j.title,
              department: j.department || "Engineering",
              location: j.location || "Remote",
              salary: j.salaryMin ? `$${(j.salaryMin/1000).toFixed(0)}k - $${(j.salaryMax/1000).toFixed(0)}k` : "$120,000 - $160,000",
              jobType: j.jobType || "FULL_TIME",
              applicantsCount: j.applicantsCount || 0,
              verifiedApplicantsCount: j.verifiedApplicantsCount || 0,
              requiredSkills: j.requiredSkills || [],
              status: j.status || "OPEN",
              postedDate: j.createdAt ? new Date(j.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
            }))
          );
        }
      } catch (err) {
        console.warn("Using offline demo jobs fallback:", err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const toggleJobStatus = async (job: JobItem) => {
    if (job.status === "OPEN") {
      setJobToClose(job);
      setActionError(null);
    } else {
      // Reopen
      setIsUpdating(true);
      setActionError(null);
      try {
        await api.jobs.publish(job.id);
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: "OPEN" } : j))
        );
      } catch (e: any) {
        setActionError(e?.message || `Failed to reopen job '${job.title}'.`);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const confirmCloseJob = async () => {
    if (jobToClose) {
      setIsUpdating(true);
      setActionError(null);
      try {
        await api.jobs.close(jobToClose.id);
        setJobs((prev) =>
          prev.map((j) => (j.id === jobToClose.id ? { ...j, status: "CLOSED" } : j))
        );
        setJobToClose(null);
      } catch (e: any) {
        setActionError(e?.message || `Failed to close job '${jobToClose.title}'.`);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (statusFilter === "ALL") return true;
    return j.status === statusFilter;
  });

  return (
    <DashboardShell
      role="RECRUITER"
      title="Job Requisitions Management"
      subtitle="Publish, edit, and close job postings. Closed positions automatically stop accepting new candidate applications."
      actions={
        <Link href="/recruiter/jobs/new">
          <Button variant="primary" size="sm" leftIcon={<PlusCircle className="h-3.5 w-3.5" />}>
            Create Job Requisition
          </Button>
        </Link>
      }
    >
      <div className="space-y-5">
        {actionError && (
          <div className="p-4 bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 rounded-xl text-xs font-semibold text-rose-800 dark:text-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button
              onClick={() => setActionError(null)}
              className="text-rose-600 hover:text-rose-800 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          {(["ALL", "OPEN", "CLOSED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === tab
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab === "ALL" ? `All Positions (${jobs.length})` : tab === "OPEN" ? "Active (Open)" : "Closed"}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={job.status === "OPEN" ? "verified" : "revoked"} size="sm">
                      {job.status === "OPEN" ? "Active (Accepting Applications)" : "Closed (Applications Blocked)"}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-500">
                      {job.department}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Posted {job.postedDate}
                    </span>
                  </div>

                  {/* Required Skills Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">
                      {job.applicantsCount} Applicants
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      {job.verifiedApplicantsCount} with Verified Proofs
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleJobStatus(job)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1 transition-colors ${
                        job.status === "OPEN"
                          ? "border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/40"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                      }`}
                    >
                      {job.status === "OPEN" ? (
                        <>
                          <Lock className="h-3 w-3" /> Close Requisition
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Reopen Job
                        </>
                      )}
                    </button>

                    <Link href={`/recruiter/applications?jobId=${job.id}`}>
                      <Button variant="outline" size="sm">
                        Review Pipeline
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Confirmation Modal for Closing a Job */}
      {jobToClose && (
        <Modal
          isOpen={true}
          onClose={() => setJobToClose(null)}
          title={`Close Requisition: ${jobToClose.title}`}
        >
          <div className="space-y-4 py-2">
            <div className="p-3 bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                Closing this job requisition will immediately prevent any candidates from submitting new applications. Existing applicants can still be reviewed, interviewed, and advanced.
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to close <strong>{jobToClose.title}</strong>? You can reopen it at any time.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setJobToClose(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={confirmCloseJob}>
                Confirm Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
