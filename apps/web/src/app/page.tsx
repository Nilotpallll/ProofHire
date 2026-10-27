"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { CredentialStatusIndicator } from "@/components/ui/CredentialStatusIndicator";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { LuxurySpotlightCard } from "@/components/ui/LuxurySpotlightCard";
import { LiveNetworkTicker } from "@/components/interactive/LiveNetworkTicker";
import { InteractiveZkProofVisualizer } from "@/components/interactive/InteractiveZkProofVisualizer";
import { InteractiveAiFitSimulator } from "@/components/interactive/InteractiveAiFitSimulator";
import { InteractiveBlockchainExplorerWidget } from "@/components/interactive/InteractiveBlockchainExplorerWidget";
import { LiveStatsCounter } from "@/components/interactive/LiveStatsCounter";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Lock,
  Cpu,
  GraduationCap,
  Building2,
  Briefcase,
  Users,
  ArrowRight,
  ChevronDown,
  Layers,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Award,
  Zap,
  Globe,
  Fingerprint,
} from "lucide-react";

export default function LandingPage() {
  // Verification Demo State
  const [demoQuery, setDemoQuery] = React.useState("CRED-STANFORD-2025-001");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verificationResult, setVerificationResult] = React.useState<{
    isValid: boolean;
    title: string;
    recipient: string;
    institution: string;
    issueDate: string;
    txHash: string;
    ipfsHash: string;
    isRevoked: boolean;
  } | null>({
    isValid: true,
    title: "Bachelor of Science in Computer Science",
    recipient: "Alex Rivera",
    institution: "Stanford School of Engineering",
    issueDate: "June 15, 2025",
    txHash: "0x3c990a56e5223a4b64c18c99277d337f75eb1432c253457a4e69b0faee2ef124",
    ipfsHash: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    isRevoked: false,
  });

  const [activeUseCaseTab, setActiveUseCaseTab] = React.useState<
    "students" | "recruiters" | "institutions"
  >("students");

  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [copiedHash, setCopiedHash] = React.useState(false);

  const handleRunVerification = (presetId?: string) => {
    const idToUse = presetId || demoQuery;
    setIsVerifying(true);
    setTimeout(() => {
      if (idToUse.includes("REVOKED")) {
        setVerificationResult({
          isValid: false,
          title: "Honorary Web Certificate",
          recipient: "John Doe",
          institution: "Stanford School of Engineering",
          issueDate: "May 10, 2024",
          txHash: "0x892a0142...revoked",
          ipfsHash: "ipfs://QmRevokedDemo",
          isRevoked: true,
        });
      } else if (idToUse.includes("MIT")) {
        setVerificationResult({
          isValid: true,
          title: "Advanced Cryptographic Engineering Certificate",
          recipient: "Elena Rostova",
          institution: "MIT Decentralized Media Lab",
          issueDate: "August 20, 2025",
          txHash: "0x7b11c90a1492a54b38d19a99781b456e72cb1531e253998a4e69c0faee2a991b",
          ipfsHash: "ipfs://QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
          isRevoked: false,
        });
      } else {
        setVerificationResult({
          isValid: true,
          title: "Bachelor of Science in Computer Science",
          recipient: "Alex Rivera",
          institution: "Stanford School of Engineering",
          issueDate: "June 15, 2025",
          txHash: "0x3c990a56e5223a4b64c18c99277d337f75eb1432c253457a4e69b0faee2ef124",
          ipfsHash: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
          isRevoked: false,
        });
      }
      setIsVerifying(false);
    }, 450);
  };

  const copyTx = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const faqs = [
    {
      q: "How does ProofHire eliminate fake degrees and resume fraud?",
      a: "Accredited institutions sign credential metadata with authorized cryptographic keys. The cryptographic root is recorded on the Ethereum blockchain. Recruiters and employers can mathematically verify authenticity in milliseconds without waiting weeks for university registrars.",
    },
    {
      q: "Are student grades and personal documents public on the blockchain?",
      a: "No. Student privacy is strictly protected. Only cryptographic hashes and zero-knowledge proofs are stored on-chain. Sensitive documents are stored on encrypted IPFS nodes and accessible only with student consent.",
    },
    {
      q: "How does the AI matching service work?",
      a: "Our AI service parses resumes and extracts candidate technical proficiencies. It cross-references extracted skills with tamper-proof blockchain credentials to assign a verified credibility score, preventing skill fabrication and resume keyword stuffing.",
    },
    {
      q: "Can an institution revoke a degree if academic misconduct is found?",
      a: "Yes. Authorized institutions retain on-chain revocation controls. When a credential is revoked, the smart contract immediately marks the credential hash as REVOKED, and any future verification checks will flag it in real time with the recorded rationale.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090D1A] transition-colors relative selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Live Ethereum Telemetry Ticker */}
      <LiveNetworkTicker />

      <main id="main-content" className="flex-1 space-y-20 pb-20">
        {/* 1. Hero Section with Atmosphere and Interactive 3D Preview */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 border-b border-slate-200/80 dark:border-slate-800">
          <HeroAtmosphere />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines & Actions */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Floating pill badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/90 dark:border-brand-800/80 bg-white/80 dark:bg-brand-950/60 px-3.5 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300 shadow-sm backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                  </span>
                  <span>Next-Gen Decentralized Credential Infrastructure</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="font-mono text-[10px] text-brand-600 dark:text-brand-400">v2.4 Live</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                  Your achievements deserve to be{" "}
                  <span className="text-gradient-brand">
                    mathematically trusted.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  ProofHire bridges accredited universities, students, and recruiters with cryptographic Ethereum proofs, zero-knowledge privacy, and AI candidate matching.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link href="/register">
                    <Button variant="primary" size="lg" className="shadow-glow-brand" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Explore ProofHire
                    </Button>
                  </Link>
                  <Link href="/verify/CRED-STANFORD-2025-001">
                    <Button
                      variant="outline"
                      size="lg"
                      className="glass-card shadow-subtle hover:border-brand-400"
                      leftIcon={<ShieldCheck className="h-4 w-4 text-emerald-500" />}
                    >
                      Instant Verifier Tool
                    </Button>
                  </Link>
                </div>

                {/* Micro trust indicators */}
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Cryptographic Ethereum Signatures
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Zero-Knowledge Privacy
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Instant Recruiter Matching
                  </span>
                </div>
              </div>

              {/* Right Column: Holographic Certificate Showcase */}
              <div className="lg:col-span-5 relative">
                <LuxurySpotlightCard
                  glowColor="blue"
                  className="p-6 sm:p-7 border-brand-200/80 dark:border-slate-800 shadow-2xl relative"
                >
                  {/* Holographic Watermark Badge */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white flex items-center justify-center shadow-glow-brand">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">
                          DECENTRALIZED CREDENTIAL RECORD
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Stanford University
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ON-CHAIN VERIFIED
                    </div>
                  </div>

                  {/* Certificate Body */}
                  <div className="py-5 space-y-3">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                      Academic Degree
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                      Bachelor of Science in Computer Science
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Awarded to <strong className="text-slate-900 dark:text-white">Alex Rivera</strong> with Highest Distinction • GPA 3.94
                    </p>

                    {/* Cryptographic Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        Algorithms (Verified)
                      </span>
                      <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        Distributed Systems (Verified)
                      </span>
                      <span className="bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                        Ethereum EVM
                      </span>
                    </div>
                  </div>

                  {/* Hash Footer */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>ROOT DIGEST:</span>
                      <span className="truncate max-w-[170px] text-slate-700 dark:text-slate-300 font-semibold">
                        0x8f2d59...cfa9
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>BLOCK:</span>
                      <span className="text-brand-600 dark:text-brand-400 font-semibold">
                        #4,912,482 (Sepolia)
                      </span>
                    </div>
                  </div>

                  {/* Floating seal */}
                  <div className="absolute -bottom-3 -right-3 h-14 w-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex flex-col items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 rotate-12">
                    <Award className="h-6 w-6 text-slate-950" />
                    <span className="text-[8px] font-black text-slate-950 uppercase leading-none">VERIFIED</span>
                  </div>
                </LuxurySpotlightCard>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Platform Telemetry & Live Milestone Counters */}
        <LiveStatsCounter />

        {/* 3. Interactive Zero-Knowledge Cryptography Visualizer */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <InteractiveZkProofVisualizer />
          </div>
        </section>

        {/* 4. Interactive Live Verifier Demonstration Widget */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="text-center space-y-2 mb-8">
              <Badge variant="brand" size="sm">
                Instant Verification Sandbox
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Test the Public Verifier Instantly
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Select a demonstration credential below or enter any cryptographic hash to inspect its decentralized audit trail in real time.
              </p>
            </div>

            {/* Verifier Card */}
            <LuxurySpotlightCard glowColor="blue" className="p-6 sm:p-8">
              {/* Presets */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Sample Data:
                </span>
                <button
                  onClick={() => {
                    setDemoQuery("CRED-STANFORD-2025-001");
                    handleRunVerification("CRED-STANFORD-2025-001");
                  }}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                    demoQuery === "CRED-STANFORD-2025-001"
                      ? "border-brand-500 bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950 dark:text-brand-300 dark:border-brand-600"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  Stanford B.S. Degree (Valid)
                </button>
                <button
                  onClick={() => {
                    setDemoQuery("CRED-MIT-2025-089");
                    handleRunVerification("CRED-MIT-2025-089");
                  }}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                    demoQuery === "CRED-MIT-2025-089"
                      ? "border-brand-500 bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950 dark:text-brand-300 dark:border-brand-600"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  MIT Crypto Certificate (Valid)
                </button>
                <button
                  onClick={() => {
                    setDemoQuery("REVOKED-DEMO-CRED");
                    handleRunVerification("REVOKED-DEMO-CRED");
                  }}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                    demoQuery === "REVOKED-DEMO-CRED"
                      ? "border-red-500 bg-red-50 text-red-700 font-semibold dark:bg-red-950 dark:text-red-300 dark:border-red-600"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  Revoked Certificate (Demonstration)
                </button>
              </div>

              {/* Input Form */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full">
                  <Input
                    placeholder="Enter Credential ID or Keccak-256 Hash..."
                    value={demoQuery}
                    onChange={(e) => setDemoQuery(e.target.value)}
                    leftAddon={<Search className="h-4 w-4" />}
                    aria-label="Credential identifier"
                  />
                </div>
                <Button
                  onClick={() => handleRunVerification()}
                  isLoading={isVerifying}
                  variant="primary"
                  className="w-full sm:w-auto shrink-0 shadow-glow-brand"
                >
                  Verify Authenticity
                </Button>
              </div>

              {/* Result Preview Box */}
              {verificationResult && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/60 p-5 space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          verificationResult.isRevoked
                            ? "bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400"
                        }`}
                      >
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {verificationResult.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Issued by {verificationResult.institution}
                        </p>
                      </div>
                    </div>
                    <CredentialStatusIndicator
                      status={verificationResult.isRevoked ? "REVOKED" : "ISSUED"}
                      txHash={verificationResult.txHash}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider font-medium text-[10px]">
                        Recipient
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {verificationResult.recipient}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider font-medium text-[10px]">
                        Issue Date
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {verificationResult.issueDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider font-medium text-[10px]">
                        Network Proof
                      </span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        Ethereum Sepolia
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider font-medium text-[10px]">
                        Storage
                      </span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        IPFS Pinning
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-slate-200/70 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2 truncate max-w-md">
                      <span className="text-slate-400">TX:</span>
                      <span className="truncate">{verificationResult.txHash}</span>
                      <button
                        onClick={() => copyTx(verificationResult.txHash)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        title="Copy Transaction Hash"
                      >
                        {copiedHash ? (
                          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>

                    <Link
                      href={`/verify/${encodeURIComponent(demoQuery)}`}
                      className="text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 font-sans font-semibold inline-flex items-center gap-1"
                    >
                      View Public Proof Page <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </LuxurySpotlightCard>
          </div>
        </section>

        {/* 5. Interactive AI Resume & Candidate Match Simulator */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <InteractiveAiFitSimulator />
          </div>
        </section>

        {/* 6. Real-Time Blockchain Explorer & Audit Registry Widget */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <InteractiveBlockchainExplorerWidget />
          </div>
        </section>

        {/* 7. Multi-Role Use Cases (Spotlight Showcase) */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center space-y-3 mb-12">
              <Badge variant="brand" size="sm">
                Built for Every Stakeholder
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Tailored for Real-World Recruitment
              </h2>
            </div>

            {/* Role Tab Buttons */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setActiveUseCaseTab("students")}
                  className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeUseCaseTab === "students"
                      ? "bg-white text-slate-900 dark:bg-slate-800 dark:text-white shadow-subtle"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <GraduationCap className="h-4 w-4" /> For Students & Candidates
                </button>
                <button
                  onClick={() => setActiveUseCaseTab("recruiters")}
                  className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeUseCaseTab === "recruiters"
                      ? "bg-white text-slate-900 dark:bg-slate-800 dark:text-white shadow-subtle"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <Briefcase className="h-4 w-4" /> For Recruiters & Companies
                </button>
                <button
                  onClick={() => setActiveUseCaseTab("institutions")}
                  className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeUseCaseTab === "institutions"
                      ? "bg-white text-slate-900 dark:bg-slate-800 dark:text-white shadow-subtle"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <Building2 className="h-4 w-4" /> For Educational Institutions
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <LuxurySpotlightCard glowColor="purple" className="p-8">
              {activeUseCaseTab === "students" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Stand out with mathematically verifiable credentials.
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Never worry about losing paper diplomas or having your hard-earned achievements questioned. ProofHire provides student-owned profiles verified on-chain.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        AI resume feedback identifying strengths and missing skills
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Public verified portfolio link (/u/username) to share with hiring managers
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Direct applications to top Web3 & tech job postings
                      </li>
                    </ul>
                    <div className="pt-2">
                      <Link href="/student/dashboard">
                        <Button variant="primary" size="sm">
                          Explore Student Portal
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Student Portfolio Preview
                      </span>
                      <Badge variant="verified" size="sm" icon>
                        Verified Profile
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Alex Rivera</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      B.S. Computer Science • Stanford University • GPA 3.92
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        TypeScript (Verified)
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        Solidity (Verified)
                      </span>
                      <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[11px] font-medium px-2 py-0.5 rounded">
                        Distributed Systems
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeUseCaseTab === "recruiters" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Hire with 100% confidence. Zero background check latency.
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Eliminate the 2-week delays and third-party fee overhead of legacy background verification agencies.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        AI match scores highlighting candidate alignment against job requirements
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Instant 1-click verification of degrees and certifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Hiring pipeline dashboard to manage candidates and interview statuses
                      </li>
                    </ul>
                    <div className="pt-2">
                      <Link href="/recruiter/dashboard">
                        <Button variant="primary" size="sm">
                          Explore Recruiter Portal
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Candidate Pipeline Preview
                      </span>
                      <Badge variant="brand" size="sm">
                        AI Fit 94%
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Candidate has 2 verified credentials matching 100% of required competencies.
                    </p>
                    <div className="text-[11px] bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                      Senior Blockchain Engineer candidate passed all cryptographic signature checks.
                    </div>
                  </div>
                </div>
              )}

              {activeUseCaseTab === "institutions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Modernize alumni credentials with cryptographic permanence.
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Issue verifiable tamper-proof degrees, diplomas, and certificates directly into alumni digital wallets with zero recurring verification overhead.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Controlled issuance portal for approved academic administrators
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        On-chain revocation capabilities for academic integrity enforcement
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        Elimination of fraudulent diploma mills pretending to represent your university
                      </li>
                    </ul>
                    <div className="pt-2">
                      <Link href="/institution/dashboard">
                        <Button variant="primary" size="sm">
                          Explore Institution Portal
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Issuance Console Preview
                      </span>
                      <Badge variant="verified" size="sm" icon>
                        Accredited Issuer
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Stanford School of Engineering • Total Issued: 1,420
                    </p>
                    <div className="text-[11px] font-mono bg-slate-50 dark:bg-slate-950 p-2 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                      Hash: 0x8f2d59a7... Merkle Verified
                    </div>
                  </div>
                </div>
              )}
            </LuxurySpotlightCard>
          </div>
        </section>

        {/* 8. Frequently Asked Questions */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center space-y-3 mb-12">
              <Badge variant="neutral" size="sm">
                Knowledge Base
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <LuxurySpotlightCard
                    key={index}
                    interactive={false}
                    className="overflow-hidden transition-all border-slate-200 dark:border-slate-800"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 dark:text-slate-100 text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-brand-600 dark:text-brand-400" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </LuxurySpotlightCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9. Final Call to Action */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl relative rounded-3xl overflow-hidden bg-gradient-to-tr from-brand-950 via-slate-950 to-indigo-950 p-10 sm:p-16 text-center text-white border border-slate-800 shadow-2xl">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-brand-500/20 rounded-full blur-[90px] pointer-events-none -z-0" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-[90px] pointer-events-none -z-0" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <Badge variant="brand" size="sm" className="bg-brand-900/60 text-brand-300 border-brand-700">
                Start In Minutes
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Ready to verify credentials and hire faster?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                Join forward-thinking universities, candidates, and hiring managers utilizing cryptographic proof rails.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                <Link href="/register">
                  <Button variant="primary" size="lg" className="shadow-glow-brand bg-brand-500 hover:bg-brand-600">
                    Create ProofHire Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                  >
                    Launch Demo Portals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
