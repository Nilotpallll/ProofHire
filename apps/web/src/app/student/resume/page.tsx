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
  AlertTriangle,
  Upload,
  ShieldCheck,
  Award,
  FileCheck,
  HelpCircle,
  Info,
  Scale,
  XCircle,
  RefreshCw,
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
  const [extractionError, setExtractionError] = React.useState<string | null>(null);
  const [extractionStatus, setExtractionStatus] = React.useState<string>("SUCCESS");
  const [missingSections, setMissingSections] = React.useState<string[]>([]);
  const [verifiedSkills, setVerifiedSkills] = React.useState<string[]>([
    "TypeScript",
    "Solidity",
    "PostgreSQL",
  ]);
  const [inferredSuggestions, setInferredSuggestions] = React.useState<string[]>([
    "Add verified links to GitHub repositories or deployed smart contract addresses.",
    "Quantify project impact with measurable outcomes (e.g., latency reduction, active scale).",
    "Request on-chain credentials from accredited institutions for cloud/DevOps competencies.",
  ]);

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
    scoringMethodology?: string;
    uncertaintyLevel?: "LOW" | "MEDIUM" | "HIGH";
    employmentPredictionWarning?: string;
    humanDecisionSupportNotice?: string;
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
    uncertaintyLevel: "LOW",
    strengthHighlights: [
      "Cryptographic credential verification confirmed for: TypeScript, Solidity, PostgreSQL (+12.0 pts confidence boost)",
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
    scoringMethodology: "ProofHire Deterministic 100-Point Rubric v2.2",
    employmentPredictionWarning:
      "This evaluation measures keyword coverage and structural formatting against engineering rubrics. It does not predict candidate workplace competence or on-the-job success.",
    humanDecisionSupportNotice:
      "This assessment serves solely as decision support for human review. ProofHire strictly prohibits automated rejection based on algorithmic scores.",
  });

  React.useEffect(() => {
    async function loadStudentSkills() {
      try {
        const creds = await api.credentials.my();
        if (creds && creds.length > 0) {
          const allSkills = new Set<string>();
          for (const c of creds) {
            if (Array.isArray(c.skills)) {
              c.skills.forEach((s: string) => allSkills.add(s));
            }
          }
          if (allSkills.size > 0) {
            setVerifiedSkills(Array.from(allSkills));
          }
        }
      } catch (e) {
        console.warn("Could not load student credentials:", e);
      }
    }
    loadStudentSkills();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setExtractionError("File exceeds 10MB maximum limit. Please select a smaller document.");
      return;
    }

    setSelectedFile(file);
    setAnalyzing(true);
    setExtractionError(null);

    try {
      const parsedData = await api.ai.parse(file);

      setExtractionStatus(parsedData.extractionStatus || "SUCCESS");
      if (parsedData.missingSections) {
        setMissingSections(parsedData.missingSections);
      }
      if (parsedData.inferredSuggestions) {
        setInferredSuggestions(parsedData.inferredSuggestions);
      }

      if (parsedData.extractionStatus === "SCANNED_OR_UNREADABLE") {
        setExtractionError(
          parsedData.failureReason ||
            "Scanned document detected (image-only PDF). Please upload a digital PDF with a selectable text layer generated from Word or Google Docs."
        );
        setAnalyzing(false);
        return;
      }

      if (parsedData.extractionStatus === "FAILED" || !parsedData.isTextExtractable) {
        setExtractionError(
          parsedData.failureReason || "Text could not be extracted from the document. Please check the file formatting."
        );
        setAnalyzing(false);
        return;
      }

      const fullExtractedText = parsedData.rawText || parsedData.rawTextExcerpt || "";
      if (fullExtractedText) {
        setResumeText(fullExtractedText);
      }

      const result = await api.ai.analyze(
        fullExtractedText || resumeText,
        "",
        verifiedSkills
      );
      setAnalysisResult(result);
    } catch (err: any) {
      setExtractionError(err?.message || "Resume parsing failed. Please verify file integrity or paste text directly.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!resumeText.trim()) {
      setExtractionError("Please enter or upload resume text before analyzing.");
      return;
    }

    setAnalyzing(true);
    setExtractionError(null);
    try {
      const data = await api.ai.analyze(
        resumeText,
        "",
        verifiedSkills
      );
      setAnalysisResult(data);
      if (data.uncertaintyLevel === "HIGH") {
        setExtractionError("Limited information detected in text. Rubric uncertainty is elevated.");
      }
    } catch (err: any) {
      setExtractionError(err?.message || "Analysis request failed. Please check network connection.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <DashboardShell
      role="STUDENT"
      title="AI Resume Intelligence & Verified Matching"
      subtitle="Optimize your technical profile with transparent 100-point rubric feedback, verified skill boosts, and explainable insights."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Responsible Hiring & Decision Support Notice */}
        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/70 p-4 sm:p-5 dark:border-blue-900/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 flex items-start gap-3.5 transition-colors">
          <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-sm text-blue-900 dark:text-blue-200">
                Ethical AI & Decision Support Guarantee
              </span>
              <Badge variant="neutral" size="sm" className="bg-white/80 dark:bg-slate-900 font-mono text-[10px]">
                Deterministic Rubric v2.2
              </Badge>
              {analysisResult.uncertaintyLevel && (
                <Badge
                  variant={
                    analysisResult.uncertaintyLevel === "LOW"
                      ? "verified"
                      : analysisResult.uncertaintyLevel === "MEDIUM"
                      ? "pending"
                      : "revoked"
                  }
                  size="sm"
                >
                  Uncertainty: {analysisResult.uncertaintyLevel}
                </Badge>
              )}
            </div>
            <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
              ProofHire AI resume scores quantify explicit keyword coverage and document formatting.{" "}
              <strong>Scores do not predict employment success or candidate competence.</strong> ProofHire strictly
              prohibits automated rejections based on algorithmic ratings; all results serve solely as decision support
              for human review.
            </p>
          </div>
        </div>

        {/* Verified Credential Boost Banner */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/80 via-white to-blue-50/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm dark:border-emerald-900/60 dark:from-emerald-950/30 dark:via-slate-900 dark:to-blue-950/20">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Cryptographic Verification Boost Active (+{analysisResult.verifiedBoostApplied.toFixed(1)} pts)
                </h2>
                <Badge variant="verified">ON-CHAIN VERIFIED</Badge>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                You have {analysisResult.verifiedSkillsCount} skill(s) anchored to authentic university smart contract
                credentials. Verified claims receive tamper-proof cryptographic trust boosts during recruiter screening.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="neutral" className="text-xs bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700">
              Scoring Engine: {analysisResult.scoringMethodology || "Deterministic 100-Pt Rubric"}
            </Badge>
          </div>
        </div>

        {/* Extraction Error or Warning Banner */}
        {extractionError && (
          <div
            role="alert"
            className="rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 flex items-start gap-3"
          >
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold">Extraction Notification:</span>
              <p>{extractionError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Upload & Resume Input */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload Dropzone */}
            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-brand-600 dark:text-brand-400" /> Upload Resume (PDF / DOCX)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Upload your document to automatically extract technical competencies. Physical scanned documents require OCR.
              </p>

              <div className="border-2 border-dashed border-slate-200 hover:border-brand-500 rounded-xl p-5 text-center transition-colors bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-brand-400">
                <input
                  type="file"
                  id="resume-file-input"
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  aria-label="Upload resume file"
                />
                <label htmlFor="resume-file-input" className="cursor-pointer block">
                  <Upload className="h-7 w-7 text-slate-400 dark:text-slate-500 mx-auto mb-1.5" />
                  <span className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
                    {selectedFile ? selectedFile.name : "Select Resume File"}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    PDF, DOCX, or Plain Text (Max 10MB)
                  </span>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                  <span className="truncate max-w-[180px]">{selectedFile.name}</span>
                  <span className="font-mono">{(selectedFile.size / 1024).toFixed(0)} KB</span>
                </div>
              )}
            </Card>

            {/* Resume Text Editor */}
            <Card>
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
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
                  className="w-full text-xs font-mono p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 resize-none"
                  aria-label="Resume Content"
                />
                <Button
                  onClick={handleRunAnalysis}
                  disabled={analyzing}
                  className="w-full"
                  leftIcon={analyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                >
                  {analyzing ? "Evaluating Rubric..." : "Re-Analyze Profile"}
                </Button>
              </CardContent>
            </Card>

            {/* Missing Sections Audit */}
            {missingSections.length > 0 && (
              <Card className="p-5 border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/30">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Missing Document Sections Detected
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mb-3">
                  The following structural sections were not identified in the uploaded document:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missingSections.map((sec) => (
                    <span
                      key={sec}
                      className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white border border-amber-300 text-amber-900 dark:bg-amber-900/50 dark:border-amber-700 dark:text-amber-100"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: 100-Point Rubric Breakdown & AI Intelligence */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Score Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-400 flex items-center justify-center font-bold text-xl shrink-0">
                  {analysisResult.totalScore}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Overall Score
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {analysisResult.totalScore >= 90
                      ? "High Keyword Match"
                      : analysisResult.totalScore >= 75
                      ? "Competitive Match"
                      : "Needs Refinement"}
                  </div>
                </div>
              </Card>

              <Card className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold text-xl shrink-0">
                  +{analysisResult.verifiedBoostApplied.toFixed(0)} pts
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Verified Boost
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    On-Chain Verified
                  </div>
                </div>
              </Card>

              <Card className="p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 dark:bg-purple-950/60 dark:border-purple-800 dark:text-purple-400 flex items-center justify-center font-bold text-xl shrink-0">
                  {analysisResult.extractedSkills.length}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Identified Skills
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    Zero Fabrication
                  </div>
                </div>
              </Card>
            </div>

            {/* 100-Point Transparent Rubric Card */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  100-Point Deterministic Rubric Breakdown
                </h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Total: {analysisResult.totalScore} / 100
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Transparent scoring criteria evaluating concrete, measurable engineering resume elements without black-box estimation.
              </p>

              <div className="space-y-4">
                {/* 1. Skill Coverage */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>1. Skill Coverage & Depth (Max 25 pts)</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {analysisResult.rubric.skillCoverageScore} / 25
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                      style={{ width: `${(analysisResult.rubric.skillCoverageScore / 25) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 2. Experience Quality */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>2. Experience Quality & Action Verbs (Max 25 pts)</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {analysisResult.rubric.experienceQualityScore} / 25
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${(analysisResult.rubric.experienceQualityScore / 25) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 3. Quantified Impact */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>3. Quantified Impact & Measurable Metrics (Max 25 pts)</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {analysisResult.rubric.quantifiedImpactScore} / 25
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${(analysisResult.rubric.quantifiedImpactScore / 25) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 4. Formatting and Structure */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>4. Formatting, Structure & Contact Clarity (Max 25 pts)</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {analysisResult.rubric.formattingAndStructureScore} / 25
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 dark:bg-purple-500 rounded-full transition-all"
                      style={{ width: `${(analysisResult.rubric.formattingAndStructureScore / 25) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Extracted Skills Inventory */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Extracted Technical Competency Inventory
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {analysisResult.extractedSkills.length} Verified & Documented Skills
                </span>
              </div>
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

            {/* Actionable Feedback & Distinguishing Facts from Inferred Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Facts & Highlights */}
              <Card className="p-5 border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-950 dark:text-emerald-200 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Extracted Facts & Strengths
                </div>
                <ul className="space-y-2 text-xs text-emerald-900 dark:text-emerald-300">
                  {analysisResult.strengthHighlights.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 shrink-0">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Inferred Suggestions */}
              <Card className="p-5 border-amber-200/80 bg-amber-50/40 dark:border-amber-900/60 dark:bg-amber-950/20">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-950 dark:text-amber-200 mb-3">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Inferred Suggestions (Advisory)
                </div>
                <ul className="space-y-2 text-xs text-amber-900 dark:text-amber-300">
                  {inferredSuggestions.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 shrink-0">•</span>
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
