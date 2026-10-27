import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Cpu, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                ProofHire
              </span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              ProofHire is the decentralized credential verification & recruitment platform.
              Bridging academic institutions, students, and recruiters with cryptographic proofs and intelligent matching.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
              <span className="inline-flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                Zero-Knowledge Verifiable
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-brand-600" />
                AI Skill Verification
              </span>
            </div>
          </div>

          {/* Solutions Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Platform Portals
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/student/dashboard" className="text-slate-500 hover:text-slate-900">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="/recruiter/dashboard" className="text-slate-500 hover:text-slate-900">
                  Recruiter Portal
                </Link>
              </li>
              <li>
                <Link href="/institution/dashboard" className="text-slate-500 hover:text-slate-900">
                  Institution Portal
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="text-slate-500 hover:text-slate-900">
                  Admin Oversight
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Proofs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Verification
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/verify/demo-credential" className="text-slate-500 hover:text-slate-900">
                  Public Verification Tool
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-slate-500 hover:text-slate-900">
                  Cryptographic Protocol
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-500 hover:text-slate-900">
                  About ProofHire
                </Link>
              </li>
              <li>
                <a
                  href="https://sepolia.etherscan.io"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-slate-900 flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" /> Sepolia Explorer
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Governance & Security
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="text-slate-500">FERPA / GDPR Compliant</li>
              <li className="text-slate-500">Non-Custodial Identity</li>
              <li className="text-slate-500">Decentralized IPFS Storage</li>
              <li className="text-slate-500">Open-Source Registry</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} ProofHire Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
