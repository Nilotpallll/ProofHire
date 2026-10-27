"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  GraduationCap,
  Award,
  Globe,
  Github,
  Linkedin,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Share2,
} from "lucide-react";

export default function PublicStudentProfilePage() {
  const params = useParams();
  const rawUsername = params?.username as string;
  const username = decodeURIComponent(rawUsername || "alexrivera");

  const [copiedLink, setCopiedLink] = React.useState(false);

  const student = {
    name: "Alex Rivera",
    username: "alexrivera",
    headline: "Senior Software Engineer & Distributed Consensus Researcher",
    bio: "Passionate about decentralized systems, smart contracts, and high-performance Web3 frontends. B.S. in Computer Science with Honors from Stanford University.",
    university: "Stanford University",
    major: "Computer Science",
    graduationYear: 2025,
    gpa: 3.92,
    location: "San Francisco, CA",
    githubUrl: "https://github.com/alexrivera-demo",
    linkedinUrl: "https://linkedin.com/in/alexrivera-demo",
    portfolioUrl: "https://alexrivera.dev",
    verifiedCredentials: [
      {
        id: "cred-001",
        credentialId: "CRED-STANFORD-2025-001",
        title: "Bachelor of Science in Computer Science",
        type: "DEGREE",
        institution: "Stanford School of Engineering",
        issueDate: "June 15, 2025",
        grade: "GPA 3.92 (Summa Cum Laude)",
        skills: ["Distributed Systems", "Cryptography", "PostgreSQL", "Full-Stack Development"],
      },
      {
        id: "cred-002",
        credentialId: "CRED-MIT-2025-089",
        title: "Advanced Cryptographic Engineering Certificate",
        type: "CERTIFICATE",
        institution: "MIT Decentralized Media Lab",
        issueDate: "August 20, 2025",
        grade: "Top Decile (98%)",
        skills: ["Zero Knowledge Proofs", "ZK-SNARKs", "Solidity", "Elliptic Curve Cryptography"],
      },
    ],
  };

  const copyProfile = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main id="main-content" className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Profile Header Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                  {student.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {student.name}
                    </h1>
                    <Badge variant="verified" size="sm" icon>
                      Cryptographically Verified
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-brand-600">
                    {student.headline}
                  </p>
                  <p className="text-xs text-slate-500">
                    {student.university} • Class of {student.graduationYear} • GPA {student.gpa}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={copyProfile}
                  variant="outline"
                  size="sm"
                  leftIcon={<Share2 className="h-3.5 w-3.5" />}
                >
                  {copiedLink ? "Link Copied!" : "Share Profile"}
                </Button>
                <Link href="/recruiter/dashboard">
                  <Button variant="primary" size="sm">
                    Contact Candidate
                  </Button>
                </Link>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
              {student.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 pt-1">
              <a
                href={student.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-brand-600"
              >
                <Globe className="h-4 w-4" /> Portfolio Site
              </a>
              <a
                href={student.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-brand-600"
              >
                <Github className="h-4 w-4" /> GitHub Profile
              </a>
              <a
                href={student.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-brand-600"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>

          {/* Verified Credentials Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Verified Academic & Professional Credentials ({student.verifiedCredentials.length})
              </h2>
              <span className="text-xs text-slate-500">
                Anchored to Ethereum Blockchain
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {student.verifiedCredentials.map((cred) => (
                <div
                  key={cred.credentialId}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-card hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-brand-600">
                        {cred.credentialId}
                      </span>
                      <Badge variant="verified" size="sm" icon>
                        Verified
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {cred.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Conferred by <strong>{cred.institution}</strong> • {cred.issueDate} • {cred.grade}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cred.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link href={`/verify/${cred.credentialId}`} className="shrink-0">
                    <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3 w-3" />}>
                      Verify On-Chain
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
