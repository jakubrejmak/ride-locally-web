"use client";

import { ThemeProvider } from "next-themes";
import { LocaleProvider } from "@/app/locale-context";

export default function Providers({
  locale = "pl",
  children,
}: {
  locale?: string;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LocaleProvider locale={locale}>
        {children}
      </LocaleProvider>
    </ThemeProvider>
  );
}
