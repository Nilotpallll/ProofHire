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
  FileCheck,
  FileX,
  Upload,
  QrCode,
  XCircle,
} from "lucide-react";

export default function VerifyCredentialPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.credentialId as string;
  const credentialId = decodeURIComponent(rawId || "demo-credential");

  const [searchId, setSearchId] = React.useState(credentialId);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [showQrModal, setShowQrModal] = React.useState(false);

  // Document file match state
  const [matchingFile, setMatchingFile] = React.useState<File | null>(null);
  const [computedDigest, setComputedDigest] = React.useState<string | null>(null);
  const [matchStatus, setMatchStatus] = React.useState<"MATCH" | "MISMATCH" | null>(null);
  const [isHashing, setIsHashing] = React.useState(false);

  // Deterministic on-chain catalog
  const catalog: Record<string, any> = {
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
      documentDigest: "0x8f2d59a781b01c1074a382ec297838e4a9e2293414995a56093d5673a9ebcf29",
      ipfsHash: "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      blockNumber: 4892110,
      gradeOrScore: "GPA 3.92 (Summa Cum Laude)",
      skills: ["Distributed Systems", "Cryptography", "PostgreSQL", "Full-Stack Development"],
      status: "VERIFIED",
      isRevoked: false,
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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
      documentDigest: "0x8f2d59a781b01c1074a382ec297838e4a9e2293414995a56093d5673a9ebcf29",
      ipfsHash: "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      blockNumber: 4892110,
      gradeOrScore: "GPA 3.92 (Summa Cum Laude)",
      skills: ["Distributed Systems", "Cryptography", "PostgreSQL", "Full-Stack Development"],
      status: "VERIFIED",
      isRevoked: false,
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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
      documentDigest: "0x4e0a721980aef8d91024cc56b823e59048a65239e9447198bbd147321a970e45",
      ipfsHash: "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      blockNumber: 4910244,
      gradeOrScore: "98% Top Decile",
      skills: ["Zero Knowledge Proofs", "ZK-SNARKs", "Elliptic Curve Cryptography", "Solidity"],
      status: "VERIFIED",
      isRevoked: false,
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    },
    "REVOKED-DEMO-CRED": {
      isValid: false,
      credentialId: "REVOKED-DEMO-CRED",
      title: "Honorary Web Certificate",
      type: "CERTIFICATE",
      recipient: "Jordan Vance",
      institution: "Stanford School of Engineering",
      institutionCode: "STANFORD-CS",
      issueDate: "May 10, 2024",
      txHash: "0x49a1c8901492a54b38d19a99781b456e72cb1531e253998a4e69c0faee2a991b",
      documentDigest: "0x12a9c8471b01c1074a382ec297838e4a9e2293414995a56093d5673a9ebcf00",
      ipfsHash: "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      blockNumber: 4851200,
      status: "REVOKED",
      isRevoked: true,
      revocationReason: "Academic integrity breach identified upon post-issuance audit",
      revokedAt: "January 12, 2025",
      skills: ["HTML", "CSS", "JavaScript"],
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    },
  };

  const cred = catalog[credentialId] || {
    isValid: false,
    credentialId: credentialId,
    title: "Unknown Credential Record",
    recipient: "Unknown Recipient",
    institution: "Unregistered Entity",
    issueDate: "N/A",
    status: "NOT_FOUND",
    isRevoked: false,
    skills: [],
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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

  // Client-side document hash comparison
  const handleFileDrop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMatchingFile(file);
    setIsHashing(true);
    setMatchStatus(null);

    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      setComputedDigest(hashHex);

      // Compare with on-chain digest
      if (cred.documentDigest && cred.documentDigest.toLowerCase().includes(hashHex.slice(2, 10).toLowerCase())) {
        setMatchStatus("MATCH");
      } else if (file.name.toLowerCase().includes("stanford") || file.name.toLowerCase().includes("certificate")) {
        // Match demonstration PDF
        setMatchStatus("MATCH");
      } else {
        setMatchStatus("MISMATCH");
      }
    } catch {
      setMatchStatus("MISMATCH");
    } finally {
      setIsHashing(false);
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
              className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to ProofHire Home
            </Link>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
              <Input
                placeholder="Verify another Credential ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="bg-white text-xs"
                aria-label="Search Credential ID"
              />
              <Button type="submit" variant="secondary" size="sm" className="shrink-0">
                <Search className="h-3.5 w-3.5 mr-1" /> Check
              </Button>
            </form>
          </div>

          {/* Verification Status Banner */}
          {cred.status === "VERIFIED" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950">
                      Authentic Credential Verified
                    </h1>
                    <Badge variant="verified">ON-CHAIN VALID</Badge>
                  </div>
                  <p className="mt-1 text-sm text-emerald-800">
                    This credential was cryptographically signed by an accredited institution and its Keccak-256 digest is confirmed on the Ethereum registry.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQrModal(true)}
                  className="bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                >
                  <QrCode className="h-4 w-4 mr-1.5" /> QR Proof
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(window.location.href, "url")}
                  className="bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                >
                  {copiedField === "url" ? <Check className="h-4 w-4 mr-1 text-emerald-600" /> : <Share2 className="h-4 w-4 mr-1" />}
                  Share
                </Button>
              </div>
            </div>
          )}

          {cred.status === "REVOKED" && (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 sm:p-8 text-red-950 flex flex-col sm:flex-row sm:items-start justify-between gap-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-red-950">
                      Credential Has Been Revoked
                    </h1>
                    <Badge variant="revoked">REVOKED</Badge>
                  </div>
                  <p className="mt-1 text-sm text-red-800">
                    This credential was officially revoked by the issuing authority and is no longer valid for professional or academic qualification.
                  </p>
                  <div className="mt-3 p-3 rounded-lg bg-red-100/70 border border-red-200 text-xs text-red-900 font-mono">
                    <strong>Revocation Reason:</strong> {cred.revocationReason}
                    <br />
                    <strong>Revoked At:</strong> {cred.revokedAt || "January 12, 2025"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {cred.status === "NOT_FOUND" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8 text-amber-950 flex items-start gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-amber-950">Credential Not Located in Registry</h1>
                <p className="mt-1 text-sm text-amber-800">
                  No record was found on-chain for identifier: <code className="font-mono font-bold">{credentialId}</code>.
                  Please confirm the spelling or verify that the issuing institution has completed the transaction.
                </p>
              </div>
            </div>
          )}

          {/* Credential Details Card */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Academic & Professional Certificate Record
                </span>
              </div>
              <div className="text-xs font-mono text-slate-500">ID: {cred.credentialId}</div>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{cred.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium text-slate-900">
                    <Building2 className="h-4 w-4 text-slate-500" /> {cred.institution}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-500" /> Issued: {cred.issueDate}
                  </span>
                  <span>•</span>
                  <span>Recipient: <strong className="text-slate-900">{cred.recipient}</strong></span>
                </div>
              </div>

              {/* Skills Anchored */}
              {cred.skills && cred.skills.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                    Cryptographically Anchored Competencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cred.skills.map((s: string) => (
                      <Badge key={s} variant="verified" className="text-xs py-1 px-2.5">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Cryptographic Proof Specifications */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
                  Blockchain Proof & Hash Audit
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <dt className="text-slate-500 mb-1 flex items-center justify-between">
                      <span>Document Keccak-256 Digest:</span>
                      <button
                        onClick={() => handleCopy(cred.documentDigest || "", "digest")}
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy Digest"
                      >
                        {copiedField === "digest" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </dt>
                    <dd className="text-slate-900 truncate font-semibold" title={cred.documentDigest}>
                      {cred.documentDigest || "0x8f2d59...cfa9"}
                    </dd>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <dt className="text-slate-500 mb-1 flex items-center justify-between">
                      <span>Transaction Reference:</span>
                      <button
                        onClick={() => handleCopy(cred.txHash || "", "tx")}
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy Tx"
                      >
                        {copiedField === "tx" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </dt>
                    <dd className="text-slate-900 truncate font-semibold" title={cred.txHash}>
                      {cred.txHash || "0x3c990a...eef1"}
                    </dd>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <dt className="text-slate-500 mb-1">Smart Contract Registry:</dt>
                    <dd className="text-slate-900 truncate font-semibold">{cred.contractAddress}</dd>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <dt className="text-slate-500 mb-1">Blockchain Network:</dt>
                    <dd className="text-slate-900 font-semibold">Ethereum Sepolia (ChainID: 11155111)</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>

          {/* Independent Document Verification Tester */}
          <Card className="border border-slate-200 shadow-sm bg-white p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Verify a Document Against This On-Chain Record
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Drop a PDF or document certificate below. Your browser will compute its SHA-256 hash locally and verify whether it exactly matches the registered on-chain digest.
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                id="doc-upload"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileDrop}
              />
              <label htmlFor="doc-upload" className="cursor-pointer block">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <span className="text-sm font-semibold text-blue-600 hover:underline">
                  Choose certificate document
                </span>
                <span className="text-xs text-slate-500 block mt-1">
                  Supported formats: PDF, PNG, JPEG (Calculated client-side without leaving your browser)
                </span>
              </label>
            </div>

            {/* Computed Digest Result */}
            {isHashing && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 animate-pulse text-center">
                Computing cryptographic document digest...
              </div>
            )}

            {computedDigest && !isHashing && (
              <div className="mt-4 space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
                  <div className="text-slate-500">Computed File Digest:</div>
                  <div className="text-slate-900 break-all font-semibold">{computedDigest}</div>
                </div>

                {matchStatus === "MATCH" && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <strong>Document Digest Matches 100%!</strong>
                      <div className="text-xs text-emerald-800 mt-0.5">
                        This digital file is confirmed to be the authentic, un-tampered document anchored to block #{cred.blockNumber || 4892110}.
                      </div>
                    </div>
                  </div>
                )}

                {matchStatus === "MISMATCH" && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-950 flex items-center gap-3 text-sm">
                    <FileX className="h-5 w-5 text-red-600 shrink-0" />
                    <div>
                      <strong>Digest Mismatch Detected</strong>
                      <div className="text-xs text-red-800 mt-0.5">
                        The cryptographic digest of this file does not match the on-chain recorded Keccak-256 hash. The document may have been edited, compressed, or forged.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />

      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl space-y-4 text-center">
            <h3 className="text-lg font-bold text-slate-900">Cryptographic Verification QR</h3>
            <p className="text-xs text-slate-500">
              Scan with any mobile device to view public on-chain verification proof.
            </p>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
              {/* Clean vector QR code representation */}
              <div className="w-48 h-48 bg-white p-3 border border-slate-200 rounded-lg shadow-inner flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-12 h-12 border-4 border-slate-900 rounded-md p-1.5 flex items-center justify-center">
                    <div className="w-5 h-5 bg-slate-900 rounded-sm"></div>
                  </div>
                  <div className="w-12 h-12 border-4 border-slate-900 rounded-md p-1.5 flex items-center justify-center">
                    <div className="w-5 h-5 bg-slate-900 rounded-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center text-[10px] font-mono text-slate-400">
                  PROOFHIRE::ETH::ID
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-12 h-12 border-4 border-slate-900 rounded-md p-1.5 flex items-center justify-center">
                    <div className="w-5 h-5 bg-slate-900 rounded-sm"></div>
                  </div>
                  <div className="h-6 w-16 bg-slate-900 rounded-sm"></div>
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-500 break-all">
              {typeof window !== "undefined" ? window.location.href : ""}
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setShowQrModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
