"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Briefcase,
  PlusCircle,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
} from "lucide-react";

export default function RecruiterJobsPage() {
  const jobs = [
    {
      id: "job-001",
      title: "Senior Blockchain & Full-Stack Engineer",
      department: "Core Platform",
      location: "San Francisco, CA / Hybrid",
      salary: "$145,000 - $190,000",
      jobType: "FULL_TIME",
      applicantsCount: 14,
      verifiedApplicantsCount: 12,
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
      status: "OPEN",
      postedDate: "Feb 14, 2025",
    },
  ];

  return (
    <DashboardShell
      role="RECRUITER"
      title="Active Job Postings"
      subtitle="Manage your company's open requisitions and evaluate incoming applicant pools."
      actions={
        <Link href="/recruiter/jobs/new">
          <Button variant="primary" size="sm" leftIcon={<PlusCircle className="h-3.5 w-3.5" />}>
            Create Job Requisition
          </Button>
        </Link>
      }
    >
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="verified" size="sm">
                    {job.status}
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
              </div>

              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">
                      {job.applicantsCount} Applicants
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      {job.verifiedApplicantsCount} with Verified Proofs
                    </span>
                  </div>
                </div>

                <Link href="/recruiter/applications">
                  <Button variant="outline" size="sm">
                    Review Pipeline
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
