"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Settings, ShieldCheck, CheckCircle2, Globe, Cpu } from "lucide-react";

export default function AdminSettingsPage() {
  const [contractAddress, setContractAddress] = React.useState("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  const [rpcUrl, setRpcUrl] = React.useState("https://rpc.sepolia.org");
  const [aiUrl, setAiUrl] = React.useState("http://localhost:8000");
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell
      role="ADMIN"
      title="Platform Global Settings"
      subtitle="Configure smart contract registry parameters, RPC providers, and AI endpoints."
      actions={
        <Button onClick={handleSave} variant="primary" size="sm">
          {saved ? "Saved" : "Save Platform Settings"}
        </Button>
      }
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {saved && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Global settings updated.
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-brand-600" />
                Ethereum Sepolia Smart Contract Registry
              </CardTitle>
              <Badge variant="verified" size="sm" icon>
                EVM Synced
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Deployed ProofHire Registry Contract Address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              required
            />
            <Input
              label="Sepolia RPC Provider URL"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-brand-600" />
              AI Intelligence Microservice Endpoint
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="FastAPI Microservice Base URL"
              value={aiUrl}
              onChange={(e) => setAiUrl(e.target.value)}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Circuit Breaker & Maintenance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">
                  Global Maintenance Circuit Breaker
                </p>
                <p className="text-[11px] text-slate-500">
                  Pause all new on-chain issuance and candidate applications during protocol upgrades.
                </p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </DashboardShell>
  );
}
