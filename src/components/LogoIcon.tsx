"use client";

import { useId } from "react";

import type { LogoIconProps } from "@/type";

export default function LogoIcon({ className }: LogoIconProps) {
  // Unique per render so the Navbar and the Footer can both draw the mark
  // on the same page without emitting duplicate gradient ids.
  const gradientId = `logo-gold-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe08a" />
          <stop offset="50%" stopColor="#f5c518" />
          <stop offset="100%" stopColor="#c99a0a" />
        </linearGradient>
      </defs>
      <path
        d="M7.2 3h9.6L22 9.2 12 21 2 9.2 7.2 3Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M7.2 3 12 9.2 16.8 3M2 9.2h20M12 9.2V21"
        fill="none"
        stroke="#0b0b0b"
        strokeOpacity=".4"
        strokeWidth="1"
      />
    </svg>
  );
}
