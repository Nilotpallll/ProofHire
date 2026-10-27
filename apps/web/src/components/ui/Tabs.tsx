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
          ? "border-b border-slate-200 gap-6"
          : "bg-slate-100/80 p-1 rounded-lg gap-1 border border-slate-200/60",
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
                  ? "border-brand-600 text-brand-600 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300",
              ],
              variant === "pills" && [
                "px-3 py-1.5 rounded-md",
                isActive
                  ? "bg-white text-slate-900 shadow-subtle font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50",
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
                    ? "bg-brand-100 text-brand-700"
                    : "bg-slate-200 text-slate-600"
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
