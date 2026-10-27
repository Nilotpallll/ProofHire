"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, Role } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { HeroAtmosphere } from "@/components/ui/HeroAtmosphere";
import {
  ShieldCheck,
  LayoutDashboard,
  Award,
  FileText,
  Briefcase,
  Users,
  Settings,
  PlusCircle,
  Building,
  History,
  FileCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function DashboardShell({
  role,
  title,
  subtitle,
  actions,
  children,
}: {
  role: Role;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, switchRole, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Role-specific navigation items
  const navConfig: Record<Role, NavItem[]> = {
    STUDENT: [
      { label: "Dashboard", href: "/student/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Verified Credentials", href: "/student/credentials", icon: <Award className="h-4 w-4" /> },
      { label: "Resume & AI Analysis", href: "/student/resume", icon: <FileText className="h-4 w-4" /> },
      { label: "Browse Jobs", href: "/student/jobs", icon: <Briefcase className="h-4 w-4" /> },
      { label: "My Applications", href: "/student/applications", icon: <FileCheck className="h-4 w-4" /> },
      { label: "Profile", href: "/student/profile", icon: <Users className="h-4 w-4" /> },
      { label: "Settings", href: "/student/settings", icon: <Settings className="h-4 w-4" /> },
    ],
    RECRUITER: [
      { label: "Dashboard", href: "/recruiter/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Active Jobs", href: "/recruiter/jobs", icon: <Briefcase className="h-4 w-4" /> },
      { label: "Post New Job", href: "/recruiter/jobs/new", icon: <PlusCircle className="h-4 w-4" /> },
      { label: "Verified Candidates", href: "/recruiter/candidates", icon: <Users className="h-4 w-4" /> },
      { label: "Applications Pipeline", href: "/recruiter/applications", icon: <FileCheck className="h-4 w-4" /> },
      { label: "Company Settings", href: "/recruiter/settings", icon: <Settings className="h-4 w-4" /> },
    ],
    INSTITUTION: [
      { label: "Dashboard", href: "/institution/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Issue Credential", href: "/institution/credentials/issue", icon: <PlusCircle className="h-4 w-4" /> },
      { label: "Issued Credentials", href: "/institution/credentials", icon: <Award className="h-4 w-4" /> },
      { label: "Student Directory", href: "/institution/students", icon: <Users className="h-4 w-4" /> },
      { label: "Issuance History", href: "/institution/credentials/history", icon: <History className="h-4 w-4" /> },
      { label: "Institution Settings", href: "/institution/settings", icon: <Settings className="h-4 w-4" /> },
    ],
    ADMIN: [
      { label: "Overview", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "User Management", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
      { label: "Institution Approvals", href: "/admin/institutions", icon: <Building className="h-4 w-4" /> },
      { label: "Audit & Integrity", href: "/admin/audit", icon: <History className="h-4 w-4" /> },
      { label: "Platform Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
    ],
  };

  const navItems = navConfig[role] || navConfig.STUDENT;

  const roleLabels: Record<Role, { name: string; color: "brand" | "verified" | "pending" | "neutral" }> = {
    STUDENT: { name: "Student", color: "brand" },
    RECRUITER: { name: "Recruiter", color: "neutral" },
    INSTITUTION: { name: "Institution", color: "verified" },
    ADMIN: { name: "Admin", color: "pending" },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D1A] flex transition-colors">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        aria-label="Sidebar navigation"
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo with Glow */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-700 via-brand-600 to-cyan-500 text-white shadow-glow-brand transition-transform group-hover:scale-105">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  ProofHire
                </span>
                <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mt-0.5">
                  {roleLabels[role].name} Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-brand-50 text-brand-700 font-semibold shadow-subtle dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                  }`}
                >
                  <span
                    className={
                      isActive
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                    }
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Role Switcher for Evaluator & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Role Switcher Pill for Effortless Testing */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              <span>Quick Role Switcher</span>
              <span className="text-[9px] text-brand-600 dark:text-brand-400 font-mono">Demo Mode</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {(["STUDENT", "RECRUITER", "INSTITUTION", "ADMIN"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-all text-center ${
                    role === r
                      ? "bg-brand-600 text-white font-semibold shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
                  }`}
                >
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile item */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user?.name || "Demo User"}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              aria-label="Log out"
              title="Log out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/80 px-4 sm:px-6 lg:px-8 backdrop-blur-xl dark:border-slate-800/90 dark:bg-[#0B1120]/80 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300">
                ProofHire
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-600 dark:text-slate-300 font-medium capitalize">
                {role.toLowerCase()}
              </span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-slate-900 dark:text-slate-100 font-semibold">{title}</span>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-3">
            <Link
              href="/verify/demo-credential"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-brand-600 bg-slate-100/80 px-2.5 py-1.5 rounded-xl border border-slate-200/60 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700 dark:hover:text-brand-400"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Public Verification Tool <ExternalLink className="h-3 w-3" />
            </Link>

            <Badge variant="verified" size="sm" icon>
              Connected (Sepolia Testnet)
            </Badge>

            <ThemeToggle showDropdown size="sm" />

            <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hidden sm:block">
              Exit Portal
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main role="main" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <HeroAtmosphere />
          <div className="relative z-10">
            {/* Page Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{subtitle}</p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2.5">{actions}</div>}
            </div>

            {/* Main Body Slot */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
