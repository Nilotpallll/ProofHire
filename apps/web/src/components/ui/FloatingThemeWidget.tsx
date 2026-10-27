"use client";

import * as React from "react";
import { useTheme, Theme } from "@/context/ThemeContext";
import { Sun, Moon, Laptop, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingThemeWidget() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = React.useState(false);


  const modes: { id: Theme; label: string; icon: React.ReactNode }[] = [
    {
      id: "light",
      label: "Light",
      icon: <Sun className="h-3.5 w-3.5 text-amber-500" />,
    },
    {
      id: "dark",
      label: "Dark",
      icon: <Moon className="h-3.5 w-3.5 text-blue-400" />,
    },
    {
      id: "system",
      label: "Auto",
      icon: <Laptop className="h-3.5 w-3.5 text-slate-400" />,
    },
  ];

  return (
    <aside
      aria-label="Theme switcher widget"
      className="fixed bottom-5 right-5 z-50 select-none print:hidden"
    >
      <div
        className={cn(
          "group flex items-center gap-1.5 p-1.5 rounded-full border shadow-modal backdrop-blur-md transition-all duration-300 ease-out",
          "bg-white/90 border-slate-200/90 text-slate-800 hover:border-brand-300 hover:shadow-lg",
          "dark:bg-[#0B1120]/90 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700"
        )}
      >
        {/* Toggle Pill / Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Toggle theme (currently ${theme}). Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          title={`Click to switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
            resolvedTheme === "dark"
              ? "bg-slate-800/90 text-brand-300 shadow-inner hover:bg-slate-700"
              : "bg-amber-50 text-amber-600 shadow-inner hover:bg-amber-100"
          )}
        >
          {resolvedTheme === "dark" ? (
            <Moon className="h-4 w-4 animate-in spin-in-180 duration-300" />
          ) : (
            <Sun className="h-4 w-4 animate-in spin-in-180 duration-300" />
          )}
        </button>

        {/* Expand / Collapse Control */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse theme options" : "Expand theme options"}
          className="flex h-7 px-2 items-center gap-1.5 text-xs font-semibold rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <span className="capitalize text-[11px] font-medium tracking-wide">
            {theme}
          </span>
          {isExpanded ? (
            <ChevronRight className="h-3 w-3 text-slate-400" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-slate-400" />
          )}
        </button>

        {/* Segmented Mode Selector */}
        {isExpanded && (
          <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5 dark:border-slate-700 animate-in fade-in slide-in-from-right-2 duration-200">
            {modes.map((mode) => {
              const isActive = theme === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setTheme(mode.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                    isActive
                      ? "bg-brand-600 text-white shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {mode.icon}
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
