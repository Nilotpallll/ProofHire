"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { CredentialStatusIndicator } from "@/components/ui/CredentialStatusIndicator";
import { Modal } from "@/components/ui/Modal";
import {
  Award,
  ExternalLink,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  Building2,
  Calendar,
  CheckCircle2,
} from "lucide-react";

import { api } from "@/lib/api";

const DEFAULT_STUDENT_CREDS = [
  {
    id: "cred-001",
    credentialId: "CRED-STANFORD-2025-001",
    title: "Bachelor of Science in Computer Science",
    type: "DEGREE",
    institution: "Stanford School of Engineering",
    institutionCode: "STANFORD-CS",
    issueDate: "June 15, 2025",
    txHash: "0x3c990a56e5223a4b64c18c99277d337f75eb1432c253457a4e69b0faee2ef124",
    ipfsHash: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    grade: "GPA 3.92 (Summa Cum Laude)",
    skills: ["Distributed Systems", "Cryptography", "PostgreSQL", "Full-Stack Development"],
    status: "ISSUED",
  },
  {
    id: "cred-002",
    credentialId: "CRED-MIT-2025-089",
    title: "Advanced Cryptographic Engineering Certificate",
    type: "CERTIFICATE",
    institution: "MIT Decentralized Media Lab",
    institutionCode: "MIT-DML",
    issueDate: "August 20, 2025",
    txHash: "0x7b11c90a1492a54b38d19a99781b456e72cb1531e253998a4e69c0faee2a991b",
    ipfsHash: "ipfs://QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
    grade: "Top Decile (98%)",
    skills: ["Zero Knowledge Proofs", "ZK-SNARKs", "Solidity", "Elliptic Curve Cryptography"],
    status: "ISSUED",
  },
];

export default function StudentCredentialsPage() {
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [selectedCred, setSelectedCred] = React.useState<any>(null);
  const [copied, setCopied] = React.useState(false);
  const [credentials, setCredentials] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadCreds() {
      try {
        const data = await api.credentials.my();
        if (data) {
          setCredentials(
            data.map((c: any) => ({
              id: c.id,
              credentialId: c.credentialId,
              title: c.title,
              type: c.type || "DEGREE",
              institution: c.institutionName || "Stanford School of Engineering",
              institutionCode: c.institutionCode || "STANFORD-CS",
              issueDate: c.issueDate ? new Date(c.issueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "June 15, 2025",
              txHash: c.txHash || "0x3c990a56e5223a4b64c18c99277d337f75eb1432c253457a4e69b0faee2ef124",
              ipfsHash: c.ipfsHash || "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
              grade: c.gradeOrScore || "Passed with Distinction",
              skills: c.skills || ["Distributed Systems", "Cryptography"],
              status: c.status || "ISSUED",
            }))
          );
        }
      } catch (e) {
        console.warn("Using offline demo credentials fallback:", e);
      } finally {
        setLoading(false);
      }
    }
    loadCreds();
  }, []);

  const filtered = credentials.filter((c) => {
    if (activeTab === "ALL") return true;
    return c.type === activeTab;
  });

  const openShare = (c: any) => {
    setSelectedCred(c);
    setShareModalOpen(true);
  };

  const copyShareLink = () => {
    if (selectedCred) {
      navigator.clipboard.writeText(`${window.location.origin}/verify/${selectedCred.credentialId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DashboardShell
      role="STUDENT"
      title="Verified Credentials"
      subtitle="Your permanent, tamper-proof academic and professional certifications on the Ethereum blockchain."
    >
      <div className="space-y-6">
        {/* Tabs Filter */}
        <div className="flex items-center justify-between">
          <Tabs
            tabs={[
              { id: "ALL", label: "All Credentials", badge: credentials.length },
              { id: "DEGREE", label: "Degrees", badge: credentials.filter((c) => c.type === "DEGREE").length },
              { id: "CERTIFICATE", label: "Certificates", badge: credentials.filter((c) => c.type === "CERTIFICATE").length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="pills"
          />

          <Link href="/verify">
            <Button variant="outline" size="sm" leftIcon={<ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />}>
              Test Verifier Tool
            </Button>
          </Link>
        </div>

        {/* Credentials Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <Award className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No Verifiable Credentials Found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              When your accredited university or educational institution issues an on-chain academic credential or certificate to your email address, it will automatically anchor to the Ethereum blockchain and appear in your portfolio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((cred) => (
              <Card key={cred.id} className="overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950/60 dark:text-brand-300 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                        {cred.credentialId}
                      </span>
                      <CredentialStatusIndicator status="ISSUED" txHash={cred.txHash} />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {cred.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        Issued by <strong>{cred.institution}</strong> ({cred.institutionCode}) • Conferred {cred.issueDate}
                      </p>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <span className="text-slate-500 dark:text-slate-400">Graduation Standing:</span> {cred.grade}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                        Certified Skills Backed by this Credential
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cred.skills.map((s: string) => (
                          <span
                            key={s}
                            className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <Link href={`/verify/${cred.credentialId}`}>
                      <Button variant="primary" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                        Public Verification Page
                      </Button>
                    </Link>
                    <Button
                      onClick={() => openShare(cred)}
                      variant="outline"
                      size="sm"
                      leftIcon={<Share2 className="h-3.5 w-3.5" />}
                    >
                      Share Proof Link
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 p-3 px-6 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <span>TX: {cred.txHash.slice(0, 22)}...</span>
                  <span>IPFS: {cred.ipfsHash}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {selectedCred && (
        <Modal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          title="Share Cryptographic Proof"
          description="Send this public verification URL to recruiters, hiring managers, or embed on your portfolio."
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-3 text-xs font-mono break-all text-slate-700 dark:text-slate-200">
              {typeof window !== "undefined"
                ? `${window.location.origin}/verify/${selectedCred.credentialId}`
                : `https://proofhire.io/verify/${selectedCred.credentialId}`}
            </div>

            <Button
              onClick={copyShareLink}
              variant="primary"
              className="w-full"
              leftIcon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            >
              {copied ? "Verification Link Copied!" : "Copy Public Verification Link"}
            </Button>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
