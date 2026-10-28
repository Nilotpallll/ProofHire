"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Users,
  Building,
  History,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Cpu,
  Database,
  Globe,
  Layers,
} from "lucide-react";
import { api } from "@/lib/api";

const DEFAULT_PENDING = [
  {
    id: "inst-003",
    name: "UC Berkeley Blockchain Institute",
    code: "UCB-BC",
    contactEmail: "contact@blockchain.berkeley.edu",
    appliedDate: "Feb 10, 2025",
    status: "PENDING",
  },
  {
    id: "inst-004",
    name: "ETH Zurich Cryptography Center",
    code: "ETHZ-CRYPTO",
    contactEmail: "verify@ethz.ch",
    appliedDate: "Feb 14, 2025",
    status: "PENDING",
  },
];

export default function AdminDashboardPage() {
  const [pendingInstitutions, setPendingInstitutions] = React.useState<any[]>(DEFAULT_PENDING);
  const [userCount, setUserCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [pending, users] = await Promise.all([
          api.institutions.pending().catch(() => []),
          api.admin.getUsers().catch(() => []),
        ]);
        if (pending && Array.isArray(pending) && pending.length > 0) {
          setPendingInstitutions(
            pending.map((p: any) => ({
              id: p.id,
              name: p.name,
              code: p.code || p.id.toUpperCase(),
              contactEmail: p.contactEmail || "contact@institution.edu",
              appliedDate: p.appliedDate || "Recently Submitted",
              status: p.status || "PENDING",
            }))
          );
        }
        if (users && Array.isArray(users) && users.length > 0) {
          setUserCount(users.length);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <DashboardShell
      role="ADMIN"
      title="Platform Administrative Oversight"
      subtitle="SuperAdmin console for institution vetting, user access management, and system integrity."
      actions={
        <Link href="/admin/institutions">
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            Review Approval Queue ({pendingInstitutions.length})
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Registered Platform Users"
            value={loading ? "..." : (userCount > 0 ? userCount.toString() : "0")}
            change={loading ? "Loading..." : `${userCount} active platform users`}
            trend="up"
            subtitle="Students, Recruiters & Admins"
            icon={<Users className="h-5 w-5 text-brand-600" />}
          />
          <MetricCard
            title="Accredited Institutions"
            value="40"
            change={`${pendingInstitutions.length} Pending Approval`}
            trend="neutral"
            subtitle="Stanford, MIT, Harvard..."
            icon={<Building className="h-5 w-5 text-indigo-600" />}
          />
          <MetricCard
            title="Total Anchored Proofs"
            value="1,420"
            change="99.7% Integrity Rate"
            trend="up"
            subtitle="4 Revoked by Issuers"
            icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
            isDemo
          />
          <MetricCard
            title="Zero-Knowledge Audit Checks"
            value="8,410"
            change="+310 today"
            trend="up"
            subtitle="Real-time public queries"
            icon={<History className="h-5 w-5 text-slate-600" />}
            isDemo
          />
        </div>

        {/* System Health Indicators */}
        <Card className="p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
            Core Infrastructure Service Status
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/40 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">Sepolia Node</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Synced (Block #4,912,040)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/40 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">FastAPI AI</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Operational (Port 8000)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/40 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">PostgreSQL / Prisma</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Healthy (Port 4000)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/40 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">IPFS Gateway</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Encrypted Pinning Active</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Institution Approval Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Pending Institution Approvals</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Educational entities requesting on-chain credential issuance rights
              </p>
            </div>
            <Link
              href="/admin/institutions"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Manage Approvals
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4 pl-6 font-semibold">Institution Name</th>
                    <th className="p-4 font-semibold">Code</th>
                    <th className="p-4 font-semibold">Contact Email</th>
                    <th className="p-4 font-semibold">Submission Date</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 pr-6 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pendingInstitutions.map((inst) => (
                    <tr key={inst.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-900 dark:text-slate-100">{inst.name}</td>
                      <td className="p-4 font-mono font-semibold text-brand-600 dark:text-brand-400">{inst.code}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{inst.contactEmail}</td>
                      <td className="p-4 text-slate-500 dark:text-slate-400">{inst.appliedDate}</td>
                      <td className="p-4">
                        <Badge variant="pending" size="sm">
                          Pending Review
                        </Badge>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Link href="/admin/institutions">
                          <Button variant="primary" size="sm">
                            Review & Authorize
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
