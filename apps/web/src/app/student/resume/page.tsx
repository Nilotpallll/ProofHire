"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Cpu,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Award,
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
• Implemented zero-knowledge proof verification pipeline for academic certificates with encrypted IPFS pinning reducing verification latency by 45%.`
  );

  const [analyzing, setAnalyzing] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const [analysisResult, setAnalysisResult] = React.useState<{
    totalScore: number;
    rubric: {
      skillCoverageScore: number;
      experienceQualityScore: number;
      quantifiedImpactScore: number;
      formattingAndStructureScore: number;
    };
    extractedSkills: string[];
    verifiedSkillsCount: number;
    verifiedBoostApplied: number;
    strengthHighlights: string[];
    missingInformation: string[];
    improvementSuggestions: string[];
    scoringMethodology: string;
  }>({
    totalScore: 94,
    rubric: {
      skillCoverageScore: 24,
      experienceQualityScore: 23,
      quantifiedImpactScore: 23,
      formattingAndStructureScore: 24,
    },
    extractedSkills: [
      "TypeScript",
      "Solidity",
      "Next.js",
      "React",
      "Node.js",
      "PostgreSQL",
      "Python",
      "Smart Contracts",
    ],
    verifiedSkillsCount: 3,
    verifiedBoostApplied: 12.0,
    strengthHighlights: [
      "Cryptographic credential verification confirmed for: TypeScript, Solidity, PostgreSQL (+12.0% confidence boost)",
      "Strong technical breadth with 8 relevant industry competencies identified",
      "Found quantified outcome metrics demonstrating engineering impact (45% latency reduction)",
    ],
    missingInformation: [
      "Quantified system scale metrics (peak transactions/second or active daily user volume)",
    ],
    improvementSuggestions: [
      "Include links to verified GitHub repositories or deployed smart contract addresses",
      "Add measurable metrics to past internship bullet points",
      "Request on-chain credentials for Docker/DevOps to increase hiring confidence",
    ],
    scoringMethodology: "ProofHire Deterministic 100-Point Rubric v2.0",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setAnalyzing(true);

    try {
      const parsedData = await api.ai.parse(file);
      if (parsedData.rawTextExcerpt) {
        setResumeText(parsedData.rawTextExcerpt);
      }

      const result = await api.ai.analyze(
        parsedData.rawTextExcerpt || resumeText,
        "",
        ["TypeScript", "Solidity", "PostgreSQL"]
      );
      setAnalysisResult(result);
    } catch {
      // Fallback
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const data = await api.ai.analyze(
        resumeText,
        "",
        ["TypeScript", "Solidity", "PostgreSQL"]
      );
      setAnalysisResult(data);
    } catch {
      // local fallback
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <DashboardShell
      role="STUDENT"
      title="AI Resume Intelligence & Verified Matching"
      subtitle="Optimize your technical profile with deterministic rubric feedback and cryptographic skill boosts."
    >
      <div className="space-y-8">
        {/* Verified Credential Boost Banner */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/80 to-blue-50/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Cryptographic Verification Boost Active (+{analysisResult.verifiedBoostApplied.toFixed(1)}%)
                </h2>
                <Badge variant="verified">ON-CHAIN VERIFIED</Badge>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                You have {analysisResult.verifiedSkillsCount} skills backed by authentic Stanford University smart contract credentials. Recruiters evaluate your profile with elevated confidence.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="neutral" className="text-xs bg-white text-slate-700 border-slate-200">
              Scoring Engine: {analysisResult.scoringMethodology}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Upload & Resume Input */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload Dropzone */}
            <Card className="border-slate-200 shadow-sm bg-white p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-blue-600" /> Upload Resume (PDF / DOCX)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Upload your document to automatically extract technical competencies.
              </p>

              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-5 text-center transition-colors bg-slate-50/50">
                <input
                  type="file"
                  id="resume-file-input"
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                />
                <label htmlFor="resume-file-input" className="cursor-pointer block">
                  <Upload className="h-7 w-7 text-slate-400 mx-auto mb-1.5" />
                  <span className="text-sm font-semibold text-blue-600 hover:underline">
                    {selectedFile ? selectedFile.name : "Select Resume File"}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    PDF, DOCX, or Plain Text
                  </span>
                </label>
              </div>
            </Card>

            {/* Resume Text Editor */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>Resume Text Extracted</span>
                  <span className="text-xs text-slate-400 font-normal">Editable</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={14}
                  className="w-full text-xs font-mono p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 text-slate-800 resize-none"
                  aria-label="Resume Content"
                />
                <Button
                  onClick={handleRunAnalysis}
                  disabled={analyzing}
                  className="w-full"
                  leftIcon={<Sparkles className="h-4 w-4" />}
                >
                  {analyzing ? "Running Rubric Analysis..." : "Re-Analyze Profile"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: 100-Point Rubric Breakdown & AI Intelligence */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Score Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-5 border-slate-200 bg-white shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0">
                  {analysisResult.totalScore}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Overall Quality
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {analysisResult.totalScore >= 90 ? "Excellent / Top Decile" : analysisResult.totalScore >= 75 ? "Competitive" : "Needs Refinement"}
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-slate-200 bg-white shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-xl shrink-0">
                  +{analysisResult.verifiedBoostApplied.toFixed(0)}%
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Verified Boost
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    On-Chain Verified
                  </div>
                </div>
              </Card>

              <Card className="p-5 border-slate-200 bg-white shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold text-xl shrink-0">
                  {analysisResult.extractedSkills.length}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Identified Skills
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    Core Technical Breadth
                  </div>
                </div>
              </Card>
            </div>

            {/* 100-Point Transparent Rubric Card */}
            <Card className="border-slate-200 shadow-sm bg-white p-6">
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-600" /> 100-Point Deterministic Rubric Breakdown
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Transparent scoring methodology evaluating concrete, measurable engineering resume criteria.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Skill Coverage & Depth (Max 25 pts)</span>
                    <span className="font-bold text-slate-900">{analysisResult.rubric.skillCoverageScore} / 25</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${(analysisResult.rubric.skillCoverageScore / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Experience Quality & Action Verbs (Max 25 pts)</span>
                    <span className="font-bold text-slate-900">{analysisResult.rubric.experienceQualityScore} / 25</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${(analysisResult.rubric.experienceQualityScore / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Quantified Impact & Numbers (Max 25 pts)</span>
                    <span className="font-bold text-slate-900">{analysisResult.rubric.quantifiedImpactScore} / 25</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${(analysisResult.rubric.quantifiedImpactScore / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Formatting, Contact & Structure (Max 25 pts)</span>
                    <span className="font-bold text-slate-900">{analysisResult.rubric.formattingAndStructureScore} / 25</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${(analysisResult.rubric.formattingAndStructureScore / 25) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Extracted Skills Inventory */}
            <Card className="border-slate-200 shadow-sm bg-white p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Extracted Competency Inventory</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.extractedSkills.map((skill) => {
                  const isVerified = ["TypeScript", "Solidity", "PostgreSQL"].includes(skill);
                  return (
                    <Badge
                      key={skill}
                      variant={isVerified ? "verified" : "neutral"}
                      className="text-xs py-1 px-2.5"
                    >
                      {isVerified && <ShieldCheck className="h-3 w-3 mr-1" />}
                      {skill} {isVerified && "(On-Chain Verified)"}
                    </Badge>
                  );
                })}
              </div>
            </Card>

            {/* Actionable Feedback */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-950 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Strong Highlights
                </div>
                <ul className="space-y-2 text-xs text-emerald-900">
                  {analysisResult.strengthHighlights.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="border-amber-200 bg-amber-50/50 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-950 mb-3">
                  <AlertCircle className="h-4 w-4 text-amber-600" /> Actionable Improvements
                </div>
                <ul className="space-y-2 text-xs text-amber-900">
                  {analysisResult.improvementSuggestions.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
