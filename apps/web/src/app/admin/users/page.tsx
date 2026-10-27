"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Users, Search, ShieldCheck, UserCheck, UserX } from "lucide-react";

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
              joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Jan 10, 2025",
            }))
          );
        }
      } catch (e) {
        console.warn("Using offline demo users fallback:", e);
      }
    }
    loadUsers();
  }, [search, activeTab]);

  const toggleStatus = async (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const newStatus = target.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await api.admin.updateUserStatus(id, newStatus as any);
    } catch (e) {
      console.warn("API updateUserStatus warning:", e);
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === "ALL") return true;
    return u.role === activeTab;
  });

  return (
    <DashboardShell
      role="ADMIN"
      title="User Access & Role Management"
      subtitle="Inspect registered students, recruiters, and institutions. Enforce suspensions and permissions."
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: "ALL", label: "All Users", badge: users.length },
              { id: "STUDENT", label: "Students" },
              { id: "RECRUITER", label: "Recruiters" },
              { id: "INSTITUTION", label: "Institutions" },
              { id: "ADMIN", label: "Admins" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="pills"
          />

          <Input
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftAddon={<Search className="h-4 w-4" />}
            className="sm:w-72"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4 pl-6 font-semibold">User</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Account Status</th>
                    <th className="p-4 font-semibold">Joined Date</th>
                    <th className="p-4 pr-6 text-right font-semibold">Access Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6">
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[11px] text-slate-500">{u.email}</span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            u.role === "ADMIN"
                              ? "pending"
                              : u.role === "INSTITUTION"
                              ? "verified"
                              : "brand"
                          }
                          size="sm"
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={u.status === "ACTIVE" ? "verified" : "revoked"}
                          size="sm"
                        >
                          {u.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-600">{u.joined}</td>
                      <td className="p-4 pr-6 text-right">
                        {u.role !== "ADMIN" && (
                          <Button
                            onClick={() => toggleStatus(u.id)}
                            variant={u.status === "ACTIVE" ? "danger" : "success"}
                            size="sm"
                          >
                            {u.status === "ACTIVE" ? "Suspend Account" : "Reactivate Account"}
                          </Button>
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
