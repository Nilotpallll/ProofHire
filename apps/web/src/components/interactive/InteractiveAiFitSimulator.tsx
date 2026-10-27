"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  TrendingUp,
  FileText,
  Briefcase,
  Users,
} from "lucide-react";

interface CandidateProfile {
  id: string;
  name: string;
  title: string;
  school: string;
  baseScore: number;
  boostedScore: number;
  verifiedCount: number;
  unverifiedCount: number;
  verifiedSkills: string[];
  unverifiedSkills: string[];
  notes: string;
}

const CANDIDATES: CandidateProfile[] = [
  {
    id: "alex",
    name: "Alex Rivera",
    title: "Senior Blockchain Engineer",
    school: "Stanford University (B.S. CS '25)",
    baseScore: 68,
    boostedScore: 96,
    verifiedCount: 3,
    unverifiedCount: 0,
    verifiedSkills: ["Solidity", "Distributed Systems", "TypeScript", "Cryptography", "Ethereum EVM"],
    unverifiedSkills: [],
    notes: "100% of claimed degrees and competencies backed by active Ethereum smart contract proofs.",
  },
  {
    id: "taylor",
    name: "Taylor Smith",
    title: "Full-Stack Web3 Developer",
    school: "Self-Reported Online Bootcamp",
    baseScore: 72,
    boostedScore: 74,
    verifiedCount: 1,
    unverifiedCount: 2,
    verifiedSkills: ["React", "JavaScript"],
    unverifiedSkills: ["Zero-Knowledge Proofs (Unverified)", "Smart Contract Auditing (No Record)"],
    notes: "Resume lists high-level cryptography claims, but on-chain verifier confirms no institutional signatures.",
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    title: "AI & Distributed Systems Specialist",
    school: "MIT Media Lab Fellow",
    baseScore: 65,
    boostedScore: 91,
    verifiedCount: 2,
    unverifiedCount: 1,
    verifiedSkills: ["Python", "PyTorch", "Consensus Algorithms"],
    unverifiedSkills: ["Rust (Self-declared)"],
    notes: "Core academic degree confirmed; secondary self-taught language flagged for quick technical screening.",
  },
];

export function InteractiveAiFitSimulator() {
  const [selectedCandidate, setSelectedCandidate] = React.useState<CandidateProfile>(CANDIDATES[0]);
  const [enableCryptoBoost, setEnableCryptoBoost] = React.useState(true);
  const [targetRole, setTargetRole] = React.useState("Senior Blockchain Architect");

  const currentScore = enableCryptoBoost
    ? selectedCandidate.boostedScore
    : selectedCandidate.baseScore;

  // Arc calculation for radial gauge
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl shadow-luxury overflow-hidden p-6 sm:p-10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>AI Recruiter Match Intelligence</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Smart Resume Scoring with Cryptographic Truth Boosts
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            See how ProofHire eliminates keyword stuffing by elevating candidates whose credentials are mathematically verified.
          </p>
        </div>

        {/* Verification Boost Switch */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start md:self-center">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300 pl-1">
            Cryptographic Boost:
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={enableCryptoBoost}
            onClick={() => setEnableCryptoBoost(!enableCryptoBoost)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              enableCryptoBoost ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                enableCryptoBoost ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Target Position and Candidate Selectors */}
      <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Candidate Selector */}
        <div className="md:col-span-8 space-y-2">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Select Candidate Pipeline Profile:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {CANDIDATES.map((cand) => {
              const isSelected = selectedCandidate.id === cand.id;
              return (
                <button
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {cand.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {cand.school}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      {cand.verifiedCount} Verified
                    </span>
                    {cand.unverifiedCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                        {cand.unverifiedCount} Unproven
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Role Selector */}
        <div className="md:col-span-4 space-y-2">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Job Requisition Target:
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option>Senior Blockchain Architect</option>
            <option>Lead Distributed Systems Engineer</option>
            <option>Smart Contract Security Auditor</option>
          </select>
        </div>
      </div>

      {/* Main Score & Audit Breakdown */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radial AI Gauge */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className={`transition-all duration-700 ease-out ${
                  currentScore >= 90
                    ? "text-emerald-500"
                    : currentScore >= 75
                    ? "text-brand-500"
                    : "text-amber-500"
                }`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {currentScore}%
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                AI Match Score
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
            {enableCryptoBoost && selectedCandidate.boostedScore > selectedCandidate.baseScore ? (
              <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                +{selectedCandidate.boostedScore - selectedCandidate.baseScore}% Verification Boost
              </span>
            ) : (
              <span className="text-slate-500">Unboosted Keyword Matching</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            {enableCryptoBoost
              ? "Score adjusted by institutional Ethereum smart contract proofs."
              : "Standard text parser without tamper-proof validation."}
          </p>
        </div>

        {/* Competency Audit Breakdown */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cryptographic Skill Audit Matrix
            </span>
            <Badge variant={selectedCandidate.unverifiedCount === 0 ? "verified" : "pending"} size="sm">
              {selectedCandidate.unverifiedCount === 0 ? "Zero Embellishments" : "Discrepancy Found"}
            </Badge>
          </div>

          {/* Verified competencies */}
          <div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="h-4 w-4" />
              Instituionally Verified Skills ({selectedCandidate.verifiedSkills.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedCandidate.verifiedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Unverified claims */}
          {selectedCandidate.unverifiedSkills.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="h-4 w-4" />
                Unverified Resume Claims Flagged ({selectedCandidate.unverifiedSkills.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCandidate.unverifiedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium"
                  >
                    <AlertTriangle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Evaluator Notes */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-200">AI Audit Synthesis: </span>
            {selectedCandidate.notes}
          </div>
        </div>
      </div>
    </div>
  );
}
