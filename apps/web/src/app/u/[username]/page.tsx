"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
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
  Layers,
  Lock,
  Code2,
  FileCode,
  FileText,
  UserCheck,
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
    bio: "Passionate about decentralized systems, smart contracts, and high-performance Web3 frontends. B.S. in Computer Science with Honors from Stanford University. Researches zero-knowledge proofs and decentralized identity protocols.",
    university: "Stanford University",
    major: "Computer Science",
    graduationYear: 2025,
    gpa: "3.92 (Summa Cum Laude)",
    location: "San Francisco, CA",
    githubUrl: "https://github.com/alexrivera-demo",
    linkedinUrl: "https://linkedin.com/in/alexrivera-demo",
    portfolioUrl: "https://alexrivera.dev",
    
    // Explicit differentiation of skill tiers
    verifiedSkills: [
      { name: "Distributed Systems", source: "Stanford School of Engineering", credentialId: "CRED-STANFORD-2025-001" },
      { name: "Cryptography", source: "Stanford School of Engineering", credentialId: "CRED-STANFORD-2025-001" },
      { name: "Solidity", source: "MIT Decentralized Media Lab", credentialId: "CRED-MIT-2025-089" },
      { name: "Zero-Knowledge Proofs", source: "MIT Decentralized Media Lab", credentialId: "CRED-MIT-2025-089" },
    ],
    resumeExtractedSkills: [
      { name: "TypeScript", confidence: "High (5+ projects)" },
      { name: "Next.js", confidence: "High (Production)" },
      { name: "PostgreSQL", confidence: "High (Schema design)" },
      { name: "Docker", confidence: "Medium" },
      { name: "FastAPI", confidence: "High" },
    ],
    selfDeclaredSkills: ["GraphQL", "Tailwind CSS", "Jest", "CI/CD"],

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
        onChainNetwork: "Ethereum EVM / Hardhat",
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
        onChainNetwork: "Ethereum EVM / Polygon Amoy",
      },
    ],

    projects: [
      {
        name: "ProofHire Credential Protocol",
        description: "Decentralized registry smart contracts with privacy-preserving salted subject references and sub-second public verification.",
        tags: ["Solidity", "Hardhat", "TypeScript", "Next.js"],
        github: "https://github.com/alexrivera-demo/proofhire",
      },
      {
        name: "Zero-Knowledge Membership Verifier",
        description: "Client-side Groth16 proof generation demonstrating institutional enrollment without disclosing student identity.",
        tags: ["Circom", "SnarkJS", "WebAssembly"],
        github: "https://github.com/alexrivera-demo/zk-identity",
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
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
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

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={copyProfile}
                  variant="outline"
                  size="sm"
                  leftIcon={<Share2 className="h-3.5 w-3.5" />}
                >
                  {copiedLink ? "Link Copied!" : "Share Passport"}
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

            {/* Privacy Guarantee Banner */}
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 flex items-start gap-2">
              <Lock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy-Preserving Public View:</strong> Only publicly designated credentials and portfolio links are displayed. Private resumes, job application history, and internal recruiter notes are never exposed.
              </span>
            </div>
          </div>

          {/* Institution-Issued Verified Credentials */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  On-Chain Verified Credentials ({student.verifiedCredentials.length})
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Anchored to Smart Contract Registry
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {student.verifiedCredentials.map((cred) => (
                <div
                  key={cred.id}
                  className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm hover:border-emerald-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="verified" size="sm" icon>
                          Blockchain Verified
                        </Badge>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {cred.type}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {cred.title}
                      </h3>
                      <p className="text-xs font-semibold text-brand-600">
                        {cred.institution}
                      </p>
                      <p className="text-xs text-slate-500">
                        Issued {cred.issueDate} • {cred.grade} • Network: {cred.onChainNetwork}
                      </p>
                    </div>

                    <Link href={`/verify/${cred.credentialId}`}>
                      <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                        Verify On-Chain
                      </Button>
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {cred.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Differentiated Skills Taxonomy */}
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-brand-600" />
                Differentiated Skills Taxonomy
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                ProofHire differentiates between institutionally anchored proofs, resume-extracted competencies, and self-declared skills.
              </p>
            </div>

            {/* 1. Institution Verified Skills */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> 1. Institutionally Verified Competencies (Anchored On-Chain)
              </span>
              <div className="flex flex-wrap gap-2">
                {student.verifiedSkills.map((sk) => (
                  <Link
                    key={sk.name}
                    href={`/verify/${sk.credentialId}`}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors"
                    title={`Verified by ${sk.source}`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    {sk.name}
                    <span className="text-[10px] text-emerald-600 font-normal">({sk.source.split(" ")[0]})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 2. Resume-Extracted Skills */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                <FileCode className="h-4 w-4" /> 2. Resume-Extracted Technical Skills (NLP Evidence)
              </span>
              <div className="flex flex-wrap gap-2">
                {student.resumeExtractedSkills.map((sk) => (
                  <span
                    key={sk.name}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-brand-50 border border-brand-200 text-brand-900 font-medium"
                  >
                    <Code2 className="h-3.5 w-3.5 text-brand-600" />
                    {sk.name}
                    <span className="text-[10px] text-slate-500">[{sk.confidence}]</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Self-Declared Skills */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4" /> 3. Self-Declared Competencies
              </span>
              <div className="flex flex-wrap gap-2">
                {student.selfDeclaredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center text-xs px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Projects and Technical Proofs */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-slate-700" />
              Verified Portfolio Projects
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {student.projects.map((proj) => (
                <Card key={proj.name} className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{proj.name}</h3>
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-slate-900"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
