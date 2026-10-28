"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Save, Plus, X, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function RecruiterNewJobPage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [department, setDepartment] = React.useState("Core Platform");
  const [location, setLocation] = React.useState("San Francisco, CA / Hybrid");
  const [jobType, setJobType] = React.useState("FULL_TIME");
  const [experienceLevel, setExperienceLevel] = React.useState("MID");
  const [salaryMin, setSalaryMin] = React.useState("130000");
  const [salaryMax, setSalaryMax] = React.useState("175000");
  const [description, setDescription] = React.useState("");
  const [skills, setSkills] = React.useState<string[]>(["TypeScript", "React", "Next.js", "PostgreSQL"]);
  const [skillInput, setSkillInput] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (s: string) => {
    setSkills(skills.filter((item) => item !== s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await api.jobs.create({
        title,
        department,
        location,
        jobType,
        experienceLevel,
        salaryMin: parseInt(salaryMin) || 0,
        salaryMax: parseInt(salaryMax) || 0,
        description,
        requiredSkills: skills,
        preferredSkills: ["Docker", "ZK-Proofs"],
      });
      router.push("/recruiter/jobs");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create job requisition. Please check your network connection and required fields.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell
      role="RECRUITER"
      title="Create New Job Requisition"
      subtitle="Define role requirements, required competencies for AI neural matching, and compensation."
      actions={
        <Link href="/recruiter/jobs">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
            Back to Jobs
          </Button>
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Role Overview & Compensation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Job Title"
                placeholder="e.g. Senior Smart Contract Protocol Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Input
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Employment Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="ENTRY">Entry Level (0-2 yrs)</option>
                  <option value="MID">Mid Level (3-5 yrs)</option>
                  <option value="SENIOR">Senior Level (5+ yrs)</option>
                  <option value="LEAD">Staff / Lead (8+ yrs)</option>
                </select>
              </div>

              <Input
                label="Location / Remote Status"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Minimum Annual Salary ($USD)"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                required
              />
              <Input
                label="Maximum Annual Salary ($USD)"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Required Skills for AI Matching */}
        <Card>
          <CardHeader>
            <CardTitle>Required Skills for AI Neural Matching</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ProofHire AI compares candidate blockchain credentials against these exact competencies to calculate the verified match score.
            </p>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Add a required skill (e.g. Solidity, Docker, PyTorch)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" onClick={addSkill} variant="secondary" size="md">
                Add Skill
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 bg-brand-50 dark:bg-brand-950/60 text-brand-800 dark:text-brand-300 text-xs font-semibold px-3 py-1 rounded-lg border border-brand-200 dark:border-brand-800"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="hover:text-red-600 dark:hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description & Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              rows={6}
              placeholder="Describe the mission, key responsibilities, and team culture..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={submitting}
            >
              Publish Job Requisition to ProofHire Network
            </Button>
          </CardContent>
        </Card>
      </form>
    </DashboardShell>
  );
}
