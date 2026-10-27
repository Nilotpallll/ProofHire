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
  ArrowRight,
  GraduationCap,
  Briefcase,
  Building2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const { login, seedLogin, isLoading } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    setSubmitting(true);
    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || "Login failed. Please check credentials or use demo accounts.");
    }
    setSubmitting(false);
  };

  const handleSeedLogin = async (role: Role) => {
    setError(null);
    setSubmitting(true);
    await seedLogin(role);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main id="main-content" className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Sign in to ProofHire
            </h1>
            <p className="text-xs text-slate-500">
              Access your decentralized credentials, jobs, and recruitment pipelines
            </p>
          </div>

          {/* Quick Demo Switcher Card for Instant Evaluation */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/70 p-4 space-y-3 shadow-subtle">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <span>One-Click Demonstration Logins:</span>
            </div>
            <p className="text-[11px] text-brand-700 leading-relaxed">
              Click any demo role to instantly sign in and explore the complete portal implementation without typing credentials:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleSeedLogin("STUDENT")}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-brand-200 text-brand-900 font-semibold hover:bg-brand-100/50 shadow-xs transition-colors"
              >
                <GraduationCap className="h-4 w-4 text-brand-600" /> Student
              </button>
              <button
                type="button"
                onClick={() => handleSeedLogin("RECRUITER")}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-brand-200 text-brand-900 font-semibold hover:bg-brand-100/50 shadow-xs transition-colors"
              >
                <Briefcase className="h-4 w-4 text-brand-600" /> Recruiter
              </button>
              <button
                type="button"
                onClick={() => handleSeedLogin("INSTITUTION")}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-brand-200 text-brand-900 font-semibold hover:bg-brand-100/50 shadow-xs transition-colors"
              >
                <Building2 className="h-4 w-4 text-brand-600" /> Institution
              </button>
              <button
                type="button"
                onClick={() => handleSeedLogin("ADMIN")}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-brand-200 text-brand-900 font-semibold hover:bg-brand-100/50 shadow-xs transition-colors"
              >
                <ShieldAlert className="h-4 w-4 text-brand-600" /> SuperAdmin
              </button>
            </div>
          </div>

          {/* Standard Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftAddon={<Mail className="h-4 w-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftAddon={<Lock className="h-4 w-4" />}
                required
              />

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
                Sign In
              </Button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Don&apos;t have an account yet?{" "}
              <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700">
                Create one now
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
