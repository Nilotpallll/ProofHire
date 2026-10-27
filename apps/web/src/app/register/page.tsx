"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth, Role } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  GraduationCap,
  Briefcase,
  Building2,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = React.useState<"STUDENT" | "RECRUITER" | "INSTITUTION">("STUDENT");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [org, setOrg] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }

    setSubmitting(true);
    const res = await register({
      name,
      email,
      role: selectedRole,
      password,
      organizationOrUniversity: org,
    });

    if (!res.success) {
      setError(res.error || "Registration failed. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      <HeroAtmosphere />
      <Navbar />

      <main id="main-content" className="relative z-10 flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 text-white shadow-glow-brand ring-1 ring-white/20 mb-2">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Create your <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">ProofHire</span> Account
            </h1>
            <p className="text-xs text-slate-400">
              Join the decentralized credential verification & sovereign identity network
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-6 sm:p-8 shadow-luxury space-y-6">
            {/* Role Selector Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                I am registering as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole("STUDENT")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                    selectedRole === "STUDENT"
                      ? "border-brand-500 bg-brand-500/20 text-brand-300 ring-2 ring-brand-500/30 shadow-glow-brand/30"
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <GraduationCap className="h-5 w-5 mb-1.5 text-brand-400" />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("RECRUITER")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                    selectedRole === "RECRUITER"
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/30 shadow-glow-emerald/30"
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Briefcase className="h-5 w-5 mb-1.5 text-emerald-400" />
                  Recruiter
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("INSTITUTION")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                    selectedRole === "INSTITUTION"
                      ? "border-purple-500 bg-purple-500/20 text-purple-300 ring-2 ring-purple-500/30 shadow-sm"
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Building2 className="h-5 w-5 mb-1.5 text-purple-400" />
                  Institution
                </button>
              </div>
            </div>

            {selectedRole === "INSTITUTION" && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/40 p-3.5 flex items-start gap-2.5 text-xs text-amber-200 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  Institution accounts require administrative verification of accreditation before on-chain credential issuance permissions are activated.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftAddon={<User className="h-4 w-4" />}
                required
              />

              <Input
                label="Official Email address"
                type="email"
                placeholder="name@organization.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftAddon={<Mail className="h-4 w-4" />}
                required
              />

              <Input
                label={
                  selectedRole === "STUDENT"
                    ? "University / Alma Mater"
                    : selectedRole === "RECRUITER"
                    ? "Company Name"
                    : "Accredited Institution Name"
                }
                placeholder={
                  selectedRole === "STUDENT"
                    ? "Stanford University"
                    : selectedRole === "RECRUITER"
                    ? "Aether Cryptographic Labs"
                    : "School of Engineering"
                }
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftAddon={<Lock className="h-4 w-4" />}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftAddon={<Lock className="h-4 w-4" />}
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-brand-600 focus:ring-brand-500/40"
                  required
                />
                <label htmlFor="agree-terms" className="text-xs text-slate-300">
                  I agree to the ProofHire Terms of Service and Privacy Policy
                </label>
              </div>

              {error && (
                <div className="rounded-lg bg-red-950/60 p-3 border border-red-800 text-xs text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full shadow-glow-brand"
                isLoading={submitting}
              >
                Create Account & Enter Portal
              </Button>
            </form>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
