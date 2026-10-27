"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth, Role } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main id="main-content" className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create your ProofHire Account
            </h1>
            <p className="text-xs text-slate-500">
              Join the decentralized credential verification & recruitment network
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
            {/* Role Selector Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                I am registering as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole("STUDENT")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedRole === "STUDENT"
                      ? "border-brand-600 bg-brand-50/70 text-brand-700 ring-2 ring-brand-500/20"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <GraduationCap className="h-5 w-5 mb-1 text-brand-600" />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("RECRUITER")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedRole === "RECRUITER"
                      ? "border-brand-600 bg-brand-50/70 text-brand-700 ring-2 ring-brand-500/20"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <Briefcase className="h-5 w-5 mb-1 text-brand-600" />
                  Recruiter
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("INSTITUTION")}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedRole === "INSTITUTION"
                      ? "border-brand-600 bg-brand-50/70 text-brand-700 ring-2 ring-brand-500/20"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <Building2 className="h-5 w-5 mb-1 text-brand-600" />
                  Institution
                </button>
              </div>
            </div>

            {selectedRole === "INSTITUTION" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-start gap-2.5 text-xs text-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
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
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  required
                />
                <label htmlFor="agree-terms" className="text-xs text-slate-600">
                  I agree to the ProofHire Terms of Service and Privacy Policy
                </label>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-xs text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={submitting}
              >
                Create Account & Enter Portal
              </Button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
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
