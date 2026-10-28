"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, LayoutDashboard, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth, Role } from "@/context/AuthContext";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, switchRole, isAuthenticated } = useAuth();

  const handleRoleSwitch = (targetRole: Role) => {
    switchRole(targetRole);
    const targetDashboard = `/${targetRole.toLowerCase()}/dashboard`;
    router.push(targetDashboard);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D1A] flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors">
      <HeroAtmosphere />

      <main role="main" className="relative z-10 max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-elevated p-6 sm:p-8 text-center animate-fade-in">
        {/* Shield Icon Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 mb-6 shadow-sm">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 mb-2">
          <Badge variant="pending" size="sm">
            HTTP 403 Forbidden
          </Badge>
          <span className="text-xs font-mono text-slate-400">ACCESS_RESTRICTED</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Restricted Portal Access
        </h1>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Your current account does not have sufficient role authorizations to view this resource. ProofHire enforces strict role-based cryptographic isolation between Students, Recruiters, Accredited Institutions, and SuperAdmins.
        </p>

        {isAuthenticated && user && (
          <div className="mt-6 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200 mb-1">
              <span>Active Identity:</span>
              <span className="text-brand-600 dark:text-brand-400 font-mono uppercase">{user.role}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Signed in as <span className="font-mono text-slate-700 dark:text-slate-300">{user.email}</span>
            </p>
          </div>
        )}

        {/* Quick Demo Switcher Section */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-left">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
            <span className="flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5" />
              Switch Portal (Demo Environment)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["STUDENT", "RECRUITER", "INSTITUTION", "ADMIN"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleSwitch(r)}
                className="flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <span>{r.charAt(0) + r.slice(1).toLowerCase()}</span>
                {user?.role === r ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                ) : (
                  <span className="text-[10px] text-slate-400">&rarr;</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Go Back
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full">
              <LayoutDashboard className="h-4 w-4 mr-1.5" /> Return Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
