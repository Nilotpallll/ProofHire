"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import {
  ShieldCheck,
  Search,
  ExternalLink,
  Award,
  Lock,
  ArrowRight,
  Fingerprint,
} from "lucide-react";

export default function VerifyIndexPage() {
  const router = useRouter();
  const [credentialId, setCredentialId] = React.useState("CRED-STANFORD-2025-001");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentialId.trim()) {
      router.push(`/verify/${encodeURIComponent(credentialId.trim())}`);
    }
  };

  const handleSelectPreset = (id: string) => {
    setCredentialId(id);
    router.push(`/verify/${encodeURIComponent(id)}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <HeroAtmosphere />
      <Navbar />

      <main role="main" className="relative z-10 flex-1 flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full text-center space-y-8 animate-fade-in">
        {/* Verification Hub Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 shadow-subtle">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Public On-Chain Verification Engine</span>
            <Badge variant="verified" size="sm">
              Ethereum Sepolia
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Verify Any Credential Against{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Immutable Ethereum Truth
            </span>
          </h1>

          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            ProofHire provides instant, zero-trust cryptographic verification for diplomas, professional certificates, and licenses. Enter a credential identifier or transaction hash below.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-luxury space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <Input
              label="Credential ID or Ethereum Tx Hash"
              placeholder="e.g. CRED-STANFORD-2025-001 or 0x3c990a..."
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              leftAddon={<Search className="h-4 w-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full shadow-glow-brand"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Verify On-Chain Record
            </Button>
          </form>

          {/* Preset Buttons */}
          <div className="pt-3 border-t border-slate-800/80 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Sample Verification Records:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleSelectPreset("CRED-STANFORD-2025-001")}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors font-mono"
              >
                Stanford CS Degree (Valid)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset("CRED-MIT-2025-089")}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors font-mono"
              >
                MIT Crypto Cert (Valid)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset("REVOKED-DEMO-CRED")}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-red-900/50 text-red-400 transition-colors font-mono"
              >
                Revoked Certificate (Audit)
              </button>
            </div>
          </div>
        </div>

        {/* Cryptographic Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <ShieldCheck className="h-5 w-5 text-emerald-400 mb-2" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Smart Contract Proof
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Direct verification against CredentialRegistry.sol smart contract state.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <Fingerprint className="h-5 w-5 text-brand-400 mb-2" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Document Merkle Hash
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Upload original PDF to verify zero byte-level tampering.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <Lock className="h-5 w-5 text-purple-400 mb-2" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Permanent Revocation
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Immediate cryptographic status updates with immutable audit trail.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
