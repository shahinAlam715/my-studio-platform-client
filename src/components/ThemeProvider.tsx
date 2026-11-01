
"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : { type: "application/json" as const };

  return (
    <NextThemeProvider {...props} scriptProps={scriptProps}>
      {children}
    </NextThemeProvider>
  );
}
