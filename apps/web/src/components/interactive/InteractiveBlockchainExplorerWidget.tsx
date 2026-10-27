"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
  AlertTriangle,
  FileCode,
  Check,
  Copy,
} from "lucide-react";

interface BlockEntry {
  block: number;
  txHash: string;
  type: "ISSUANCE" | "REVOCATION" | "INSTITUTION_APPROVED";
  issuer: string;
  recipient: string;
  credentialTitle: string;
  age: string;
  status: "CONFIRMED";
  digest: string;
}

const BLOCK_STREAM: BlockEntry[] = [
  {
    block: 4912482,
    txHash: "0x3c990a56e5223a4b64c18c99277d337f75eb1432c253457a4e69b0faee2ef124",
    type: "ISSUANCE",
    issuer: "Stanford School of Engineering",
    recipient: "Alex Rivera",
    credentialTitle: "Bachelor of Science in Computer Science",
    age: "2m ago",
    status: "CONFIRMED",
    digest: "0x8f2d59a721c034988bf2a3167b545f949c890250dfacdbca991c10729729cfa9",
  },
  {
    block: 4912468,
    txHash: "0x7b11c90a1492a54b38d19a99781b456e72cb1531e253998a4e69c0faee2a991b",
    type: "ISSUANCE",
    issuer: "MIT Media Lab",
    recipient: "Elena Rostova",
    credentialTitle: "Advanced Cryptographic Engineering",
    age: "5m ago",
    status: "CONFIRMED",
    digest: "0x14ea523097bf54a20b78ca9013c473be921501726a310bbfa4995c80ef429188",
  },
  {
    block: 4912440,
    txHash: "0x892a014299bb3fa90812301982b1239910283019283019238012938019283019",
    type: "REVOCATION",
    issuer: "Stanford School of Engineering",
    recipient: "John Doe",
    credentialTitle: "Honorary Web Engineering Certificate",
    age: "18m ago",
    status: "CONFIRMED",
    digest: "0xbad0000000000000000000000000000000000000000000000000000000000bad",
  },
  {
    block: 4912390,
    txHash: "0x4a82f10019283012938102938109238109283019283019283019283019283019",
    type: "INSTITUTION_APPROVED",
    issuer: "ProofHire Governance Council",
    recipient: "UC Berkeley School of Information",
    credentialTitle: "Accredited Institutional Issuer License",
    age: "35m ago",
    status: "CONFIRMED",
    digest: "0x992ab100234a9194e10492ab41029e00194819aef340192e1091283019283012",
  },
];

export function InteractiveBlockchainExplorerWidget() {
  const [activeTab, setActiveTab] = React.useState<"all" | "issuance" | "revocation">("all");
  const [searchFilter, setSearchFilter] = React.useState("");
  const [selectedTx, setSelectedTx] = React.useState<BlockEntry | null>(null);
  const [copiedTx, setCopiedTx] = React.useState(false);

  const filteredBlocks = BLOCK_STREAM.filter((entry) => {
    if (activeTab === "issuance" && entry.type !== "ISSUANCE") return false;
    if (activeTab === "revocation" && entry.type !== "REVOCATION") return false;
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      entry.issuer.toLowerCase().includes(q) ||
      entry.recipient.toLowerCase().includes(q) ||
      entry.credentialTitle.toLowerCase().includes(q) ||
      entry.txHash.toLowerCase().includes(q)
    );
  });

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  return (
    <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl shadow-luxury overflow-hidden p-6 sm:p-10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 mb-2">
            <Layers className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Decentralized ProofHire Explorer</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Audit Real-Time Ethereum Smart Contract Events
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Inspect live verifiable credentials, institutional registrations, and revocation logs anchored in the Ethereum Sepolia registry.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by institution, student or hash..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "all"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-subtle"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveTab("issuance")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "issuance"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-subtle"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Issuances
            </button>
            <button
              onClick={() => setActiveTab("revocation")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "revocation"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-subtle"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Revocations
            </button>
          </div>
        </div>
      </div>

      {/* Explorer Table */}
      <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/50 dark:bg-slate-900/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Block / Tx</th>
                <th className="py-3 px-4">Authority / Issuer</th>
                <th className="py-3 px-4">Credential Claim</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-right">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredBlocks.map((item) => (
                <tr
                  key={item.txHash}
                  onClick={() => setSelectedTx(item)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    {item.type === "ISSUANCE" && (
                      <Badge variant="verified" size="sm">
                        MINTED
                      </Badge>
                    )}
                    {item.type === "REVOCATION" && (
                      <Badge variant="revoked" size="sm">
                        REVOKED
                      </Badge>
                    )}
                    {item.type === "INSTITUTION_APPROVED" && (
                      <Badge variant="brand" size="sm">
                        ACCREDITED
                      </Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-slate-900 dark:text-slate-200 font-semibold">
                      #{item.block}
                    </span>
                    <span className="text-slate-400 block text-[10px] truncate max-w-[120px]">
                      {item.txHash}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {item.issuer}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                    {item.credentialTitle}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {item.recipient}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-400 whitespace-nowrap">
                    {item.age}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Transaction Inspector Modal/Drawer */}
      {selectedTx && (
        <div className="mt-6 p-5 rounded-2xl border border-brand-200 dark:border-brand-800/80 bg-brand-50/40 dark:bg-brand-950/30 text-xs space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-brand-200/60 dark:border-brand-800/60 pb-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              Transaction Details & On-Chain Proof
            </span>
            <button
              onClick={() => setSelectedTx(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold text-[11px]"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">TRANSACTION HASH:</span>
              <div className="flex items-center gap-2">
                <span className="truncate text-slate-900 dark:text-slate-100 font-semibold">{selectedTx.txHash}</span>
                <button onClick={() => copyHash(selectedTx.txHash)} className="text-slate-400 hover:text-slate-700">
                  {copiedTx ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">KECCAK-256 DOCUMENT DIGEST:</span>
              <span className="truncate text-slate-900 dark:text-slate-100 font-semibold block">{selectedTx.digest}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Registry: CredentialRegistry.sol (0x5FbDB2315678afecb367f032d93F642f64180aa3)</span>
            <Link
              href="/verify/CRED-STANFORD-2025-001"
              className="font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Open Full Public Verifier <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
