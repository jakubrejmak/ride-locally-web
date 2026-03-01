"use client";

import { createContext, useContext } from "react";
import { type Locale, pl, enUS } from "date-fns/locale";

const localeMap: Record<string, Locale> = { pl, en: enUS };

const LocaleContext = createContext<Locale>(pl);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const resolved = localeMap[locale] ?? pl;
  return (
    <LocaleContext.Provider value={resolved}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
