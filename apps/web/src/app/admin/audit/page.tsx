"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { History, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminAuditPage() {
  const logs = [
    {
      id: "aud-001",
      action: "INSTITUTION_APPROVED",
      actor: "admin@proofhire.io",
      target: "Stanford School of Engineering",
      ip: "192.241.14.88",
      timestamp: "2025-02-17 12:44:10 UTC",
      status: "SUCCESS",
    },
    {
      id: "aud-002",
      action: "CREDENTIAL_ISSUED",
      actor: "institution@proofhire.io",
      target: "CRED-STANFORD-2025-001",
      ip: "171.64.64.12",
      timestamp: "2025-02-15 14:32:00 UTC",
      status: "SUCCESS",
    },
    {
      id: "aud-003",
      action: "USER_SUSPENDED",
      actor: "admin@proofhire.io",
      target: "spam@fakeagency.com",
      ip: "192.241.14.88",
      timestamp: "2025-02-14 09:12:45 UTC",
      status: "SECURITY_ACTION",
    },
    {
      id: "aud-004",
      action: "PUBLIC_VERIFICATION_CHECK",
      actor: "Anonymous Recruiter",
      target: "CRED-STANFORD-2025-001",
      ip: "64.233.160.1",
      timestamp: "2025-02-17 15:20:00 UTC",
      status: "SUCCESS",
    },
  ];

  return (
    <DashboardShell
      role="ADMIN"
      title="Platform Audit Trail & Security Logs"
      subtitle="Immutable activity log of administrative decisions, on-chain writes, and security events."
    >
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-sans">
                <tr>
                  <th className="p-4 pl-6 font-semibold">Action</th>
                  <th className="p-4 font-semibold">Actor</th>
                  <th className="p-4 font-semibold">Target Entity</th>
                  <th className="p-4 font-semibold">IP Address</th>
                  <th className="p-4 font-semibold">Timestamp</th>
                  <th className="p-4 pr-6 text-right font-semibold">Audit State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 font-bold text-slate-900 font-sans">
                      {log.action}
                    </td>
                    <td className="p-4 text-slate-700">{log.actor}</td>
                    <td className="p-4 text-brand-600 font-bold">{log.target}</td>
                    <td className="p-4 text-slate-500">{log.ip}</td>
                    <td className="p-4 text-slate-500 font-sans">{log.timestamp}</td>
                    <td className="p-4 pr-6 text-right font-sans">
                      <Badge
                        variant={log.status === "SECURITY_ACTION" ? "revoked" : "verified"}
                        size="sm"
                      >
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
