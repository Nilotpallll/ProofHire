"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Activity, CheckCircle, ExternalLink, Cpu } from "lucide-react";

interface LiveIssuance {
  id: string;
  institution: string;
  title: string;
  recipient: string;
  hash: string;
  timeAgo: string;
}

const LIVE_EVENTS: LiveIssuance[] = [
  {
    id: "CRED-STANFORD-2025-001",
    institution: "Stanford University",
    title: "B.S. Computer Science",
    recipient: "Alex Rivera",
    hash: "0x3c990a...ef12",
    timeAgo: "2m ago",
  },
  {
    id: "CRED-MIT-2025-089",
    institution: "MIT Media Lab",
    title: "Advanced Cryptographic Engineering",
    recipient: "Elena Rostova",
    hash: "0x7b11c9...991b",
    timeAgo: "5m ago",
  },
  {
    id: "CRED-BERKELEY-2025-412",
    institution: "UC Berkeley",
    title: "Distributed Systems Architecture",
    recipient: "Marcus Chen",
    hash: "0x4a82f1...31ec",
    timeAgo: "8m ago",
  },
  {
    id: "CRED-OXFORD-2025-104",
    institution: "Oxford University",
    title: "M.Sc Artificial Intelligence",
    recipient: "Sarah Jenkins",
    hash: "0x91d4a0...882e",
    timeAgo: "12m ago",
  },
  {
    id: "CRED-ETHZ-2025-022",
    institution: "ETH Zürich",
    title: "Zero-Knowledge Proof Architect",
    recipient: "Liam Vance",
    hash: "0x12d98b...cc30",
    timeAgo: "17m ago",
  },
  {
    id: "CRED-PRINCETON-2025-331",
    institution: "Princeton University",
    title: "Applied Cryptography & Number Theory",
    recipient: "Maya Patel",
    hash: "0x6e2a15...55f1",
    timeAgo: "21m ago",
  },
];

export function LiveNetworkTicker() {
  const [blockHeight, setBlockHeight] = React.useState(4912482);
  const [verifiedCount, setVerifiedCount] = React.useState(14892);
  const [lastBlockTime, setLastBlockTime] = React.useState(6);

  // Live block simulation interval
  React.useEffect(() => {
    const timer = setInterval(() => {
      setBlockHeight((prev) => prev + 1);
      setVerifiedCount((prev) => prev + Math.floor(Math.random() * 2) + 1);
      setLastBlockTime(1);
    }, 12000);

    const secondsTimer = setInterval(() => {
      setLastBlockTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(secondsTimer);
    };
  }, []);

  return (
    <div className="w-full border-y border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#0B1120]/70 backdrop-blur-md overflow-hidden text-xs select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Network telemetry badges */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold">Sepolia Testnet</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
            <span>
              Block <strong className="text-slate-900 dark:text-white">#{blockHeight.toLocaleString()}</strong> ({lastBlockTime}s ago)
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>
              Verified: <strong className="text-brand-600 dark:text-brand-400">{verifiedCount.toLocaleString()}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> ZK-Registry Online
            </span>
          </div>
        </div>

        {/* Live Event Stream Marquee */}
        <div className="relative flex-1 max-w-2xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
            {LIVE_EVENTS.concat(LIVE_EVENTS).map((event, idx) => (
              <Link
                key={`${event.id}-${idx}`}
                href={`/verify/${encodeURIComponent(event.id)}`}
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {event.institution}:
                </span>
                <span className="truncate max-w-[140px] text-slate-600 dark:text-slate-400">
                  {event.title}
                </span>
                <span className="font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                  {event.hash}
                </span>
                <span className="text-[10px] text-slate-400">{event.timeAgo}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
