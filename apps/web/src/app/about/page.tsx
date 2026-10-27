import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  Lock,
  Cpu,
  Layers,
  Award,
  Globe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main id="main-content" className="flex-1 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge variant="brand" size="sm">
              Our Mission
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Building the Universal Trust Layer for Global Hiring
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              ProofHire was founded on a simple principle: achievements earned through years of rigorous education and professional dedication should be instantly verifiable, globally portable, and owned by the candidate.
            </p>
          </div>

          {/* The Problem & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-red-200 bg-red-50/40 p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                The Legacy Problem
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                The Broken Status Quo
              </h2>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  Over 53% of job applicants embellish or fabricate qualifications on resumes.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  Employers wait 2 to 3 weeks for traditional third-party background checks.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  Universities spend thousands of hours responding to manual verification inquiries.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  Students have no sovereign, portable ownership of paper diplomas.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                The ProofHire Solution
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Cryptographic Certainty
              </h2>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  Instant sub-second verification using decentralized smart contract registries.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  Candidate-owned identity and tamper-proof zero-knowledge proofs.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  AI recruitment matching grounded in mathematically certified skills.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  Transparent revocation rails protecting university academic integrity.
                </li>
              </ul>
            </div>
          </div>

          {/* Architecture Pillars */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Underlying Technology Stack
              </h2>
              <p className="text-xs text-slate-500">
                Built on enterprise open-source protocols designed for durability and compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-2">
                <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ethereum Smart Contracts
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Solidity contracts enforce accredited institutional issuance and cryptographic revocation registries.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-2">
                <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  FastAPI AI Microservice
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Python intelligence engine cross-references candidate resumes with blockchain proofs for genuine match scoring.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-2">
                <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Encrypted IPFS Storage
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Decentralized document storage ensuring student documents cannot be held hostage by centralized intermediaries.
                </p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="rounded-2xl bg-brand-900 text-white p-8 sm:p-10 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Ready to see ProofHire in action?
            </h2>
            <p className="text-xs sm:text-sm text-brand-100 max-w-xl mx-auto">
              Explore the demonstration verifier or sign in to the multi-role portals.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/verify/demo-credential">
                <Button variant="primary" className="bg-brand-500 hover:bg-brand-400">
                  Try Verifier Tool
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="bg-transparent border-brand-700 text-white hover:bg-brand-800"
                >
                  Explore Demo Portals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
