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
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Atmosphere */}
      <HeroAtmosphere />
      <Navbar />

      <main id="main-content" className="relative z-10 flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 text-white shadow-glow-brand ring-1 ring-white/20 mb-2">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Sign in to <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">ProofHire</span>
            </h1>
            <p className="text-xs text-slate-400">
              Access your decentralized credentials, zero-knowledge proofs, and recruitment pipelines
            </p>
          </div>

          {/* Quick Demo Switcher Card for Instant Evaluation */}
          <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-b from-brand-950/60 to-slate-900/60 p-4 space-y-3 backdrop-blur-md shadow-glow-brand/20">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-brand-300">
                <Sparkles className="h-4 w-4 text-brand-400 animate-pulse" />
                <span>One-Click Demonstration Logins</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Pre-Configured
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Click any demo role to instantly sign in and explore the full live portal without manual typing:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleSeedLogin("STUDENT")}
                className="group flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900/80 hover:bg-brand-900/40 border border-slate-700/80 hover:border-brand-500/50 text-slate-200 hover:text-white font-semibold shadow-xs transition-all duration-200"
              >
                <GraduationCap className="h-4 w-4 text-brand-400 group-hover:scale-110 transition-transform" /> Student
              </button>
              <button
                type="button"
                onClick={() => handleSeedLogin("RECRUITER")}
                className="group flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900/80 hover:bg-emerald-900/40 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 hover:text-white font-semibold shadow-xs transition-all duration-200"
              >
                <Briefcase className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" /> Recruiter
              </button>
              <button
                type="button"
                onClick={() => handleSeedLogin("INSTITUTION")}
                className="group flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900/80 hover:bg-purple-900/40 border border-slate-700/80 hover:border-purple-500/50 text-slate-200 hover:text-white font-semibold shadow-xs transition-all duration-200"
              >
                <Building2 className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" /> Institution
              </button>
              <button
                type="button"
                onClick={() => handleSeedLogin("ADMIN")}
                className="group flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900/80 hover:bg-amber-900/40 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 hover:text-white font-semibold shadow-xs transition-all duration-200"
              >
                <ShieldAlert className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" /> SuperAdmin
              </button>
            </div>
          </div>

          {/* Standard Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-6 sm:p-8 shadow-luxury space-y-6">
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
                Sign In
              </Button>
            </form>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              Don&apos;t have an account yet?{" "}
              <Link href="/register" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
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
