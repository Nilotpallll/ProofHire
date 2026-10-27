"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { History, ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";

import { api } from "@/lib/api";

const DEFAULT_AUDIT_LOGS = [
  {
    id: "log-001",
    event: "CREDENTIAL_ISSUED",
    credentialId: "CRED-STANFORD-2025-001",
    recipient: "Alex Rivera",
    block: 4892110,
    timestamp: "2025-06-15 14:32 UTC",
    txHash: "0x3c990a56e5223a4b64c18c99277d337f75eb1432c253457a4e69b0faee2ef124",
  },
  {
    id: "log-002",
    event: "CREDENTIAL_ISSUED",
    credentialId: "CRED-STANFORD-2025-002",
    recipient: "Elena Rostova",
    block: 4892118,
    timestamp: "2025-06-15 15:10 UTC",
    txHash: "0x5e119a0a1492a54b38d19a99781b456e72cb1531e253998a4e69c0faee2a115e",
  },
  {
    id: "log-003",
    event: "CREDENTIAL_REVOKED",
    credentialId: "REVOKED-DEMO-CRED",
    recipient: "John Doe",
    block: 4905140,
    timestamp: "2025-01-12 09:20 UTC",
    txHash: "0x892a0142998a4e69c0faee2a115e3c990a56e5223a4b64c18c99277d337f75eb",
  },
  {
    id: "log-004",
    event: "ISSUER_AUTHORIZED",
    credentialId: "N/A",
    recipient: "Stanford Registrar Office",
    block: 4810012,
    timestamp: "2024-01-15 10:00 UTC",
    txHash: "0x11223344556677889900aabbccddeeff0011223344556677889900aabbccddee",
  },
];

export default function InstitutionHistoryPage() {
  const [auditLogs, setAuditLogs] = React.useState(DEFAULT_AUDIT_LOGS);

  React.useEffect(() => {
    async function loadLogs() {
      try {
        const data = await api.admin.getAuditLogs();
        if (data && data.length > 0) {
          setAuditLogs(
            data.map((l: any, idx: number) => ({
              id: l.id || `log-${idx}`,
              event: l.action || "CREDENTIAL_ISSUED",
              credentialId: l.entityId || "CRED-STANFORD-2025-001",
              recipient: l.actor || "Alex Rivera",
              block: 4892110 + idx,
              timestamp: l.timestamp ? new Date(l.timestamp).toUTCString() : "Recently",
              txHash: l.txHash || "0x3c990a56e5223a4b64c18c99277d337f75eb1432c253457a4e69b0faee2ef124",
            }))
          );
        }
      } catch (e) {
        console.warn("Using offline demo history logs:", e);
      }
    }
    loadLogs();
  }, []);

  return (
    <DashboardShell
      role="INSTITUTION"
      title="Blockchain Issuance & Audit Trail"
      subtitle="Complete chronological record of all on-chain transactions signed by Stanford School of Engineering."
    >
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4 pl-6 font-semibold">Event Type</th>
                  <th className="p-4 font-semibold">Identifier</th>
                  <th className="p-4 font-semibold">Target / Recipient</th>
                  <th className="p-4 font-semibold">Block Number</th>
                  <th className="p-4 font-semibold">Timestamp</th>
                  <th className="p-4 pr-6 text-right font-semibold">Sepolia Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 font-sans">
                      <Badge
                        variant={
                          log.event === "CREDENTIAL_REVOKED"
                            ? "revoked"
                            : log.event === "CREDENTIAL_ISSUED"
                            ? "verified"
                            : "brand"
                        }
                        size="sm"
                      >
                        {log.event.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-slate-900">{log.credentialId}</td>
                    <td className="p-4 font-sans text-slate-700">{log.recipient}</td>
                    <td className="p-4 text-slate-500">#{log.block}</td>
                    <td className="p-4 font-sans text-slate-500">{log.timestamp}</td>
                    <td className="p-4 pr-6 text-right">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${log.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 hover:text-brand-800 inline-flex items-center gap-1"
                      >
                        {log.txHash.slice(0, 10)}... <ExternalLink className="h-3 w-3" />
                      </a>
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
