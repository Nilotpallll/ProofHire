import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  icon?: React.ReactNode;
  isDemo?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  trend = "neutral",
  subtitle,
  icon,
  isDemo = false,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-card transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-luxury hover:border-brand-500/40 backdrop-blur-md",
        "dark:bg-slate-900/80 dark:border-slate-800/80 dark:hover:border-brand-500/50 dark:hover:shadow-glow-brand/20",
        className
      )}
    >
      {/* Ambient hover wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {title}
        </span>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 shadow-xs group-hover:scale-110 group-hover:border-brand-500/30 transition-all duration-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
            {icon}
          </div>
        )}
      </div>

      <div className="relative z-10 mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full",
              trend === "up" && "text-emerald-700 bg-emerald-50 border border-emerald-200/60 dark:text-emerald-300 dark:bg-emerald-950/70 dark:border-emerald-800",
              trend === "down" && "text-red-700 bg-red-50 border border-red-200/60 dark:text-red-300 dark:bg-red-950/70 dark:border-red-800",
              trend === "neutral" && "text-slate-600 bg-slate-100 border border-slate-200/60 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700"
            )}
          >
            {trend === "up" && <TrendingUp className="mr-1 h-3 w-3" />}
            {trend === "down" && <TrendingDown className="mr-1 h-3 w-3" />}
            {trend === "neutral" && <Minus className="mr-1 h-3 w-3" />}
            {change}
          </span>
        )}
      </div>

      {(subtitle || isDemo) && (
        <div className="relative z-10 mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <span className="truncate pr-2">{subtitle}</span>
          {isDemo && (
            <span className="shrink-0 text-[10px] font-mono text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 px-2 py-0.5 rounded-full">
              On-Chain Verified
            </span>
          )}
        </div>
      )}
    </div>
  );
}
