"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { CredentialStatusIndicator } from "@/components/ui/CredentialStatusIndicator";
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
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  FileText,
  AlertCircle,
  Copy,
  Check,
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
          recipient: "Alex Rivera",
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3.5 py-1 text-xs font-semibold text-brand-700 shadow-subtle">
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                <span>Next-Gen Decentralized Credential Verification</span>
              </div>

              {/* Tagline & Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-[1.15]">
                  Your achievements deserve to be{" "}
                  <span className="text-brand-600 underline decoration-brand-200 decoration-wavy underline-offset-8">
                    trusted.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Verify professional credentials, showcase authentic achievements, and make more informed hiring decisions with blockchain-backed proofs and AI-assisted recruitment.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/register">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Explore ProofHire
                  </Button>
                </Link>
                <Link href="/verify/demo-credential">
                  <Button variant="outline" size="lg" leftIcon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}>
                    Verify a Credential
                  </Button>
                </Link>
              </div>

              {/* Micro Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Cryptographically Signed
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Instant Public Verifier
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Zero-Knowledge Privacy
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Verification Demonstration Widget */}
        <section className="py-16 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-8">
              <Badge variant="brand" size="sm">
                Live Demonstration
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Test the Public Verifier Instantly
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                Select a demonstration credential below or type any cryptographic hash to inspect its decentralized audit trail in real time.
              </p>
            </div>

            {/* Verifier Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
              {/* Presets */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Sample Data:
                </span>
                <button
                  onClick={() => {
                    setDemoQuery("CRED-STANFORD-2025-001");
                    handleRunVerification("CRED-STANFORD-2025-001");
                  }}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                    demoQuery === "CRED-STANFORD-2025-001"
                      ? "border-brand-500 bg-brand-50 text-brand-700 font-semibold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
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
                      ? "border-brand-500 bg-brand-50 text-brand-700 font-semibold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
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
                      ? "border-red-500 bg-red-50 text-red-700 font-semibold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
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
                  className="w-full sm:w-auto shrink-0"
                >
                  Verify Authenticity
                </Button>
              </div>

              {/* Result Preview Box */}
              {verificationResult && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          verificationResult.isRevoked
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {verificationResult.title}
                        </h3>
                        <p className="text-xs text-slate-500">
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
                      <span className="font-semibold text-slate-900">
                        {verificationResult.recipient}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider font-medium text-[10px]">
                        Issue Date
                      </span>
                      <span className="font-semibold text-slate-900">
                        {verificationResult.issueDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider font-medium text-[10px]">
                        Network Proof
                      </span>
                      <span className="font-mono text-slate-700">
                        Ethereum Sepolia
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider font-medium text-[10px]">
                        Storage
                      </span>
                      <span className="font-mono text-slate-700">
                        IPFS Pinning
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-slate-200/70 text-[11px] font-mono text-slate-500">
                    <div className="flex items-center gap-2 truncate max-w-md">
                      <span className="text-slate-400">TX:</span>
                      <span className="truncate">{verificationResult.txHash}</span>
                      <button
                        onClick={() => copyTx(verificationResult.txHash)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy Transaction Hash"
                      >
                        {copiedHash ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>

                    <Link
                      href={`/verify/${encodeURIComponent(demoQuery)}`}
                      className="text-brand-600 hover:text-brand-800 font-sans font-semibold inline-flex items-center gap-1"
                    >
                      View Public Proof Page <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. How ProofHire Works (3-Step Pipeline) */}
        <section className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-14">
              <Badge variant="neutral" size="sm">
                Decentralized Architecture
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                How ProofHire Works
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                A high-trust trifecta connecting institutions, students, and employers through verifiable cryptography.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-card space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg border border-brand-200">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Institution Issues Proof
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Universities and certification bodies sign digital credentials with approved institutional wallets, anchoring the Merkle root on the blockchain.
                </p>
                <div className="pt-2 text-xs font-semibold text-brand-600 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Tamper-Proof Cryptography
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-card space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg border border-brand-200">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Student Owns Credentials
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students aggregate verified diplomas, degrees, and certificates in a sovereign digital wallet, retaining permanent proof of accomplishments.
                </p>
                <div className="pt-2 text-xs font-semibold text-brand-600 flex items-center gap-1">
                  <Lock className="h-4 w-4" /> Non-Custodial Ownership
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-card space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-lg border border-brand-200">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Recruiter Matches & Hires
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Employers evaluate candidates through AI-matched pipelines backed by zero-knowledge verified skills, eliminating 100% of resume embellishments.
                </p>
                <div className="pt-2 text-xs font-semibold text-brand-600 flex items-center gap-1">
                  <Cpu className="h-4 w-4" /> AI Verified Candidate Fit
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Multi-Role Use Cases */}
        <section className="py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <Badge variant="brand" size="sm">
                Built for Every Stakeholder
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Tailored for Real-World Recruitment
              </h2>
            </div>

            {/* Role Tab Buttons */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-xl bg-slate-100 p-1.5 border border-slate-200">
                <button
                  onClick={() => setActiveUseCaseTab("students")}
                  className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeUseCaseTab === "students"
                      ? "bg-white text-slate-900 shadow-subtle"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <GraduationCap className="h-4 w-4" /> For Students & Candidates
                </button>
                <button
                  onClick={() => setActiveUseCaseTab("recruiters")}
                  className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeUseCaseTab === "recruiters"
                      ? "bg-white text-slate-900 shadow-subtle"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Briefcase className="h-4 w-4" /> For Recruiters & Companies
                </button>
                <button
                  onClick={() => setActiveUseCaseTab("institutions")}
                  className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeUseCaseTab === "institutions"
                      ? "bg-white text-slate-900 shadow-subtle"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Building2 className="h-4 w-4" /> For Educational Institutions
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8">
              {activeUseCaseTab === "students" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Stand out with mathematically verifiable credentials.
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Never worry about losing paper diplomas or having your hard-earned achievements questioned. ProofHire provides student-owned profiles verified on-chain.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        AI resume feedback identifying strengths and missing skills
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Public verified portfolio link (/u/username) to share with hiring managers
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
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
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-900">
                        Student Portfolio Preview
                      </span>
                      <Badge variant="verified" size="sm" icon>
                        Verified Profile
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Alex Rivera</p>
                    <p className="text-xs text-slate-500">
                      B.S. Computer Science • Stanford University • GPA 3.92
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                        TypeScript (Verified)
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                        Solidity (Verified)
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded">
                        Distributed Systems
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeUseCaseTab === "recruiters" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Hire with 100% confidence. Zero background check latency.
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Eliminate the 2-week delays and third-party fee overhead of legacy background verification agencies.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        AI match scores highlighting candidate alignment against job requirements
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Instant 1-click verification of degrees and certifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
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
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-900">
                        Candidate Pipeline Preview
                      </span>
                      <Badge variant="brand" size="sm">
                        AI Fit 94%
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      Candidate has 2 verified credentials matching 100% of required competencies.
                    </p>
                    <div className="text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-600">
                      Senior Blockchain Engineer candidate passed all cryptographic signature checks.
                    </div>
                  </div>
                </div>
              )}

              {activeUseCaseTab === "institutions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Modernize alumni credentials with cryptographic permanence.
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Issue verifiable tamper-proof degrees, diplomas, and certificates directly into alumni digital wallets with zero recurring verification overhead.
                    </p>
                    <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Controlled issuance portal for approved academic administrators
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        On-chain revocation capabilities for academic integrity enforcement
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
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
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-900">
                        Issuance Console Preview
                      </span>
                      <Badge variant="verified" size="sm" icon>
                        Accredited Issuer
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Stanford School of Engineering • Total Issued: 1,420
                    </p>
                    <div className="text-[11px] font-mono bg-slate-50 p-2 rounded text-slate-500 border border-slate-200">
                      Hash: 0x8f2d59a7... Merkle Verified
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. Security & Privacy Principles */}
        <section className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <Badge variant="neutral" size="sm">
                Cryptographic Rigor
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Security & Privacy by Design
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                No personal data is exposed on public ledgers. We believe true verification should never compromise student privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-2">
                <Lock className="h-6 w-6 text-brand-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Zero-Knowledge Proofs
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Verify credential validity and qualification without disclosing underlying private identity documents.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-2">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Non-Custodial Ownership
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Students own their credentials forever. Platforms cannot seize or alter an issued academic proof.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-2">
                <Layers className="h-6 w-6 text-brand-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  IPFS Decentralized Storage
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Credential documents are encrypted and pinned to decentralized IPFS storage rather than centralized silos.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-2">
                <AlertCircle className="h-6 w-6 text-amber-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  On-Chain Revocation
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Legitimate institutions can promptly revoke fraudulent or disputed credentials with full transparent rationale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Frequently Asked Questions */}
        <section className="py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-12">
              <Badge variant="neutral" size="sm">
                Knowledge Base
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-subtle transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 text-sm hover:bg-slate-50"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-brand-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. Final Call to Action */}
        <section className="py-20 bg-gradient-to-b from-brand-950 to-slate-950 text-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to verify credentials and hire faster?
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Join students, recruiters, and educational institutions utilizing tamper-proof decentralized identity rails.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/register">
                <Button variant="primary" size="lg" className="bg-brand-500 hover:bg-brand-600">
                  Create ProofHire Account
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-slate-700 text-white hover:bg-slate-900"
                >
                  Sign In to Demo Portals
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
