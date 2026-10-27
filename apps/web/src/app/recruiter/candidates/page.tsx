"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Users,
  Search,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ExternalLink,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export default function RecruiterCandidatesPage() {
  const [query, setQuery] = React.useState("");

  const candidates = [
    {
      id: "cand-001",
      name: "Alex Rivera",
      username: "alexrivera",
      headline: "Senior Software Engineer & Distributed Consensus Researcher",
      university: "Stanford University",
      degree: "B.S. Computer Science (2025)",
      gpa: 3.92,
      location: "San Francisco, CA",
      verifiedSkills: ["TypeScript", "Solidity", "PostgreSQL", "Zero Knowledge"],
      verifiedCredentialsCount: 2,
      aiIndexScore: 95,
    },
    {
      id: "cand-002",
      name: "Maya Patel",
      username: "mayapatel",
      headline: "Full-Stack Web3 & Smart Contract Developer",
      university: "UC Berkeley",
      degree: "B.S. EECS (2024)",
      gpa: 3.86,
      location: "Berkeley, CA",
      verifiedSkills: ["React", "TypeScript", "Solidity", "Next.js"],
      verifiedCredentialsCount: 1,
      aiIndexScore: 89,
    },
    {
      id: "cand-003",
      name: "David Kim",
      username: "davidkim",
      headline: "AI & Machine Learning Infrastructure Engineer",
      university: "Carnegie Mellon University",
      degree: "M.S. Machine Learning (2025)",
      gpa: 3.95,
      location: "Pittsburgh, PA / Remote",
      verifiedSkills: ["Python", "PyTorch", "FastAPI", "Vector DBs"],
      verifiedCredentialsCount: 2,
      aiIndexScore: 92,
    },
  ];

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.university.toLowerCase().includes(query.toLowerCase()) ||
      c.verifiedSkills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <DashboardShell
      role="RECRUITER"
      title="Verified Candidate Discovery"
      subtitle="Search pre-vetted engineers whose educational degrees and core skills are cryptographically verified."
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by candidate name, skill (e.g. Solidity, PyTorch), or university..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftAddon={<Search className="h-4 w-4" />}
            aria-label="Search candidates"
          />
        </div>

        {/* Candidate List */}
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((cand) => (
            <Card key={cand.id} className="p-6 hover:border-slate-300 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg shrink-0">
                    {cand.name.charAt(0)}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Link href={`/u/${cand.username}`} className="text-base font-bold text-slate-900 hover:text-brand-600">
                        {cand.name}
                      </Link>
                      <Badge variant="verified" size="sm" icon>
                        {cand.verifiedCredentialsCount} On-Chain Proofs
                      </Badge>
                      <Badge variant="brand" size="sm">
                        <Sparkles className="h-3 w-3 mr-1 text-brand-600" />
                        AI Index: {cand.aiIndexScore}
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-brand-700">
                      {cand.headline}
                    </p>

                    <p className="text-xs text-slate-500">
                      {cand.degree} • {cand.university} • GPA {cand.gpa} • {cand.location}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cand.verifiedSkills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col sm:items-end gap-2">
                  <Link href={`/u/${cand.username}`}>
                    <Button variant="primary" size="sm" rightIcon={<ExternalLink className="h-3 w-3" />}>
                      View Verified Portfolio
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
