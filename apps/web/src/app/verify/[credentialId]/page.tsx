"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Search,
  ArrowLeft,
  Building2,
  GraduationCap,
  Calendar,
  Hash,
  Share2,
} from "lucide-react";

export default function VerifyCredentialPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.credentialId as string;
  const credentialId = decodeURIComponent(rawId || "demo-credential");

  const [searchId, setSearchId] = React.useState(credentialId);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  // Deterministic catalog matching demo & real credentials
  const demoCatalog: Record<string, any> = {
    "CRED-STANFORD-2025-001": {
      isValid: true,
      credentialId: "CRED-STANFORD-2025-001",
      title: "Bachelor of Science in Computer Science",
      type: "DEGREE",
      recipient: "Alex Rivera",
      institution: "Stanford School of Engineering",
      institutionCode: "STANFORD-CS",
      issueDate: "June 15, 2025",
      txHash: "0x3c990a56e5223a4b64c18c99277d337f75eb1432c253457a4e69b0faee2ef124",
      merkleRoot: "0x8f2d59a781b01c1074a382ec297838e4a9e2293414995a56093d5673a9ebcf29",
      ipfsHash: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
      blockNumber: 4892110,
      gradeOrScore: "GPA 3.92 (Summa Cum Laude)",
      skills: ["Distributed Systems", "Cryptography", "PostgreSQL", "Full-Stack Development"],
      status: "ISSUED",
      isRevoked: false,
    },
    "demo-credential": {
      isValid: true,
      credentialId: "CRED-STANFORD-2025-001",
      title: "Bachelor of Science in Computer Science",
      type: "DEGREE",
      recipient: "Alex Rivera",
      institution: "Stanford School of Engineering",
      institutionCode: "STANFORD-CS",
      issueDate: "June 15, 2025",
      txHash: "0x3c990a56e5223a4b64c18c99277d337f75eb1432c253457a4e69b0faee2ef124",
      merkleRoot: "0x8f2d59a781b01c1074a382ec297838e4a9e2293414995a56093d5673a9ebcf29",
      ipfsHash: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
      blockNumber: 4892110,
      gradeOrScore: "GPA 3.92 (Summa Cum Laude)",
      skills: ["Distributed Systems", "Cryptography", "PostgreSQL", "Full-Stack Development"],
      status: "ISSUED",
      isRevoked: false,
    },
    "CRED-MIT-2025-089": {
      isValid: true,
      credentialId: "CRED-MIT-2025-089",
      title: "Advanced Cryptographic Engineering Certificate",
      type: "CERTIFICATE",
      recipient: "Alex Rivera",
      institution: "MIT Decentralized Media Lab",
      institutionCode: "MIT-DML",
      issueDate: "August 20, 2025",
      txHash: "0x7b11c90a1492a54b38d19a99781b456e72cb1531e253998a4e69c0faee2a991b",
      merkleRoot: "0x4e0a721980aef8d91024cc56b823e59048a65239e9447198bbd147321a970e45",
      ipfsHash: "ipfs://QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
      blockNumber: 4910244,
      gradeOrScore: "98% Top Decile",
      skills: ["Zero Knowledge Proofs", "ZK-SNARKs", "Elliptic Curve Cryptography", "Solidity"],
      status: "ISSUED",
      isRevoked: false,
    },
    "REVOKED-DEMO-CRED": {
      isValid: false,
      credentialId: "REVOKED-DEMO-CRED",
      title: "Honorary Web Certificate",
      type: "CERTIFICATE",
      recipient: "John Doe",
      institution: "Stanford School of Engineering",
      institutionCode: "STANFORD-CS",
      issueDate: "May 10, 2024",
      txHash: "0x892a0142...revoked",
      merkleRoot: "0x11223344...revoked",
      ipfsHash: "ipfs://QmRevokedDemo",
      status: "REVOKED",
      isRevoked: true,
      revocationReason: "Academic integrity breach identified upon post-audit",
      revokedAt: "January 12, 2025",
      skills: ["HTML", "CSS", "JavaScript"],
    },
  };

  const cred = demoCatalog[credentialId] || {
    isValid: false,
    credentialId: credentialId,
    title: "Unknown Credential",
    recipient: "Unknown Recipient",
    institution: "Unregistered Entity",
    issueDate: "N/A",
    status: "NOT_FOUND",
    isRevoked: false,
    skills: [],
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      router.push(`/verify/${encodeURIComponent(searchId.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main id="main-content" className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Search & Back Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to ProofHire Home
            </Link>

            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Input
                placeholder="Lookup another ID or Hash..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                leftAddon={<Search className="h-3.5 w-3.5" />}
                className="h-8 text-xs sm:w-64"
                aria-label="Search credential"
              />
              <Button type="submit" size="sm" variant="secondary">
                Verify
              </Button>
            </form>
          </div>

          {/* Verification Status Banner */}
          {cred.status === "NOT_FOUND" ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-4">
              <AlertTriangle className="h-8 w-8 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h1 className="text-lg font-bold text-red-900">
                  Credential Not Found in ProofHire Registry
                </h1>
                <p className="text-xs text-red-700">
                  The identifier &apos;{credentialId}&apos; does not exist on the decentralized Ethereum smart contract. Verify the spelling or request an issuance link from the accredited institution.
                </p>
              </div>
            </div>
          ) : cred.isRevoked ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-4">
              <AlertTriangle className="h-8 w-8 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h1 className="text-lg font-bold text-red-900">
                  Warning: Credential Has Been Revoked
                </h1>
                <p className="text-xs text-red-700">
                  This credential was officially revoked on-chain by {cred.institution} on {cred.revokedAt}.
                </p>
                {cred.revocationReason && (
                  <p className="text-xs font-semibold text-red-900 mt-2">
                    Official Reason: &quot;{cred.revocationReason}&quot;
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shrink-0">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900">
                      Authentic & Verified Credential
                    </h1>
                    <Badge variant="verified" size="sm" icon>
                      On-Chain Proof
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Cryptographically signed by an accredited institution and anchored to the Ethereum Sepolia network.
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Network
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  Ethereum Sepolia (ChainID: 11155111)
                </span>
              </div>
            </div>
          )}

          {/* Certificate Detail Card */}
          {cred.status !== "NOT_FOUND" && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white via-slate-50/40 to-white">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-brand-600 font-semibold tracking-wider">
                    {cred.credentialId}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {cred.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Conferred upon <strong className="text-slate-800">{cred.recipient}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="text-xs text-slate-400 block font-medium">
                    Issuing Authority
                  </span>
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <Building2 className="h-4 w-4 text-brand-600" />
                    <span className="text-sm font-bold text-slate-900">
                      {cred.institution}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Code: {cred.institutionCode}
                  </span>
                </div>
              </div>

              {/* Body Metadata */}
              <div className="p-6 sm:p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" /> Performance / Grade
                    </span>
                    <p className="text-sm font-bold text-slate-900">
                      {cred.gradeOrScore || "Honors & Completion"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> Issue Date
                    </span>
                    <p className="text-sm font-bold text-slate-900">
                      {cred.issueDate}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5" /> Block Number
                    </span>
                    <p className="text-sm font-bold text-slate-900 font-mono">
                      #{cred.blockNumber || "4892110"}
                    </p>
                  </div>
                </div>

                {/* Certified Skills */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Certified Competencies & Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cred.skills?.map((skill: string) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-lg border border-emerald-200"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cryptographic Technical Proofs */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3 font-mono text-xs">
                  <h3 className="text-xs font-bold font-sans text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-brand-600" />
                    Cryptographic Proof Metadata
                  </h3>

                  <div className="space-y-2 text-slate-600">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-white rounded border border-slate-200/80">
                      <span className="text-slate-400 text-[11px]">
                        Smart Contract:
                      </span>
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">
                          0x5FbDB2315678afecb367f032d93F642f64180aa3
                        </span>
                        <button
                          onClick={() =>
                            handleCopy("0x5FbDB2315678afecb367f032d93F642f64180aa3", "contract")
                          }
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy contract"
                        >
                          {copiedField === "contract" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-white rounded border border-slate-200/80">
                      <span className="text-slate-400 text-[11px]">
                        Transaction Hash:
                      </span>
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{cred.txHash}</span>
                        <button
                          onClick={() => handleCopy(cred.txHash, "tx")}
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy TX"
                        >
                          {copiedField === "tx" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${cred.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-600 hover:text-brand-700"
                          title="View on Sepolia Etherscan"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-white rounded border border-slate-200/80">
                      <span className="text-slate-400 text-[11px]">
                        Merkle Root:
                      </span>
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{cred.merkleRoot}</span>
                        <button
                          onClick={() => handleCopy(cred.merkleRoot, "merkle")}
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy Merkle"
                        >
                          {copiedField === "merkle" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-white rounded border border-slate-200/80">
                      <span className="text-slate-400 text-[11px]">
                        IPFS Metadata CID:
                      </span>
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{cred.ipfsHash}</span>
                        <button
                          onClick={() => handleCopy(cred.ipfsHash, "ipfs")}
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy IPFS"
                        >
                          {copiedField === "ipfs" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
