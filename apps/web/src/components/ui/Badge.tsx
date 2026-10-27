import * as React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Clock, AlertTriangle, CheckCircle, Info } from "lucide-react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "verified"
    | "pending"
    | "revoked"
    | "neutral"
    | "brand"
    | "success"
    | "warning"
    | "outline";
  size?: "sm" | "md" | "lg";
  icon?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  icon = false,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full select-none transition-colors";

  const variants = {
    verified:
      "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-subtle dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80",
    pending:
      "bg-amber-50 text-amber-700 border border-amber-200/80 shadow-subtle dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80",
    revoked:
      "bg-red-50 text-red-700 border border-red-200/80 shadow-subtle dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/80",
    neutral:
      "bg-slate-100 text-slate-700 border border-slate-200 shadow-subtle dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    brand:
      "bg-brand-50 text-brand-700 border border-brand-200 shadow-subtle dark:bg-brand-950/60 dark:text-brand-300 dark:border-brand-800/80",
    success:
      "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-700",
    warning:
      "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-700",
    outline:
      "bg-transparent text-slate-700 border border-slate-300 dark:text-slate-300 dark:border-slate-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-0.5 text-xs font-semibold gap-1.5",
    lg: "px-3 py-1 text-sm font-semibold gap-2",
  };

  const getIcon = () => {
    if (!icon) return null;
    switch (variant) {
      case "verified":
        return <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />;
      case "pending":
        return <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />;
      case "revoked":
        return <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />;
      case "success":
        return <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Info className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />;
    }
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {getIcon()}
      {children}
    </span>
  );
}
