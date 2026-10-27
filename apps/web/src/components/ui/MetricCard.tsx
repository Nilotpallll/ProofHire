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
        "relative rounded-xl border border-slate-200/90 bg-white p-5 shadow-card transition-all hover:shadow-md",
        "dark:bg-slate-900/90 dark:border-slate-800",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded",
              trend === "up" && "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/60",
              trend === "down" && "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/60",
              trend === "neutral" && "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800"
            )}
          >
            {trend === "up" && <TrendingUp className="mr-0.5 h-3 w-3" />}
            {trend === "down" && <TrendingDown className="mr-0.5 h-3 w-3" />}
            {trend === "neutral" && <Minus className="mr-0.5 h-3 w-3" />}
            {change}
          </span>
        )}
      </div>

      {(subtitle || isDemo) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{subtitle}</span>
          {isDemo && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-1.5 py-0.5 rounded">
              Verified Data
            </span>
          )}
        </div>
      )}
    </div>
  );
}
