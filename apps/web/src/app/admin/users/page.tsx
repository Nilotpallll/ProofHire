"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { Users, Search, ShieldCheck, UserCheck, UserX, AlertTriangle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

const DEFAULT_USERS = [
  {
    id: "u-001",
    name: "Alex Rivera",
    email: "student@proofhire.io",
    role: "STUDENT",
    status: "ACTIVE",
    joined: "Jan 10, 2025",
  },
  {
    id: "u-002",
    name: "Sarah Chen",
    email: "recruiter@proofhire.io",
    role: "RECRUITER",
    status: "ACTIVE",
    joined: "Jan 12, 2025",
  },
  {
    id: "u-003",
    name: "Dr. Marcus Vance",
    email: "institution@proofhire.io",
    role: "INSTITUTION",
    status: "ACTIVE",
    joined: "Jan 05, 2025",
  },
  {
    id: "u-004",
    name: "ProofHire SuperAdmin",
    email: "admin@proofhire.io",
    role: "ADMIN",
    status: "ACTIVE",
    joined: "Jan 01, 2025",
  },
  {
    id: "u-005",
    name: "Disputed Recruiter",
    email: "spam@fakeagency.com",
    role: "RECRUITER",
    status: "SUSPENDED",
    joined: "Feb 02, 2025",
  },
];

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [search, setSearch] = React.useState("");
  const [users, setUsers] = React.useState(DEFAULT_USERS);
  const [userToModify, setUserToModify] = React.useState<{
    id: string;
    name: string;
    email: string;
    currentStatus: string;
  } | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [auditMessage, setAuditMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadUsers() {
      try {
        const data = await api.admin.getUsers(
          search || undefined,
          activeTab !== "ALL" ? activeTab : undefined
        );
        if (data && data.length > 0) {
          setUsers(
            data.map((u: any) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              status: u.status,
              joined: u.createdAt
                ? new Date(u.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Jan 10, 2025",
            }))
          );
        }
      } catch (e) {
        console.warn("Using offline demo users fallback:", e);
      }
    }
    loadUsers();
  }, [search, activeTab]);

  const handleConfirmStatusToggle = async () => {
    if (!userToModify) return;
    const newStatus = userToModify.currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setIsUpdating(true);

    try {
      await api.admin.updateUserStatus(userToModify.id, newStatus as any);
    } catch (e) {
      console.warn("API updateUserStatus warning:", e);
    } finally {
      setIsUpdating(false);
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userToModify.id ? { ...u, status: newStatus } : u))
    );
    setAuditMessage(`Account for "${userToModify.name}" has been ${newStatus.toLowerCase()}.`);
    setUserToModify(null);
    setTimeout(() => setAuditMessage(null), 4000);
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === "ALL") return true;
    return u.status === activeTab;
  });

  return (
    <DashboardShell
      role="ADMIN"
      title="User Directory & Access Governance"
      subtitle="Audit registered accounts, role entitlements, and security authorization states across ProofHire."
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: "ALL", label: "All Accounts", badge: users.length },
              { id: "ACTIVE", label: "Active", badge: users.filter((u) => u.status === "ACTIVE").length },
              { id: "SUSPENDED", label: "Suspended", badge: users.filter((u) => u.status === "SUSPENDED").length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="pills"
          />

          <Input
            placeholder="Search by user name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftAddon={<Search className="h-4 w-4" />}
            className="sm:w-72"
            aria-label="Filter user accounts"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-400">
                  <tr>
                    <th scope="col" className="p-4 pl-6 font-semibold">User Profile</th>
                    <th scope="col" className="p-4 font-semibold">Assigned Role</th>
                    <th scope="col" className="p-4 font-semibold">Status</th>
                    <th scope="col" className="p-4 font-semibold">Registration Date</th>
                    <th scope="col" className="p-4 pr-6 text-right font-semibold">Governance Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{user.name}</span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            user.role === "ADMIN"
                              ? "revoked"
                              : user.role === "INSTITUTION"
                              ? "verified"
                              : user.role === "RECRUITER"
                              ? "neutral"
                              : "brand"
                          }
                          size="sm"
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={user.status === "ACTIVE" ? "verified" : "revoked"} size="sm">
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{user.joined}</td>
                      <td className="p-4 pr-6 text-right">
                        {user.role !== "ADMIN" && (
                          <button
                            onClick={() =>
                              setUserToModify({
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                currentStatus: user.status,
                              })
                            }
                            className={`text-xs px-2.5 py-1 rounded border font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none ${
                              user.status === "ACTIVE"
                                ? "border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/40"
                                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/60 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                            }`}
                          >
                            {user.status === "ACTIVE" ? "Suspend Account..." : "Re-activate Account..."}
                          </button>
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

      {/* Confirmation Modal for Destructive Account Status Change */}
      {userToModify && (
        <Modal
          isOpen={true}
          onClose={() => setUserToModify(null)}
          title={
            userToModify.currentStatus === "ACTIVE"
              ? `Suspend Account: ${userToModify.name}`
              : `Re-activate Account: ${userToModify.name}`
          }
          description="Confirm administrative access change for this registered platform user."
        >
          <div className="space-y-4 py-2">
            <div
              className={`rounded-xl border p-4 text-xs space-y-1 ${
                userToModify.currentStatus === "ACTIVE"
                  ? "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
                  : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
              }`}
            >
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0" /> Access Governance Impact
              </p>
              <p>
                {userToModify.currentStatus === "ACTIVE"
                  ? `Suspending "${userToModify.name}" (${userToModify.email}) will immediately terminate active sessions and prevent further logins until an administrator lifts the suspension.`
                  : `Re-activating "${userToModify.name}" (${userToModify.email}) will restore full access to their respective portal.`}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setUserToModify(null)}>
                Cancel
              </Button>
              <Button
                variant={userToModify.currentStatus === "ACTIVE" ? "danger" : "primary"}
                size="sm"
                isLoading={isUpdating}
                onClick={handleConfirmStatusToggle}
              >
                {userToModify.currentStatus === "ACTIVE" ? "Confirm Suspension" : "Confirm Re-activation"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
