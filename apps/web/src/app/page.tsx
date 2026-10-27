"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import { useAuth } from "@/context/AuthContext";
import { InteractiveZkProofVisualizer } from "@/components/interactive/InteractiveZkProofVisualizer";
import { InteractiveAiFitSimulator } from "@/components/interactive/InteractiveAiFitSimulator";
import { InteractiveBlockchainExplorerWidget } from "@/components/interactive/InteractiveBlockchainExplorerWidget";
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
  Sparkles,
  Award,
  Zap,
  Globe,
  Fingerprint,
  ExternalLink,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { seedLogin } = useAuth();
  const [verifyInput, setVerifyInput] = React.useState("CRED-STANFORD-2025-001");
  const [activeStudioTab, setActiveStudioTab] = React.useState<"zk" | "ai" | "blockchain">("zk");
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyInput.trim()) {
      router.push(`/verify/${encodeURIComponent(verifyInput.trim())}`);
    }
  };

  const setPreset = (id: string) => {
    setVerifyInput(id);
    router.push(`/verify/${encodeURIComponent(id)}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-brand-500/30">
      {/* Ambient Depth Background */}
      <HeroAtmosphere />
      <Navbar />

      <main className="relative z-10 flex-1 flex flex-col items-center">
        {/* 1. MINIMALIST HERO SECTION */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center space-y-6">
          {/* Subtle Protocol Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">
              ProofHire Protocol 2.4 · Live on Sepolia
            </span>
            <span className="text-[10px] text-brand-400 font-mono font-semibold uppercase">EIP-712</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Trust Skills. Verify Credentials.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Hire Instantly.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The decentralized trust layer uniting Ethereum cryptographic attestations, privacy-preserving zero-knowledge proofs, and verified AI talent intelligence.
          </p>

          {/* Minimalist Instant Verification Input */}
          <div className="max-w-xl mx-auto pt-2 space-y-2">
            <form onSubmit={handleVerifySubmit} className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-luxury backdrop-blur-xl">
              <div className="pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Enter Credential ID or Tx Hash..."
                value={verifyInput}
                onChange={(e) => setVerifyInput(e.target.value)}
                className="w-full bg-transparent border-0 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-0"
              />
              <Button type="submit" variant="primary" size="sm" className="shrink-0 shadow-glow-brand">
                Verify On-Chain
              </Button>
            </form>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
              <span>Try sample:</span>
              <button
                type="button"
                onClick={() => setPreset("CRED-STANFORD-2025-001")}
                className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors font-mono"
              >
                Stanford CS Degree
              </button>
              <button
                type="button"
                onClick={() => setPreset("CRED-MIT-2025-089")}
                className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors font-mono"
              >
                MIT Crypto Cert
              </button>
              <button
                type="button"
                onClick={() => setPreset("REVOKED-DEMO-CRED")}
                className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-red-900/60 text-red-400 transition-colors font-mono"
              >
                Revoked Sample
              </button>
            </div>
          </div>

          {/* Direct Portals Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link href="/login">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />} className="shadow-glow-brand">
                Enter Platform
              </Button>
            </Link>
            <a href="#interactive-studio">
              <Button variant="outline" size="md" className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900">
                Explore Studio Console ↓
              </Button>
            </a>
          </div>
        </section>

        {/* 2. REFINED TELEMETRY STRIP (Compact & Clean) */}
        <section className="w-full border-y border-slate-800/80 bg-slate-900/40 backdrop-blur-md py-3.5 px-4">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-slate-300">Ethereum Sepolia #4,892,140</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
              <span><strong className="text-slate-200">18,490+</strong> Credentials Anchored</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-purple-400" />
              <span><strong className="text-slate-200">100%</strong> Zero-Knowledge Privacy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span><strong className="text-slate-200">0.42s</strong> Cryptographic Latency</span>
            </div>
          </div>
        </section>

        {/* 3. THE UNIFIED PROOFHIRE STUDIO (Segmented, Minimalist Feature Console) */}
        <section id="interactive-studio" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              ProofHire Interactive Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Test zero-knowledge cryptographic proofs, AI candidate fit scoring, and decentralized block telemetry in one minimal workspace.
            </p>
          </div>

          {/* Segmented Control Switcher */}
          <div className="flex items-center justify-center">
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-subtle">
              <button
                type="button"
                onClick={() => setActiveStudioTab("zk")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeStudioTab === "zk"
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Fingerprint className="h-3.5 w-3.5" />
                Zero-Knowledge Verifier
              </button>
              <button
                type="button"
                onClick={() => setActiveStudioTab("ai")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeStudioTab === "ai"
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                AI Fit & Claim Audit
              </button>
              <button
                type="button"
                onClick={() => setActiveStudioTab("blockchain")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeStudioTab === "blockchain"
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                On-Chain Explorer
              </button>
            </div>
          </div>

          {/* Console Window Frame */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-1 shadow-luxury">
            {activeStudioTab === "zk" && (
              <div className="p-4 sm:p-6 animate-fadeIn">
                <InteractiveZkProofVisualizer />
              </div>
            )}
            {activeStudioTab === "ai" && (
              <div className="p-4 sm:p-6 animate-fadeIn">
                <InteractiveAiFitSimulator />
              </div>
            )}
            {activeStudioTab === "blockchain" && (
              <div className="p-4 sm:p-6 animate-fadeIn">
                <InteractiveBlockchainExplorerWidget />
              </div>
            )}
          </div>
        </section>

        {/* 4. THREE PILLARS (Clean, Uncluttered Grid) */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Engineered for the Entire Hiring Ecosystem
            </h2>
            <p className="text-xs text-slate-400">
              Three dedicated stakeholder workflows anchored to one immutable standard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Pillar */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">For Students & Alumni</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take complete ownership of your sovereign credentials. Prove your degrees, GPA, and security clearances using zero-knowledge proofs without exposing private personal records.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Portable cryptographic wallet
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Instant 1-click recruiter verification
                </li>
              </ul>
            </div>

            {/* Recruiter Pillar */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">For Recruiters & Enterprise</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Slash candidate background checking delays from 3 weeks to 0.42 seconds. Unbiased AI candidate matching highlights verified achievements and flags embellished claims.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Zero credential fraud guarantee
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Cryptographic verification matching boost
                </li>
              </ul>
            </div>

            {/* Institution Pillar */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-slate-700 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">For Accredited Institutions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Issue tamper-proof degrees with Keccak-256 Merkle root anchoring on Ethereum. Eliminate bureaucratic transcript requests and maintain instant, auditable revocation capabilities.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Smart contract issuance registry
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Permanent tamper-proof audit trail
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. DIRECT ROLE ACCESS BAR (One-Click Portals) */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-800/80">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Instant One-Click Role Demonstration</h3>
              <p className="text-xs text-slate-400">Launch any dedicated portal view immediately:</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => seedLogin("STUDENT")}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                Student Portal
              </button>
              <button
                type="button"
                onClick={() => seedLogin("RECRUITER")}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                Recruiter Portal
              </button>
              <button
                type="button"
                onClick={() => seedLogin("INSTITUTION")}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                Institution Portal
              </button>
              <button
                type="button"
                onClick={() => seedLogin("ADMIN")}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                SuperAdmin
              </button>
            </div>
          </div>
        </section>

        {/* 6. MINIMALIST FAQ */}
        <section className="w-full max-w-3xl mx-auto px-4 py-16 border-t border-slate-800/80 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Essential protocol details and architectural foundations</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "How does on-chain credential verification prevent diploma fraud?",
                a: "When an authorized institution issues a degree or certificate, ProofHire computes its Keccak-256 cryptographic hash and anchors it into the CredentialRegistry Ethereum smart contract. Anyone can compare a document digest against this on-chain record; if even a single character or date is altered, the cryptographic digest changes completely and verification fails.",
              },
              {
                q: "What are Zero-Knowledge Proofs (ZKP) in ProofHire?",
                a: "Zero-Knowledge Proofs allow students to prove claims (e.g. 'I hold an accredited CS Degree with GPA > 3.8') without sharing their full academic transcript or revealing private personally identifiable information (PII).",
              },
              {
                q: "How does the AI intelligence service integrate with on-chain verification?",
                a: "The ProofHire AI microservice parses resumes, matches candidate competencies against job specifications, and audits claims. When a claim corresponds to an on-chain verified credential, the match algorithm applies a cryptographic verification boost (+28% to +35%), while highlighting unverified claims.",
              },
              {
                q: "How are institution accounts accredited and vetted?",
                a: "Public registration for institutions places accounts in a PENDING_APPROVAL state. Only platform SuperAdmins with governance permissions can authorize an institution on the smart contract registry.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      openFaq === idx ? "rotate-180 text-brand-400" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
