"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function RecruiterSettingsPage() {
  const [companyName, setCompanyName] = React.useState("Aether Cryptographic Labs");
  const [website, setWebsite] = React.useState("https://aetherlabs.tech");
  const [industry, setIndustry] = React.useState("Decentralized Infrastructure & FinTech");
  const [designation, setDesignation] = React.useState("VP of Engineering Talent");
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell
      role="RECRUITER"
      title="Company & Recruiter Settings"
      subtitle="Manage corporate verification, hiring team members, and company branding."
      actions={
        <Button onClick={handleSave} variant="primary" size="sm">
          {saved ? "Saved" : "Save Settings"}
        </Button>
      }
    >
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {saved && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Company settings successfully updated.
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brand-600" />
                Corporate Entity Details
              </CardTitle>
              <Badge variant="verified" size="sm" icon>
                Verified Company
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <Input
                label="Official Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
              />
              <Input
                label="Industry Domain"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
              />
              <Input
                label="Your Designation / Role"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </DashboardShell>
  );
}
