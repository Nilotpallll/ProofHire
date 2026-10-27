"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Cpu,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Terminal,
} from "lucide-react";

interface ClaimOption {
  id: string;
  title: string;
  institution: string;
  publicClaim: string;
  hiddenDetails: string;
  merkleRoot: string;
  leafHash: string;
  proofDigest: string;
}

const CLAIMS: ClaimOption[] = [
  {
    id: "gpa-cs",
    title: "Bachelor of Science in Computer Science",
    institution: "Stanford University",
    publicClaim: "Holds accredited B.S. Degree with Honors (GPA ≥ 3.8)",
    hiddenDetails: "Exact GPA: 3.94, SSN/ID: 981-XX-4412, Course Grades: A, A+, A",
    merkleRoot: "0x8f2d59a721c034988bf2a3167b545f949c890250dfacdbca991c10729729cfa9",
    leafHash: "0x3c990a56e5223a4b64c18c99277d337f75eb1432c253457a4e69b0faee2ef124",
    proofDigest: "zk-snark-groth16:0x7e29a1b04f...b789e",
  },
  {
    id: "mit-crypto",
    title: "Advanced Cryptographic Engineering",
    institution: "MIT Media Lab",
    publicClaim: "Qualified in Zero-Knowledge Protocols & Elliptic Curve Pairings",
    hiddenDetails: "Student ID: MIT-889104, Lab Repository: private/vault-zk",
    merkleRoot: "0x14ea523097bf54a20b78ca9013c473be921501726a310bbfa4995c80ef429188",
    leafHash: "0x7b11c90a1492a54b38d19a99781b456e72cb1531e253998a4e69c0faee2a991b",
    proofDigest: "zk-snark-plonk:0x91d4e08c1a...ef32a",
  },
  {
    id: "berk-systems",
    title: "Distributed Systems & Consensus Engineering",
    institution: "UC Berkeley",
    publicClaim: "Proven Competency in Raft, Paxos, and EVM Internal Architecture",
    hiddenDetails: "Student Roll: 2021-UCB-99, Full Transcript: 120 credit units",
    merkleRoot: "0x4a82f12209d81643c98ba0319ef41291820cbaf01e23910ab31e8400192a831e",
    leafHash: "0x6e2a15998a120401bcf9100234a9194e10492ab41029e00194819aef340192e1",
    proofDigest: "zk-snark-groth16:0x51c4a9082...120ef",
  },
];

export function InteractiveZkProofVisualizer() {
  const [selectedClaim, setSelectedClaim] = React.useState<ClaimOption>(CLAIMS[0]);
  const [isZkMode, setIsZkMode] = React.useState(true);
  const [computing, setComputing] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(3); // 3 = fully verified
  const [copiedProof, setCopiedProof] = React.useState(false);

  const triggerVerification = (claim: ClaimOption) => {
    setSelectedClaim(claim);
    setComputing(true);
    setStepIndex(0);

    setTimeout(() => setStepIndex(1), 300);
    setTimeout(() => setStepIndex(2), 700);
    setTimeout(() => {
      setStepIndex(3);
      setComputing(false);
    }, 1100);
  };

  const copyProof = () => {
    navigator.clipboard.writeText(
      JSON.stringify(
        {
          protocol: "ProofHire-ZK-v2",
          claim: selectedClaim.publicClaim,
          issuer: selectedClaim.institution,
          merkleRoot: selectedClaim.merkleRoot,
          leafHash: selectedClaim.leafHash,
          proof: selectedClaim.proofDigest,
          valid: true,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );
    setCopiedProof(true);
    setTimeout(() => setCopiedProof(false), 2000);
  };

  return (
    <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl shadow-luxury overflow-hidden p-6 sm:p-10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
            <Cpu className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            <span>Interactive Zero-Knowledge Cryptography Visualizer</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Verify Qualification Without Exposing Private Data
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Experience how ProofHire proves candidate claims with mathematical zero-knowledge proofs.
          </p>
        </div>

        {/* ZK Mode Toggle Switch */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start md:self-center">
          <button
            onClick={() => setIsZkMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isZkMode
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-subtle"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Standard Disclosure
          </button>
          <button
            onClick={() => setIsZkMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isZkMode
                ? "bg-brand-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            Zero-Knowledge Mode
          </button>
        </div>
      </div>

      {/* Interactive Selection Tabs */}
      <div className="pt-6 space-y-3">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Select Credential Claim to Test:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CLAIMS.map((claim) => {
            const isSelected = selectedClaim.id === claim.id;
            return (
              <button
                key={claim.id}
                onClick={() => triggerVerification(claim)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? "border-brand-500 dark:border-brand-400 bg-brand-50/60 dark:bg-brand-950/40 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-ping" />
                  </div>
                )}
                <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wide block">
                  {claim.institution}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                  {claim.title}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 line-clamp-2">
                  {claim.publicClaim}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Pipeline Showcase */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Cryptographic Step Progression */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              Cryptographic Execution Pipeline
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => triggerVerification(selectedClaim)}
              isLoading={computing}
              leftIcon={<RefreshCw className={`h-3 w-3 ${computing ? "animate-spin" : ""}`} />}
            >
              Recompute
            </Button>
          </div>

          {/* Steps */}
          <div className="space-y-3 text-xs">
            {/* Step 1 */}
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                stepIndex >= 1
                  ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  Compute Document Keccak-256 Digest
                </span>
                {stepIndex >= 1 && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <div className="mt-1 font-mono text-[11px] truncate opacity-85">
                Hash: {selectedClaim.leafHash}
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                stepIndex >= 2
                  ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  Merkle Tree Membership Verification
                </span>
                {stepIndex >= 2 && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <div className="mt-1 font-mono text-[11px] truncate opacity-85">
                Root: {selectedClaim.merkleRoot}
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={`p-3.5 rounded-xl border transition-all ${
                stepIndex >= 3
                  ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    3
                  </span>
                  Zero-Knowledge Proof Validity Check
                </span>
                {stepIndex >= 3 && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <div className="mt-1 font-mono text-[11px] truncate opacity-85">
                Proof: {selectedClaim.proofDigest}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Contract Verifier: <code className="font-mono text-slate-800 dark:text-slate-200">0x5FbDB231...80aa3</code>
            </span>
            <button
              onClick={copyProof}
              className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              {copiedProof ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              Copy Proof Payload
            </button>
          </div>
        </div>

        {/* Right: What Recruiter Sees vs Hidden State */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Recruiter Audit View
              </span>
              <Badge variant="verified" size="sm" icon>
                100% Mathematically Valid
              </Badge>
            </div>

            {/* Revealed statement */}
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Proven Claim
              </div>
              <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">
                "{selectedClaim.publicClaim}"
              </p>
            </div>

            {/* Privacy Section */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  {isZkMode ? (
                    <Lock className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 text-amber-600" />
                  )}
                  {isZkMode ? "Protected by Zero-Knowledge" : "Exposed Under Full Disclosure"}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {isZkMode ? "Zero Leakage" : "Full Visibility"}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                {isZkMode ? (
                  <span className="blur-xs select-none text-slate-400 dark:text-slate-600">
                    ██████████████████████████████████████████████
                  </span>
                ) : (
                  selectedClaim.hiddenDetails
                )}
              </p>
              {isZkMode && (
                <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium block pt-1">
                  Private transcripts, personal IDs, and un-consented records remain encrypted.
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span>Proof Protocol: </span>
            <strong className="text-slate-900 dark:text-white">Ethereum EIP-712 + Merkle Sparse Tree</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
