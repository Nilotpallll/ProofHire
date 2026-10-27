"use client";

import * as React from "react";
import { LuxurySpotlightCard } from "@/components/ui/LuxurySpotlightCard";
import { ShieldCheck, Zap, DollarSign, Building, Award } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  caption: string;
  icon: React.ReactNode;
  glow: "blue" | "emerald" | "gold" | "purple";
}

const STATS: StatItem[] = [
  {
    label: "Degree Fraud Prevented",
    value: "$14.8M",
    caption: "Saved in litigation & third-party background checks",
    icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
    glow: "emerald",
  },
  {
    label: "Cryptographic Proofs",
    value: "18,490+",
    caption: "Permanently anchored to EVM-compatible networks",
    icon: <Award className="h-5 w-5 text-brand-500" />,
    glow: "blue",
  },
  {
    label: "Accredited Issuers",
    value: "42",
    caption: "Universities, polytechnics & certification bodies",
    icon: <Building className="h-5 w-5 text-amber-500" />,
    glow: "gold",
  },
  {
    label: "Verification Latency",
    value: "0.42s",
    caption: "Instant on-chain mathematical confirmation",
    icon: <Zap className="h-5 w-5 text-cyan-500" />,
    glow: "blue",
  },
];

export function LiveStatsCounter() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <LuxurySpotlightCard
              key={stat.label}
              glowColor={stat.glow}
              className="p-6 text-left flex flex-col justify-between h-full"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {stat.label}
                </span>
                <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                  {stat.value}
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {stat.caption}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>On-Chain Finalized</span>
              </div>
            </LuxurySpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
