"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Building,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  PauseCircle,
  Search,
} from "lucide-react";
import { api } from "@/lib/api";

interface InstitutionItem {
  id: string;
  name: string;
  code: string;
  website: string;
  contactEmail: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "SUSPENDED";
  verifiedAt: string;
}

const DEFAULT_INSTITUTIONS: InstitutionItem[] = [
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
];

export default function AdminInstitutionsPage() {
  const [auditMessage, setAuditMessage] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [institutions, setInstitutions] = React.useState<InstitutionItem[]>(DEFAULT_INSTITUTIONS);
  const [pendingAction, setPendingAction] = React.useState<{
    type: "REJECT" | "SUSPEND" | "APPROVE";
    institution: InstitutionItem;
  } | null>(null);
  const [actionReason, setActionReason] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    async function loadInstitutions() {
      try {
        const data = await api.institutions.list();
        if (data && data.length > 0) {
          setInstitutions(
            data.map((i: any) => ({
              id: i.id,
              name: i.name,
              code: i.code || i.id.toUpperCase(),
              website: i.website || "https://stanford.edu",
              contactEmail: i.contactEmail || "admin@institution.edu",
              status: i.status || "APPROVED",
              verifiedAt: i.verifiedAt || "Accredited",
            }))
          );
        }
      } catch (e) {
        console.warn("Using offline demo institutions:", e);
      }
    }
    loadInstitutions();
  }, []);

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    const { type, institution } = pendingAction;
    setIsProcessing(true);
    setActionError(null);

    try {
      if (type === "APPROVE") {
        await api.institutions.approve(institution.id);
        setInstitutions((prev) =>
          prev.map((i) => (i.id === institution.id ? { ...i, status: "APPROVED", verifiedAt: "Just now" } : i))
        );
        setAuditMessage(`Audit Log: Institution "${institution.name}" authorized for on-chain credential issuance.`);
      } else if (type === "REJECT") {
        await api.institutions.reject(institution.id);
        setInstitutions((prev) =>
          prev.map((i) => (i.id === institution.id ? { ...i, status: "REJECTED" } : i))
        );
        setAuditMessage(`Audit Log: Institution "${institution.name}" accreditation rejected.`);
      } else if (type === "SUSPEND") {
        const newStatus = institution.status === "SUSPENDED" ? "APPROVED" : "SUSPENDED";
        if (newStatus === "SUSPENDED") {
          await api.institutions.suspend(institution.id);
        } else {
          await api.institutions.approve(institution.id);
        }
        setInstitutions((prev) =>
          prev.map((i) => (i.id === institution.id ? { ...i, status: newStatus } : i))
        );
        setAuditMessage(
          `Audit Log: Institution "${institution.name}" ${
            newStatus === "SUSPENDED" ? "suspended from issuance" : "re-instated"
          }.`
        );
      }
      setTimeout(() => setAuditMessage(null), 5000);
    } catch (e: any) {
      setActionError(e?.message || `Failed to ${type.toLowerCase()} institution "${institution.name}".`);
    } finally {
      setIsProcessing(false);
      setPendingAction(null);
      setActionReason("");
    }
  };

  return (
    <DashboardShell
      role="ADMIN"
      title="Institution Vetting & Accreditation Queue"
      subtitle="Verify university and certification bodies before authorizing on-chain credential issuance rights."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {auditMessage && (
          <div
            role="status"
            className="rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 p-4 text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            {auditMessage}
          </div>
        )}

        {actionError && (
          <div className="p-4 bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 rounded-xl text-xs font-semibold text-rose-800 dark:text-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button
              onClick={() => setActionError(null)}
              className="text-rose-600 hover:text-rose-800 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-400">
                  <tr>
                    <th scope="col" className="p-4 pl-6 font-semibold">Institution Name</th>
                    <th scope="col" className="p-4 font-semibold">Code</th>
                    <th scope="col" className="p-4 font-semibold">Website</th>
                    <th scope="col" className="p-4 font-semibold">Status</th>
                    <th scope="col" className="p-4 font-semibold">Accreditation Date</th>
                    <th scope="col" className="p-4 pr-6 text-right font-semibold">Vetting Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {institutions.map((inst) => (
                    <tr
                      key={inst.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4 pl-6 font-bold text-slate-900 dark:text-white">
                        {inst.name}
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-normal">
                          {inst.contactEmail}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-brand-600 dark:text-brand-400">{inst.code}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        <a
                          href={inst.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-600 hover:underline dark:text-brand-400 inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
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
                      <td className="p-4 text-slate-600 dark:text-slate-400">{inst.verifiedAt}</td>
                      <td className="p-4 pr-6 text-right">
                        {inst.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => setPendingAction({ type: "APPROVE", institution: inst })}
                              variant="primary"
                              size="sm"
                              leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                            >
                              Authorize
                            </Button>
                            <Button
                              onClick={() => setPendingAction({ type: "REJECT", institution: inst })}
                              variant="outline"
                              size="sm"
                              className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/40"
                              leftIcon={<XCircle className="h-3.5 w-3.5" />}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setPendingAction({ type: "SUSPEND", institution: inst })}
                              className={`text-xs px-2.5 py-1 rounded border font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
                                inst.status === "SUSPENDED"
                                  ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                                  : "border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900/60 dark:text-amber-300 dark:hover:bg-amber-950/40"
                              }`}
                            >
                              {inst.status === "SUSPENDED" ? "Re-instate Issuer" : "Suspend Issuance..."}
                            </button>
                          </div>
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

      {/* Confirmation Modal for Destructive Vetting Actions */}
      {pendingAction && (
        <Modal
          isOpen={true}
          onClose={() => setPendingAction(null)}
          title={
            pendingAction.type === "APPROVE"
              ? `Authorize Institution: ${pendingAction.institution.name}`
              : pendingAction.type === "REJECT"
              ? `Reject Accreditation: ${pendingAction.institution.name}`
              : pendingAction.institution.status === "SUSPENDED"
              ? `Re-instate Institution: ${pendingAction.institution.name}`
              : `Suspend Issuance Rights: ${pendingAction.institution.name}`
          }
          description="Confirm administrative governance action on this educational or credentialing organization."
        >
          <div className="space-y-4 py-2">
            <div
              className={`rounded-xl border p-4 text-xs space-y-1 ${
                pendingAction.type === "REJECT" ||
                (pendingAction.type === "SUSPEND" && pendingAction.institution.status !== "SUSPENDED")
                  ? "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
                  : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
              }`}
            >
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0" /> Administrative Impact
              </p>
              <p>
                {pendingAction.type === "APPROVE"
                  ? "This will authorize the university on the Ethereum smart contract registry to issue verifiable digital credentials."
                  : pendingAction.type === "REJECT"
                  ? "This will reject the accreditation request. The institution will not be permitted to anchor credentials to ProofHire."
                  : pendingAction.institution.status === "SUSPENDED"
                  ? "This will restore active issuance rights on the blockchain for this institution."
                  : "Suspending issuance rights will block new credentials from being minted on-chain until administrative review concludes."}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Governance Audit Note
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Document the regulatory verification or audit rationale..."
                rows={3}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setPendingAction(null)}>
                Cancel
              </Button>
              <Button
                variant={pendingAction.type === "REJECT" || (pendingAction.type === "SUSPEND" && pendingAction.institution.status !== "SUSPENDED") ? "danger" : "primary"}
                size="sm"
                isLoading={isProcessing}
                onClick={handleConfirmAction}
              >
                Confirm Governance Action
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
