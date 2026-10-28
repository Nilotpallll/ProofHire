"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CredentialStatusIndicator } from "@/components/ui/CredentialStatusIndicator";
import {
  Award,
  Users,
  AlertTriangle,
  Clock,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { api } from "@/lib/api";

const DEFAULT_ISSUANCES = [
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
  },
];

export default function InstitutionDashboardPage() {
  const [credentials, setCredentials] = React.useState<any[]>(DEFAULT_ISSUANCES);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const creds = await api.credentials.list();
        if (creds && Array.isArray(creds) && creds.length > 0) {
          setCredentials(
            creds.map((c: any) => ({
              id: c.id,
              credentialId: c.credentialId,
              title: c.title,
              recipient: c.recipientName || "Alex Rivera",
              studentEmail: c.recipientEmail || "student@proofhire.io",
              issueDate: c.issueDate
                ? new Date(c.issueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                : "June 15, 2025",
              type: c.type || "DEGREE",
              status: c.isRevoked || c.status === "REVOKED" ? "REVOKED" : "ISSUED",
              txHash: c.txHash || "0x0",
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <DashboardShell
      role="INSTITUTION"
      title="Institution Issuance Console"
      subtitle="Issue, sign, and revoke academic degrees and professional certifications on the Ethereum blockchain."
      actions={
        <Link href="/institution/credentials/issue">
          <Button variant="primary" size="sm" leftIcon={<PlusCircle className="h-3.5 w-3.5" />}>
            Issue New Credential
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Accreditation Status Banner */}
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-gradient-to-r from-emerald-50 via-white to-emerald-50/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Stanford School of Engineering (Code: STANFORD-CS)
                </h2>
                <Badge variant="verified" size="sm" icon>
                  Accredited & Authorized
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Authorized issuer address: <span className="font-mono text-slate-700 dark:text-slate-300">0x1a2b...9a0b</span> on Ethereum Sepolia registry.
              </p>
            </div>
          </div>
          <Link href="/institution/credentials/history" className="shrink-0">
            <Button variant="outline" size="sm">
              Issuance History
            </Button>
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Students Enrolled"
            value="850"
            change="+45 this semester"
            trend="up"
            subtitle="Undergraduate & Masters"
            icon={<Users className="h-5 w-5 text-brand-600 dark:text-brand-400" />}
            isDemo
          />
          <MetricCard
            title="Issued On-Chain Proofs"
            value={loading ? "..." : credentials.length.toString()}
            change={loading ? "Loading..." : `${credentials.length} credentials in catalog`}
            trend="up"
            subtitle="Permanent credentials"
            icon={<Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          />
          <MetricCard
            title="Revoked Credentials"
            value={credentials.filter((c: any) => c.status === "REVOKED").length.toString()}
            change="Audit compliant"
            trend="neutral"
            subtitle="Academic integrity enforcement"
            icon={<AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />}
          />
          <MetricCard
            title="Pending Requests"
            value="18"
            change="Awaiting registrar sign-off"
            trend="neutral"
            subtitle="Graduation queue"
            icon={<Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
            isDemo
          />
        </div>

        {/* Recent Issuances Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Credential Issuances</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Latest student diplomas and certificates registered on-chain
              </p>
            </div>
            <Link
              href="/institution/credentials"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              View All ({credentials.length})
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4 pl-6 font-semibold">Credential ID</th>
                    <th className="p-4 font-semibold">Title & Degree</th>
                    <th className="p-4 font-semibold">Recipient</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Issue Date</th>
                    <th className="p-4 pr-6 text-right font-semibold">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {credentials.slice(0, 5).map((c) => (
                    <tr key={c.id || c.credentialId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 pl-6 font-mono font-bold text-brand-600 dark:text-brand-400">
                        {c.credentialId}
                      </td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{c.title}</td>
                      <td className="p-4">
                        <span className="font-medium text-slate-900 dark:text-slate-100 block">{c.recipient}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{c.studentEmail}</span>
                      </td>
                      <td className="p-4">
                        <CredentialStatusIndicator status={c.status as any} />
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{c.issueDate}</td>
                      <td className="p-4 pr-6 text-right">
                        <Link href={`/verify/${encodeURIComponent(c.credentialId)}`}>
                          <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3 w-3" />}>
                            Verify Proof
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
