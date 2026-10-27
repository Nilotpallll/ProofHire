"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Building2, ShieldCheck, CheckCircle2, Wallet } from "lucide-react";

export default function InstitutionSettingsPage() {
  const [name, setName] = React.useState("Stanford School of Engineering");
  const [code, setCode] = React.useState("STANFORD-CS");
  const [website, setWebsite] = React.useState("https://engineering.stanford.edu");
  const [contactEmail, setContactEmail] = React.useState("registrar@stanford.edu");
  const [phone, setPhone] = React.useState("+1-650-723-2300");
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell
      role="INSTITUTION"
      title="Institution Configuration"
      subtitle="Accreditation registry details and authorized signer wallet permissions."
      actions={
        <Button onClick={handleSave} variant="primary" size="sm">
          {saved ? "Saved" : "Save Changes"}
        </Button>
      }
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {saved && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Institution configuration updated.
          </div>
        )}

        {/* Institution Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brand-600" />
                Accredited Academic Authority
              </CardTitle>
              <Badge variant="verified" size="sm" icon>
                Accreditation Approved
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Institution Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Official Institution Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <Input
                label="Official Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
              />
              <Input
                label="Registrar Contact Email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
              <Input
                label="Contact Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Authorized Signer Key */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-brand-600" />
              On-Chain Authorized Signer Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              This cryptographic key is authorized by the ProofHire registry smart contract to issue degrees and certificates on Ethereum Sepolia.
            </p>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs flex items-center justify-between">
              <span className="text-slate-800 font-bold">
                0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
              </span>
              <Badge variant="verified" size="sm" icon>
                Active Issuer
              </Badge>
            </div>
          </CardContent>
        </Card>
      </form>
    </DashboardShell>
  );
}
