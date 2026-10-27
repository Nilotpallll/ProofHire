"use client";

import * as React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThemeToggleProps {
  className?: string;
  showDropdown?: boolean;
  size?: "sm" | "md";
}

export function ThemeToggle({
  className,
  showDropdown = false,
  size = "md",
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [dropdownOpen]);

  // If showDropdown is true, render button with 3-mode menu (Light, Dark, System)
  if (showDropdown) {
    return (
      <div className={cn("relative inline-block", className)} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-label={`Theme setting: currently ${theme}`}
          aria-expanded={dropdownOpen}
          className={cn(
            "flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
            size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm"
          )}
        >
          {resolvedTheme === "dark" ? (
            <Moon className="h-4 w-4 text-brand-400 transition-transform rotate-0 dark:rotate-0" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500 transition-transform rotate-0" />
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-dropdown backdrop-blur-md animate-in fade-in zoom-in-95 z-50 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => {
                setTheme("light");
                setDropdownOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                theme === "light"
                  ? "bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950 dark:text-brand-300"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              Light
            </button>
            <button
              onClick={() => {
                setTheme("dark");
                setDropdownOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                theme === "dark"
                  ? "bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950 dark:text-brand-300"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <Moon className="h-3.5 w-3.5 text-brand-400" />
              Dark
            </button>
            <button
              onClick={() => {
                setTheme("system");
                setDropdownOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                theme === "system"
                  ? "bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950 dark:text-brand-300"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <Laptop className="h-3.5 w-3.5 text-slate-400" />
              System
            </button>
          </div>
        )}
      </div>
    );
  }

  // Simple quick toggle button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "relative flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
        size === "sm" ? "h-8 w-8" : "h-9 w-9",
        className
      )}
    >
      <Sun
        className={cn(
          "h-4 w-4 text-amber-500 transition-all duration-300",
          resolvedTheme === "dark"
            ? "rotate-90 scale-0 opacity-0 absolute"
            : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "h-4 w-4 text-brand-400 transition-all duration-300",
          resolvedTheme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0 absolute"
        )}
      />
    </button>
  );
}
