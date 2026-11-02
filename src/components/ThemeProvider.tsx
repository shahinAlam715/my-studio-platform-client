
"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // `attribute="class"` is required: our CSS (`@custom-variant dark`,
  // `.dark body`) toggles off the `dark` class, but next-themes defaults
  // to `data-theme`.
  return (
    <NextThemeProvider attribute="class" {...props}>
      {children}
    </NextThemeProvider>
  );
}
