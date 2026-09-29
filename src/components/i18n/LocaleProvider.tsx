"use client";

import { createContext, useContext } from "react";
import { t, type MessageKey } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locale";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useT(): (key: MessageKey) => string {
  const locale = useLocale();
  return (key) => t(locale, key);
}
