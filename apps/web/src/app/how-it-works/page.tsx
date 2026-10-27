"use client";

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
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  ExternalLink,
} from "lucide-react";

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = React.useState(1);

  const steps = [
    {
      num: 1,
      title: "Institutional Issuance & Merkle Root",
      subtitle: "Accredited universities register their authorized issuer key with the ProofHire registry.",
      details:
        "When a student graduates or completes an accredited program, the university administration generates a cryptographic hash containing recipient ID, graduation date, GPA, and curriculum competencies. The hash is signed and registered on the Ethereum smart contract.",
      codeSnippet: `// Solidity Smart Contract Issuance
function issueCredential(
    bytes32 credentialHash,
    address recipient,
    string calldata credentialType,
    string calldata ipfsMetadataUri
) external onlyIssuer {
    _credentials[credentialHash] = Credential({
        credentialHash: credentialHash,
        issuer: msg.sender,
        recipient: recipient,
        status: CredentialStatus.ISSUED,
        issueDate: block.timestamp
    });
    emit CredentialIssued(credentialHash, msg.sender, recipient);
}`,
    },
    {
      num: 2,
      title: "Decentralized IPFS Storage & Zero Knowledge",
      subtitle: "Encrypted metadata is stored on IPFS nodes while preserving student confidentiality.",
      details:
        "The underlying transcript and degree certificates are encrypted and pinned to IPFS. The public ledger only stores the cryptographic fingerprint (Keccak-256) and zero-knowledge commitments, preventing any unauthorized scraping of student records.",
      codeSnippet: `// IPFS Metadata Pinning
{
  "credentialId": "CRED-STANFORD-2025-001",
  "issuer": "Stanford School of Engineering",
  "issuerAddress": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  "recipient": "Alex Rivera",
  "degree": "B.S. Computer Science",
  "encryptedIpfsCid": "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
  "timestamp": 1750000000
}`,
    },
    {
      num: 3,
      title: "AI Skill Verification & Resume Matching",
      subtitle: "The FastAPI AI microservice analyzes candidate resumes against verified credentials.",
      details:
        "When candidates submit their profiles for job vacancies, our AI neural matching service parses technical competencies and verifies whether claimed proficiencies are backed by verified on-chain diplomas. Candidates receive a verified credibility score (0-100%).",
      codeSnippet: `# FastAPI Neural Fit Matching
@app.post("/match-job")
async def match_job(payload: JobMatchRequest):
    verified_boost = min(payload.verified_credentials_count * 8, 20)
    match_score = base_skill_overlap + verified_boost
    return JobMatchResponse(
        match_score=min(match_score, 100),
        is_qualified=match_score >= 60,
        verified_match_boost=verified_boost
    )`,
    },
    {
      num: 4,
      title: "Instant Public Verification & Revocation",
      subtitle: "Hiring managers verify qualifications in milliseconds with zero administrative delays.",
      details:
        "Anyone with a credential hash or link can verify authenticity in real time without creating an account. If an institution ever detects academic dishonesty, it calls revokeCredential() on-chain, rendering the proof permanently revoked.",
      codeSnippet: `// Public Verification Query
function verifyCredential(bytes32 credentialHash)
    external view returns (bool isValid, address issuer, uint256 issueDate, bool isRevoked) {
    Credential memory cred = _credentials[credentialHash];
    return (
        cred.status == CredentialStatus.ISSUED,
        cred.issuer,
        cred.issueDate,
        cred.status == CredentialStatus.REVOKED
    );
}`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main id="main-content" className="flex-1 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <Badge variant="brand" size="sm">
              Architecture & Protocol
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              The ProofHire Protocol Explained
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore how blockchain cryptographic registers, decentralized storage, and AI neural matching unite to eliminate resume fraud and verify credentials in milliseconds.
            </p>
          </div>

          {/* Interactive Steps Navigator */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeStep === s.num
                    ? "border-brand-500 bg-white shadow-card ring-2 ring-brand-500/20"
                    : "border-slate-200 bg-slate-50 hover:bg-white text-slate-600"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold mb-2 ${
                    activeStep === s.num
                      ? "bg-brand-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  0{s.num}
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {s.title}
                </p>
              </button>
            ))}
          </div>

          {/* Active Step Showcase */}
          {(() => {
            const current = steps.find((s) => s.num === activeStep) || steps[0];
            return (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700 font-bold text-xs">
                      0{current.num}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Protocol Stage
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {current.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-700 font-medium">
                    {current.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {current.details}
                  </p>
                  <div className="pt-2">
                    <Link href="/verify/demo-credential">
                      <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                        Verify a Live Demo Credential
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Code Window */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-white overflow-hidden shadow-modal font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="ml-2 font-mono text-slate-300">
                        {current.num === 3 ? "ai_service.py" : "ProofHireCredential.sol"}
                      </span>
                    </span>
                    <span>Sepolia EVM</span>
                  </div>
                  <pre className="mt-3 overflow-x-auto text-slate-300 text-[11px] leading-relaxed">
                    <code>{current.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            );
          })()}

          {/* Verification Callout */}
          <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-slate-900">
                Want to test the smart contract directly?
              </h3>
              <p className="text-xs text-slate-500">
                Inspect live transactions on the Ethereum Sepolia testnet or trigger verification queries.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/verify/CRED-STANFORD-2025-001">
                <Button variant="primary" size="sm">
                  View Verified Stanford Degree
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="sm">
                  Get Started
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
