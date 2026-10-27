"use client";

import * as React from "react";

export function HeroAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-10"
    >
      {/* Radiant Glowing Orbs with Smooth Floating Keyframes */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-brand-600/20 via-indigo-500/15 to-cyan-400/20 rounded-full blur-[110px] dark:from-brand-600/25 dark:via-cyan-500/15 dark:to-emerald-500/15 animate-pulse-slow" />
      <div className="absolute top-20 -left-20 w-[420px] h-[420px] bg-gradient-to-br from-blue-500/15 to-purple-600/10 rounded-full blur-[90px] dark:from-brand-500/20 dark:to-indigo-600/15 animate-float-slow" />
      <div className="absolute top-48 -right-20 w-[460px] h-[460px] bg-gradient-to-bl from-emerald-500/15 to-cyan-500/15 rounded-full blur-[95px] dark:from-emerald-500/15 dark:to-brand-500/15 animate-float-delayed" />

      {/* High-Tech Cryptographic Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)]" />

      {/* Cyber Circuit Dot Grid */}
      <div className="absolute inset-0 bg-dots-pattern opacity-40 dark:opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_60%,transparent_100%)]" />

      {/* Subtle Top Ambient Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
    </div>
  );
}
