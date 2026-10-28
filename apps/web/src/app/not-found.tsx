"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, ArrowLeft, Home, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D1A] flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors">
      <HeroAtmosphere />

      <main role="main" className="relative z-10 max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-elevated p-6 sm:p-8 text-center animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 text-brand-600 dark:text-brand-400 mb-6 shadow-sm">
          <Compass className="h-8 w-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 mb-2">
          <Badge variant="neutral" size="sm">
            HTTP 404
          </Badge>
          <span className="text-xs font-mono text-slate-400">PAGE_NOT_FOUND</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Page Not Found
        </h1>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The requested page could not be located on the ProofHire network. The resource may have been relocated, unverified, or you followed an outdated link.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Go Back
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full">
              <Home className="h-4 w-4 mr-1.5" /> Return Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>ProofHire Decentralized Credential Network</span>
        </div>
      </main>
    </div>
  );
}
