"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Users, Search, GraduationCap, Award, ExternalLink } from "lucide-react";

export default function InstitutionStudentsPage() {
  const [search, setSearch] = React.useState("");

  const students = [
    {
      id: "stu-001",
      name: "Alex Rivera",
      studentId: "STU-2025-0042",
      email: "student@proofhire.io",
      degree: "B.S. Computer Science",
      cohort: "Class of 2025",
      gpa: 3.92,
      issuedCredentials: 1,
      status: "GRADUATED",
      profileUrl: "/u/alexrivera",
    },
    {
      id: "stu-002",
      name: "Elena Rostova",
      studentId: "STU-2025-0108",
      email: "elena.rostova@stanford.edu",
      degree: "M.S. Electrical Engineering",
      cohort: "Class of 2025",
      gpa: 3.88,
      issuedCredentials: 1,
      status: "GRADUATED",
      profileUrl: "#",
    },
    {
      id: "stu-003",
      name: "Marcus Vance Jr.",
      studentId: "STU-2026-0215",
      email: "marcus.v@stanford.edu",
      degree: "B.S. Symbolic Systems",
      cohort: "Class of 2026",
      gpa: 3.95,
      issuedCredentials: 0,
      status: "ENROLLED",
      profileUrl: "#",
    },
  ];

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.degree.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell
      role="INSTITUTION"
      title="Student Academic Directory"
      subtitle="Manage enrolled cohorts and monitor credential issuance readiness."
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search student by name, email, or degree program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftAddon={<Search className="h-4 w-4" />}
            className="sm:w-80"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4 pl-6 font-semibold">Student Name</th>
                    <th className="p-4 font-semibold">Program</th>
                    <th className="p-4 font-semibold">Cohort</th>
                    <th className="p-4 font-semibold">GPA</th>
                    <th className="p-4 font-semibold">Issued Credentials</th>
                    <th className="p-4 pr-6 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6">
                        <span className="font-bold text-slate-900 block">{s.name}</span>
                        <span className="text-[11px] text-slate-500">{s.email}</span>
                      </td>
                      <td className="p-4 font-medium text-slate-800">{s.degree}</td>
                      <td className="p-4 text-slate-600">{s.cohort}</td>
                      <td className="p-4 font-mono font-bold text-slate-900">{s.gpa}</td>
                      <td className="p-4">
                        <Badge
                          variant={s.issuedCredentials > 0 ? "verified" : "neutral"}
                          size="sm"
                        >
                          {s.issuedCredentials} Issued
                        </Badge>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Link href="/institution/credentials/issue">
                          <Button variant="outline" size="sm">
                            Issue Credential
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
