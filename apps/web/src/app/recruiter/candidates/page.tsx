"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  Users,
  Search,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ExternalLink,
  MapPin,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  HelpCircle,
  XCircle,
} from "lucide-react";

export default function RecruiterCandidatesPage() {
  const [query, setQuery] = React.useState("");
  const [selectedCandidate, setSelectedCandidate] = React.useState<any | null>(null);
  const [claimsModalOpen, setClaimsModalOpen] = React.useState(false);

  const candidates = [
    {
      id: "cand-001",
      name: "Alex Rivera",
      username: "alexrivera",
      headline: "Senior Software Engineer & Distributed Consensus Researcher",
      university: "Stanford University",
      degree: "B.S. Computer Science (2025)",
      gpa: 3.92,
      location: "San Francisco, CA",
      verifiedSkills: ["TypeScript", "Solidity", "PostgreSQL", "Zero Knowledge"],
      verifiedCredentialsCount: 2,
      aiIndexScore: 95,
      credentialId: "CRED-STANFORD-2025-001",
      claims: [
        {
          claimText: "B.S. in Computer Science from Stanford University (GPA 3.92)",
          status: "VERIFIED",
          evidence: "Smart Contract: 0x5FbDB...0aa3 | Issuing Institution: Stanford School of Engineering",
          recommendation: "Full cryptographic proof verified on-chain.",
        },
        {
          claimText: "Advanced Cryptographic Engineering Certification (MIT Media Lab)",
          status: "VERIFIED",
          evidence: "Smart Contract: 0x5FbDB...0aa3 | MIT DML Issuance",
          recommendation: "Cryptographically verified. Zero vetting delay.",
        },
        {
          claimText: "Lead Engineer on Distributed Consensus at Private Lab",
          status: "UNVERIFIED",
          evidence: "No smart contract credential anchor supplied for private employment.",
          recommendation: "Absence of on-chain credential does not indicate fraud. Conduct standard reference conversation.",
        },
      ],
    },
    {
      id: "cand-002",
      name: "Maya Patel",
      username: "mayapatel",
      headline: "Full-Stack Web3 & Smart Contract Developer",
      university: "UC Berkeley",
      degree: "B.S. EECS (2024)",
      gpa: 3.86,
      location: "Berkeley, CA",
      verifiedSkills: ["React", "TypeScript", "Solidity", "Next.js"],
      verifiedCredentialsCount: 1,
      aiIndexScore: 89,
      credentialId: "CRED-BERKELEY-2024-012",
      claims: [
        {
          claimText: "B.S. in Electrical Engineering and Computer Science (UC Berkeley)",
          status: "VERIFIED",
          evidence: "UC Berkeley Verified Registrar Key",
          recommendation: "Verified academic credential.",
        },
        {
          claimText: "Hackathon 1st Place Winner for DeFi Lending Protocol",
          status: "UNVERIFIED",
          evidence: "Self-reported portfolio project.",
          recommendation: "Review submitted GitHub repository.",
        },
      ],
    },
    {
      id: "cand-003",
      name: "David Kim",
      username: "davidkim",
      headline: "AI & Machine Learning Infrastructure Engineer",
      university: "Carnegie Mellon University",
      degree: "M.S. Machine Learning (2025)",
      gpa: 3.95,
      location: "Pittsburgh, PA / Remote",
      verifiedSkills: ["Python", "PyTorch", "FastAPI", "Vector DBs"],
      verifiedCredentialsCount: 2,
      aiIndexScore: 92,
      credentialId: "CRED-CMU-2025-081",
      claims: [
        {
          claimText: "M.S. in Machine Learning from Carnegie Mellon University",
          status: "VERIFIED",
          evidence: "CMU School of Computer Science Registry Key",
          recommendation: "Verified degree.",
        },
      ],
    },
  ];

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.university.toLowerCase().includes(query.toLowerCase()) ||
      c.verifiedSkills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );

  const handleInspectClaims = (cand: any) => {
    setSelectedCandidate(cand);
    setClaimsModalOpen(true);
  };

  return (
    <DashboardShell
      role="RECRUITER"
      title="Verified Candidate Discovery"
      subtitle="Search pre-vetted engineers whose educational degrees and core skills are cryptographically verified."
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by candidate name, skill (e.g. Solidity, PyTorch), or university..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftAddon={<Search className="h-4 w-4" />}
            aria-label="Search candidates"
          />
        </div>

        {/* Candidate List */}
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((cand) => (
            <Card key={cand.id} className="p-6 hover:border-slate-300 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg shrink-0">
                    {cand.name.charAt(0)}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/u/${cand.username}`}
                        className="font-bold text-base text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {cand.name}
                      </Link>
                      <Badge variant="verified" className="text-xs">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        {cand.verifiedCredentialsCount} Verified
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">{cand.headline}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                        {cand.university} • {cand.degree}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {cand.location}
                      </span>
                    </div>

                    {/* Verified Skills */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {cand.verifiedSkills.map((s) => (
                        <Badge key={s} variant="neutral" className="text-xs py-0.5">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">AI Match Index</div>
                    <div className="text-xl font-bold text-blue-600 flex items-center justify-end gap-1">
                      <Sparkles className="h-4 w-4" /> {cand.aiIndexScore}%
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInspectClaims(cand)}
                      className="text-xs"
                    >
                      <FileCheck className="h-3.5 w-3.5 mr-1 text-blue-600" /> Check Claims
                    </Button>
                    <Link href={`/u/${cand.username}`}>
                      <Button variant="secondary" size="sm" className="text-xs">
                        Profile <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Claims Verification Audit Modal */}
      {claimsModalOpen && selectedCandidate && (
        <Modal
          isOpen={claimsModalOpen}
          onClose={() => setClaimsModalOpen(false)}
          title={`Claim Verification Audit: ${selectedCandidate.name}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              The ProofHire AI Intelligence engine compares candidate resume statements against cryptographic on-chain evidence anchored to the Ethereum CredentialRegistry smart contract.
            </p>

            <div className="space-y-3">
              {selectedCandidate.claims.map((claim: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    claim.status === "VERIFIED"
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                      : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm">{claim.claimText}</span>
                    <Badge variant={claim.status === "VERIFIED" ? "verified" : "neutral"}>
                      {claim.status === "VERIFIED" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                      ) : (
                        <HelpCircle className="h-3 w-3 mr-1 text-slate-400" />
                      )}
                      {claim.status}
                    </Badge>
                  </div>

                  <div className="font-mono text-[11px] text-slate-600">
                    <strong>Evidence:</strong> {claim.evidence}
                  </div>

                  <div className="text-slate-600 italic">
                    <strong>Evaluation Note:</strong> {claim.recommendation}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Fairness Guarantee:</strong> Unverified status indicates only that independent cryptographic evidence was not anchored to this platform. It does not constitute a finding of misrepresentation.
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                href={`/verify/${selectedCandidate.credentialId}`}
                target="_blank"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                Inspect On-Chain Proof Record <ExternalLink className="h-3 w-3" />
              </Link>
              <Button variant="secondary" onClick={() => setClaimsModalOpen(false)}>
                Close Audit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
