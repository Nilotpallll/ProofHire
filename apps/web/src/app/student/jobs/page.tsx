"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function StudentJobsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedJob, setSelectedJob] = React.useState<any>(null);
  const [applyModalOpen, setApplyModalOpen] = React.useState(false);
  const [coverLetter, setCoverLetter] = React.useState("");
  const [appliedJobs, setAppliedJobs] = React.useState<string[]>(["job-001"]);
  const [applying, setApplying] = React.useState(false);

  const jobs = [
    {
      id: "job-001",
      title: "Senior Blockchain & Full-Stack Engineer",
      company: "Aether Cryptographic Labs",
      location: "San Francisco, CA / Hybrid",
      salary: "$145,000 - $190,000",
      jobType: "FULL_TIME",
      experience: "MID",
      matchScore: 94,
      requiredSkills: ["TypeScript", "Next.js", "Solidity", "PostgreSQL"],
      description:
        "Lead the development of cryptographic credential verification protocols, smart contracts, and high-performance Web3 frontends.",
    },
    {
      id: "job-002",
      title: "AI Verification Systems Engineer",
      company: "Veritas Security",
      location: "New York, NY / Remote",
      salary: "$160,000 - $210,000",
      jobType: "FULL_TIME",
      experience: "SENIOR",
      matchScore: 88,
      requiredSkills: ["Python", "FastAPI", "PyTorch", "Vector Databases"],
      description:
        "Build automated AI verification pipelines that analyze multimodal candidate transcripts, diplomas, and portfolio code.",
    },
    {
      id: "job-003",
      title: "Frontend React / Next.js Engineer",
      company: "Nexus Decentralized Finance",
      location: "Remote (Worldwide)",
      salary: "$90,000 - $120,000",
      jobType: "CONTRACT",
      experience: "ENTRY",
      matchScore: 91,
      requiredSkills: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
      description:
        "Create ultra-responsive, accessible Web3 interfaces for credential management and decentralized job discovery.",
    },
  ];

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openApply = (job: any) => {
    setSelectedJob(job);
    setCoverLetter(
      `I am excited to apply for the ${job.title} position at ${job.company}. My verified degrees and smart contract engineering experience align strongly with your technical stack.`
    );
    setApplyModalOpen(true);
  };

  const handleApplySubmit = () => {
    setApplying(true);
    setTimeout(() => {
      if (selectedJob) {
        setAppliedJobs((prev) => [...prev, selectedJob.id]);
      }
      setApplying(false);
      setApplyModalOpen(false);
    }, 600);
  };

  return (
    <DashboardShell
      role="STUDENT"
      title="Browse Job Opportunities"
      subtitle="Discover tech and Web3 roles where your verified blockchain credentials give you priority shortlisting."
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            placeholder="Search by job title, company, or technical skills (e.g. Solidity, TypeScript)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftAddon={<Search className="h-4 w-4" />}
            className="w-full"
            aria-label="Search jobs"
          />
        </div>

        {/* Jobs List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => {
            const hasApplied = appliedJobs.includes(job.id);
            return (
              <Card key={job.id} className="p-6 hover:border-slate-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {job.company}
                      </span>
                      <Badge variant="brand" size="sm">
                        <Sparkles className="h-3 w-3 mr-1 text-brand-600" />
                        AI Fit: {job.matchScore}%
                      </Badge>
                      <Badge variant="neutral" size="sm">
                        {job.jobType.replace("_", " ")}
                      </Badge>
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
                    </div>

                    <p className="text-xs text-slate-600 max-w-2xl leading-relaxed pt-1">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.requiredSkills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col sm:items-end gap-2">
                    {hasApplied ? (
                      <Badge variant="verified" size="md" icon>
                        Application Submitted
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => openApply(job)}
                        variant="primary"
                        size="sm"
                        rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                      >
                        Apply with Verified Credentials
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <Modal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          title={`Apply to ${selectedJob.title}`}
          description={`Submit your verified credentials and resume to ${selectedJob.company}`}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Verified Proof Attachment:</span>
                <p className="mt-0.5 text-[11px]">
                  Your Stanford University Degree and verified skills will be automatically transmitted with on-chain cryptographic proofs.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Short Cover Note
              </label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={applying}
                onClick={handleApplySubmit}
              >
                Submit Application
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
