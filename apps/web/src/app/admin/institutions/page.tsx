"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Building, CheckCircle2, XCircle, ExternalLink, ShieldCheck } from "lucide-react";

export default function AdminInstitutionsPage() {
  const [institutions, setInstitutions] = React.useState([
    {
      id: "inst-001",
      name: "Stanford School of Engineering",
      code: "STANFORD-CS",
      website: "https://engineering.stanford.edu",
      contactEmail: "registrar@stanford.edu",
      status: "APPROVED",
      verifiedAt: "Jan 15, 2024",
    },
    {
      id: "inst-002",
      name: "MIT Decentralized Media Lab",
      code: "MIT-DML",
      website: "https://media.mit.edu",
      contactEmail: "credentials@mit.edu",
      status: "APPROVED",
      verifiedAt: "Mar 20, 2024",
    },
    {
      id: "inst-003",
      name: "UC Berkeley Blockchain Institute",
      code: "UCB-BC",
      website: "https://blockchain.berkeley.edu",
      contactEmail: "contact@blockchain.berkeley.edu",
      status: "PENDING",
      verifiedAt: "Awaiting Verification",
    },
    {
      id: "inst-004",
      name: "ETH Zurich Cryptography Center",
      code: "ETHZ-CRYPTO",
      website: "https://crypto.ethz.ch",
      contactEmail: "verify@ethz.ch",
      status: "PENDING",
      verifiedAt: "Awaiting Verification",
    },
  ]);

  const approve = (id: string) => {
    setInstitutions((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "APPROVED", verifiedAt: "Just now" } : i))
    );
  };

  const reject = (id: string) => {
    setInstitutions((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "REJECTED" } : i))
    );
  };

  return (
    <DashboardShell
      role="ADMIN"
      title="Institution Vetting & Accreditation Queue"
      subtitle="Verify university and certification bodies before authorizing on-chain credential issuance rights."
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4 pl-6 font-semibold">Institution Name</th>
                    <th className="p-4 font-semibold">Code</th>
                    <th className="p-4 font-semibold">Website</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Accreditation Date</th>
                    <th className="p-4 pr-6 text-right font-semibold">Vetting Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {institutions.map((inst) => (
                    <tr key={inst.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-bold text-slate-900">
                        {inst.name}
                        <span className="text-[11px] text-slate-400 block font-normal">
                          {inst.contactEmail}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-brand-600">{inst.code}</td>
                      <td className="p-4 text-slate-600">
                        <a
                          href={inst.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-600 hover:underline inline-flex items-center gap-1"
                        >
                          {inst.website.replace("https://", "")} <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            inst.status === "APPROVED"
                              ? "verified"
                              : inst.status === "PENDING"
                              ? "pending"
                              : "revoked"
                          }
                          size="sm"
                        >
                          {inst.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-600">{inst.verifiedAt}</td>
                      <td className="p-4 pr-6 text-right">
                        {inst.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => approve(inst.id)}
                              variant="success"
                              size="sm"
                              leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                            >
                              Authorize
                            </Button>
                            <Button
                              onClick={() => reject(inst.id)}
                              variant="danger"
                              size="sm"
                              leftIcon={<XCircle className="h-3.5 w-3.5" />}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Decision Recorded
                          </span>
                        )}
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
