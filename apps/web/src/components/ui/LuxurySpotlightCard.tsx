"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LuxurySpotlightCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: "blue" | "emerald" | "gold" | "purple";
  interactive?: boolean;
}

export function LuxurySpotlightCard({
  className,
  children,
  glowColor = "blue",
  interactive = true,
  ...props
}: LuxurySpotlightCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [opacity, setOpacity] = React.useState<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !interactive) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setOpacity(0);
  };

  const glowStyles = {
    blue: "rgba(59, 130, 246, 0.14)",
    emerald: "rgba(16, 185, 129, 0.14)",
    gold: "rgba(245, 158, 11, 0.14)",
    purple: "rgba(168, 85, 247, 0.14)",
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-all duration-300",
        "bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md",
        "border-slate-200/90 dark:border-slate-800/90",
        "shadow-card hover:shadow-luxury hover:-translate-y-1 hover:border-brand-500/30 dark:hover:border-brand-400/30",
        className
      )}
      {...props}
    >
      {/* Interactive Cursor Spotlight Glow */}
      {interactive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(450px circle at ${position.x}px ${position.y}px, ${glowStyles[glowColor]}, transparent 75%)`,
          }}
        />
      )}

      {/* Subtle top edge specular highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent" />

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
