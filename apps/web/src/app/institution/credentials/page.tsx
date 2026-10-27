"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { CredentialStatusIndicator } from "@/components/ui/CredentialStatusIndicator";
import { api } from "@/lib/api";
import {
  Award,
  Search,
  PlusCircle,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export default function InstitutionCredentialsListPage() {
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [search, setSearch] = React.useState("");
  const [revokeModalOpen, setRevokeModalOpen] = React.useState(false);
  const [selectedCred, setSelectedCred] = React.useState<any>(null);
  const [revokeReason, setRevokeReason] = React.useState("");
  const [revoking, setRevoking] = React.useState(false);

  const [credentials, setCredentials] = React.useState([
    {
      id: "cred-001",
      credentialId: "CRED-STANFORD-2025-001",
      title: "Bachelor of Science in Computer Science",
      recipient: "Alex Rivera",
      studentEmail: "student@proofhire.io",
      issueDate: "June 15, 2025",
      type: "DEGREE",
      status: "ISSUED",
      txHash: "0x3c990a56e5223a4b64c18c99277d337f75eb1432c253457a4e69b0faee2ef124",
      grade: "GPA 3.92 (Summa Cum Laude)",
    },
    {
      id: "cred-002",
      credentialId: "CRED-STANFORD-2025-002",
      title: "Master of Science in Electrical Engineering",
      recipient: "Elena Rostova",
      studentEmail: "elena.rostova@stanford.edu",
      issueDate: "June 15, 2025",
      type: "DEGREE",
      status: "ISSUED",
      txHash: "0x5e119a0a1492a54b38d19a99781b456e72cb1531e253998a4e69c0faee2a115e",
      grade: "GPA 3.88",
    },
    {
      id: "cred-003",
      credentialId: "REVOKED-DEMO-CRED",
      title: "Honorary Web Certificate",
      recipient: "John Doe",
      studentEmail: "john.doe@example.com",
      issueDate: "May 10, 2024",
      type: "CERTIFICATE",
      status: "REVOKED",
      txHash: "0x892a0142...revoked",
      grade: "Honors",
      revocationReason: "Academic integrity breach identified upon post-audit",
    },
  ]);

  const handleOpenRevoke = (cred: any) => {
    setSelectedCred(cred);
    setRevokeReason("");
    setRevokeModalOpen(true);
  };

  const handleConfirmRevoke = async () => {
    if (!revokeReason.trim() || !selectedCred) return;
    setRevoking(true);

    try {
      await api.credentials.revoke(selectedCred.credentialId, revokeReason);
    } catch {
      // local fallback
    }

    setCredentials((prev) =>
      prev.map((c) =>
        c.credentialId === selectedCred.credentialId
          ? { ...c, status: "REVOKED", revocationReason: revokeReason }
          : c
      )
    );
    setRevoking(false);
    setRevokeModalOpen(false);
  };

  const filtered = credentials.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.recipient.toLowerCase().includes(search.toLowerCase()) ||
      c.credentialId.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === "ALL") return true;
    return c.status === activeTab;
  });

  return (
    <DashboardShell
      role="INSTITUTION"
      title="Issued Academic Credentials"
      subtitle="Registry of diplomas and certificates issued by Stanford School of Engineering."
      actions={
        <Link href="/institution/credentials/issue">
          <Button variant="primary" size="sm" leftIcon={<PlusCircle className="h-3.5 w-3.5" />}>
            Issue Credential
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: "ALL", label: "All Credentials", badge: credentials.length },
              { id: "ISSUED", label: "Active", badge: credentials.filter((c) => c.status === "ISSUED").length },
              { id: "REVOKED", label: "Revoked", badge: credentials.filter((c) => c.status === "REVOKED").length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="pills"
          />

          <Input
            placeholder="Search by student name, degree, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftAddon={<Search className="h-4 w-4" />}
            className="sm:w-72"
            aria-label="Filter credentials"
          />
        </div>

        {/* Credentials List */}
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((cred) => (
            <Card key={cred.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {cred.credentialId}
                    </span>
                    <CredentialStatusIndicator status={cred.status as any} />
                    <span className="text-xs font-semibold text-slate-500">
                      {cred.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {cred.title}
                  </h3>

                  <p className="text-xs text-slate-600">
                    Conferred upon <strong>{cred.recipient}</strong> ({cred.studentEmail}) • {cred.issueDate} • {cred.grade}
                  </p>

                  {cred.status === "REVOKED" && cred.revocationReason && (
                    <div className="rounded-lg bg-red-50 p-2.5 border border-red-200 text-xs text-red-800 font-medium">
                      Revocation Reason: &quot;{cred.revocationReason}&quot;
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/verify/${cred.credentialId}`}>
                    <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3 w-3" />}>
                      Verify Proof
                    </Button>
                  </Link>

                  {cred.status === "ISSUED" && (
                    <Button
                      onClick={() => handleOpenRevoke(cred)}
                      variant="danger"
                      size="sm"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Revocation Confirmation Modal */}
      {selectedCred && (
        <Modal
          isOpen={revokeModalOpen}
          onClose={() => setRevokeModalOpen(false)}
          title="Revoke Issued Credential"
          description={`Permanently revoke ${selectedCred.credentialId} issued to ${selectedCred.recipient}`}
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 space-y-1">
              <p className="font-bold">Irreversible Action Warning:</p>
              <p>
                Revocation is written directly to the Ethereum smart contract. Any employer or verifier attempting to inspect this hash in the future will immediately see it marked as REVOKED.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Official Rationale / Audit Notes
              </label>
              <textarea
                rows={3}
                placeholder="State the academic integrity, disciplinary, or administrative basis..."
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setRevokeModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={revoking}
                disabled={!revokeReason.trim()}
                onClick={handleConfirmRevoke}
              >
                Confirm On-Chain Revocation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
