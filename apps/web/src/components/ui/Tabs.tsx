"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "underline" | "pills";
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  className,
}: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Tabs navigation"
      className={cn(
        "flex items-center",
        variant === "underline"
          ? "border-b border-slate-200 dark:border-slate-800 gap-6"
          : "bg-slate-100/80 dark:bg-slate-900/90 p-1 rounded-lg gap-1 border border-slate-200/60 dark:border-slate-800",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 select-none",
              variant === "underline" && [
                "pb-3 pt-1 border-b-2",
                isActive
                  ? "border-brand-600 text-brand-600 dark:border-brand-500 dark:text-brand-400 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-700",
              ],
              variant === "pills" && [
                "px-3 py-1.5 rounded-md",
                isActive
                  ? "bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100 shadow-subtle font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50",
              ]
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-semibold leading-none",
                  isActive
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
