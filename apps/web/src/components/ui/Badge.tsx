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
    "inline-flex items-center font-medium rounded-full select-none";

  const variants = {
    verified:
      "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-subtle",
    pending:
      "bg-amber-50 text-amber-700 border border-amber-200/80 shadow-subtle",
    revoked:
      "bg-red-50 text-red-700 border border-red-200/80 shadow-subtle",
    neutral:
      "bg-slate-100 text-slate-700 border border-slate-200 shadow-subtle",
    brand:
      "bg-brand-50 text-brand-700 border border-brand-200 shadow-subtle",
    success:
      "bg-emerald-100 text-emerald-800 border border-emerald-300",
    warning:
      "bg-amber-100 text-amber-800 border border-amber-300",
    outline:
      "bg-transparent text-slate-700 border border-slate-300",
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
        return <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />;
      case "pending":
        return <Clock className="h-3.5 w-3.5 text-amber-600" />;
      case "revoked":
        return <AlertTriangle className="h-3.5 w-3.5 text-red-600" />;
      case "success":
        return <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />;
      default:
        return <Info className="h-3.5 w-3.5 text-slate-500" />;
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
