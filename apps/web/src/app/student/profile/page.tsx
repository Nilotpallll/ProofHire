"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, User, Globe, Github, Linkedin, Save, ShieldCheck } from "lucide-react";

export default function StudentProfilePage() {
  const [name, setName] = React.useState("Alex Rivera");
  const [headline, setHeadline] = React.useState("Software Engineer & Distributed Systems Researcher");
  const [bio, setBio] = React.useState(
    "B.S. in Computer Science with focus on cryptography, distributed consensus, and full-stack web architectures."
  );
  const [university, setUniversity] = React.useState("Stanford University");
  const [major, setMajor] = React.useState("Computer Science");
  const [gradYear, setGradYear] = React.useState("2025");
  const [gpa, setGpa] = React.useState("3.92");
  const [portfolioUrl, setPortfolioUrl] = React.useState("https://alexrivera.dev");
  const [githubUrl, setGithubUrl] = React.useState("https://github.com/alexrivera-demo");
  const [linkedinUrl, setLinkedinUrl] = React.useState("https://linkedin.com/in/alexrivera-demo");
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("proofhire_student_profile");
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          if (p.name) setName(p.name);
          if (p.headline) setHeadline(p.headline);
          if (p.bio) setBio(p.bio);
          if (p.university) setUniversity(p.university);
          if (p.major) setMajor(p.major);
          if (p.gradYear) setGradYear(p.gradYear);
          if (p.gpa) setGpa(p.gpa);
          if (p.portfolioUrl) setPortfolioUrl(p.portfolioUrl);
          if (p.githubUrl) setGithubUrl(p.githubUrl);
          if (p.linkedinUrl) setLinkedinUrl(p.linkedinUrl);
        } catch {}
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "proofhire_student_profile",
        JSON.stringify({ name, headline, bio, university, major, gradYear, gpa, portfolioUrl, githubUrl, linkedinUrl })
      );
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardShell
      role="STUDENT"
      title="Student Profile"
      subtitle="Manage your public candidate profile, bio, education, and links visible to recruiters."
      actions={
        <Button
          onClick={handleSave}
          variant="primary"
          size="sm"
          leftIcon={<Save className="h-3.5 w-3.5" />}
        >
          {saved ? "Saved Successfully!" : "Save Profile"}
        </Button>
      }
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {saved && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Your profile has been updated and synchronized with your public candidate portfolio.
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Personal & Professional Details</CardTitle>
              <Badge variant="verified" size="sm" icon>
                ID Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Professional Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="University / Institution"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                required
              />
              <Input
                label="Major / Discipline"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
              />
              <Input
                label="Graduation Year"
                type="number"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                required
              />
              <Input
                label="Cumulative GPA"
                type="number"
                step="0.01"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio & Social Presence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Portfolio Website"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                leftAddon={<Globe className="h-4 w-4" />}
              />
              <Input
                label="GitHub URL"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                leftAddon={<Github className="h-4 w-4" />}
              />
              <Input
                label="LinkedIn Profile"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                leftAddon={<Linkedin className="h-4 w-4" />}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </DashboardShell>
  );
}
