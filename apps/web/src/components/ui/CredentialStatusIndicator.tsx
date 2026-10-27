import * as React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Clock, AlertTriangle, ExternalLink } from "lucide-react";

export interface CredentialStatusIndicatorProps {
  status: "ISSUED" | "PENDING" | "REVOKED";
  txHash?: string;
  className?: string;
  showDetails?: boolean;
}

export function CredentialStatusIndicator({
  status,
  txHash,
  className,
  showDetails = true,
}: CredentialStatusIndicatorProps) {
  if (status === "ISSUED") {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Verified On-Chain
        </span>
        {showDetails && txHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-mono text-slate-500 hover:text-brand-600 inline-flex items-center gap-0.5 hover:underline"
            title="View Ethereum Sepolia Transaction"
          >
            Proof <ExternalLink className="h-2.5 w-2.5" />
          </a>
        )}
      </div>
    );
  }

  if (status === "REVOKED") {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200/80 px-2 py-0.5 rounded-full">
          <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
          Revoked Credential
        </span>
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
        <Clock className="h-3.5 w-3.5 text-amber-600" />
        Pending Issuance
      </span>
    </div>
  );
}
