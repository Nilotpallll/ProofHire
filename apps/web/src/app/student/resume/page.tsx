"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FileUploadZone } from "@/components/ui/FileUploadZone";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Cpu,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function StudentResumePage() {
  const [resumeText, setResumeText] = React.useState(
    `ALEX RIVERA
Software Engineer | Distributed Systems & Web3
Email: student@proofhire.io | Portfolio: alexrivera.dev

EDUCATION:
Stanford University, School of Engineering (Class of 2025)
Bachelor of Science in Computer Science, GPA: 3.92 (Summa Cum Laude)

SKILLS:
Languages & Frameworks: TypeScript, Solidity, Python, Next.js, React, Node.js, NestJS
Databases & Cloud: PostgreSQL, Docker, Git, REST APIs, Cryptography

EXPERIENCE & PROJECTS:
• Built decentralized credential verification registry on Ethereum Sepolia testnet using Solidity and OpenZeppelin contracts.
• Developed full-stack Next.js web application with PostgreSQL and Prisma ORM, serving responsive client dashboards.
• Implemented zero-knowledge proof verification pipeline for academic certificates with encrypted IPFS pinning.`
  );

  const [analyzing, setAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<{
    score: number;
    summary: string;
    detectedSkills: string[];
    verifiedSkills: string[];
    unverifiedSkills: string[];
    strengths: string[];
    improvements: string[];
    recommendedRoles: string[];
  } | null>({
    score: 94,
    summary:
      "Profile demonstrates high-caliber engineering competencies across 8 domain areas with 4 skills backed by Stanford and MIT on-chain credentials.",
    detectedSkills: [
      "TypeScript",
      "Solidity",
      "Next.Js",
      "React",
      "Node.Js",
      "PostgreSQL",
      "Python",
      "Docker",
    ],
    verifiedSkills: ["TypeScript", "Solidity", "PostgreSQL", "Next.Js"],
    unverifiedSkills: ["Python", "Docker", "Node.Js"],
    strengths: [
      "Candidate holds verified B.S. in Computer Science from Stanford University.",
      "100% match on high-demand Web3 & distributed systems technical skills.",
      "Cryptographic certifications eliminate candidate vetting risk.",
    ],
    improvements: [
      "Include quantifiable performance metrics (e.g., % latency reduction, peak TPS handled).",
      "Request institutional verification for Docker/Cloud DevOps competencies.",
    ],
    recommendedRoles: [
      "Senior Blockchain & Full-Stack Engineer",
      "Distributed Systems Architect",
      "Web3 Protocol Engineer",
    ],
  });

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const aiUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";
      const res = await fetch(`${aiUrl}/analyze-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resumeText,
          verified_skills: ["TypeScript", "Solidity", "PostgreSQL", "Next.js"],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult({
          score: data.score,
          summary: data.summary,
          detectedSkills: data.detected_skills,
          verifiedSkills: data.verified_skills,
          unverifiedSkills: data.unverified_skills,
          strengths: data.strengths,
          improvements: data.improvements,
          recommendedRoles: data.recommended_roles,
        });
      }
    } catch {
      // In-app fallback simulation
      setTimeout(() => {
        setAnalysisResult({
          score: 94,
          summary:
            "Profile demonstrates high-caliber engineering competencies with verified cryptographic credentials.",
          detectedSkills: ["TypeScript", "Solidity", "Next.Js", "PostgreSQL", "Python"],
          verifiedSkills: ["TypeScript", "Solidity", "PostgreSQL"],
          unverifiedSkills: ["Python"],
          strengths: [
            "Strong verified degree from Stanford School of Engineering.",
            "Demonstrated hands-on experience in distributed consensus protocols.",
          ],
          improvements: [
            "Quantify impact metrics across past project bullet points.",
          ],
          recommendedRoles: [
            "Full-Stack Web3 Engineer",
            "Core Protocols Developer",
          ],
        });
      }, 500);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) setResumeText(text);
    };
    reader.readAsText(file);
  };

  return (
    <DashboardShell
      role="STUDENT"
      title="Resume & AI Analysis"
      subtitle="Leverage the FastAPI AI Intelligence service to inspect resume readiness and discover certified skill matches."
      actions={
        <Button
          onClick={handleRunAnalysis}
          isLoading={analyzing}
          variant="primary"
          size="sm"
          leftIcon={<Sparkles className="h-3.5 w-3.5" />}
        >
          Run AI Analysis
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Upload & Document Editor */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Document Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploadZone
                label="Drop your resume file (.txt, .pdf, .docx)"
                description="Upload to parse text into the AI verification pipeline"
                onFileSelect={handleFileUpload}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Extracted Resume Text
                </label>
                <textarea
                  rows={12}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-3 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <Button
                onClick={handleRunAnalysis}
                isLoading={analyzing}
                variant="primary"
                className="w-full"
              >
                Re-Analyze Resume with ProofHire AI
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: AI Feedback & Scores */}
        <div className="space-y-6">
          {analysisResult && (
            <>
              {/* Score Header */}
              <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 to-white p-6 shadow-card flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    AI Credibility & Readiness
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold text-slate-900 font-sans">
                      {analysisResult.score}
                    </span>
                    <span className="text-slate-500 text-sm">/ 100</span>
                    <Badge variant="verified" size="sm" icon>
                      +20pt Verified Proof Boost
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 max-w-sm">
                    {analysisResult.summary}
                  </p>
                </div>
              </div>

              {/* Skills breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Skill Classification Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Verified on Blockchain ({analysisResult.verifiedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.verifiedSkills.map((s) => (
                        <span
                          key={s}
                          className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-slate-600">
                      Unverified Claimed Skills ({analysisResult.unverifiedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.unverifiedSkills.map((s) => (
                        <span
                          key={s}
                          className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actionable Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Feedback & Recommended Roles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-900 block">
                      Profile Strengths
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {analysisResult.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          {str}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-slate-900 block">
                      Recommended Enhancements
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {analysisResult.improvements.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-slate-900 block">
                      Top Matched Job Roles
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.recommendedRoles.map((role) => (
                        <span
                          key={role}
                          className="text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-md border border-brand-200"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
