"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Wallet,
  ShieldCheck,
  Lock,
  Bell,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

export default function StudentSettingsPage() {
  const [walletAddress] = React.useState("0x71C...b489");
  const [copied, setCopied] = React.useState(false);
  const [allowRecruiterSearch, setAllowRecruiterSearch] = React.useState(true);
  const [notifyOnMatch, setNotifyOnMatch] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  const copyWallet = () => {
    navigator.clipboard.writeText("0x71C6bf29D0F3F2826F67597fE768f763C44db489");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell
      role="STUDENT"
      title="Student Settings"
      subtitle="Manage your connected Ethereum wallet, zero-knowledge privacy preferences, and account security."
      actions={
        <Button onClick={handleSave} variant="primary" size="sm">
          {saved ? "Settings Saved" : "Save Settings"}
        </Button>
      }
    >
      <div className="space-y-6 max-w-4xl">
        {saved && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Your account and privacy settings have been updated.
          </div>
        )}

        {/* Connected Wallet Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-brand-600" />
                Connected Web3 Wallet
              </CardTitle>
              <Badge variant="verified" size="sm" icon>
                Connected (Sepolia)
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              This non-custodial wallet address receives your cryptographically signed academic credentials from accredited institutions.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Primary Receiving Address
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">
                  0x71C6bf29D0F3F2826F67597fE768f763C44db489
                </span>
              </div>
              <Button
                onClick={copyWallet}
                variant="outline"
                size="sm"
                leftIcon={copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              >
                {copied ? "Copied" : "Copy Address"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Recruiter Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-600" />
              Privacy & Zero-Knowledge Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">
                  Public Recruiter Searchability
                </p>
                <p className="text-[11px] text-slate-500">
                  Allow verified corporate recruiters to discover your profile based on verified competencies.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowRecruiterSearch}
                onChange={(e) => setAllowRecruiterSearch(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">
                  AI Fit Notifications
                </p>
                <p className="text-[11px] text-slate-500">
                  Receive email alerts when a newly posted job matches &gt;85% of your verified skills.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyOnMatch}
                onChange={(e) => setNotifyOnMatch(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
