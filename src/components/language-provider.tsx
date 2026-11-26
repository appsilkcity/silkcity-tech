"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/types";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (en: string, bn: string) => string;
  pick: <T extends Record<string, unknown>>(row: T, field: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "silkcity-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "bn" || saved === "en") {
      setLangState(saved);
      document.documentElement.lang = saved;
    } else {
      document.documentElement.lang = "bn";
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  const toggle = useCallback(() => setLang(lang === "bn" ? "en" : "bn"), [lang, setLang]);

  const value = useMemo<LanguageContextValue>(() => ({
    lang,
    setLang,
    toggle,
    t: (en, bn) => (lang === "bn" ? bn : en),
    pick: (row, field) => {
      const key = `${field}${lang === "bn" ? "Bn" : "En"}`;
      const fallback = `${field}En`;
      return String(row[key] ?? row[fallback] ?? "");
    },
  }), [lang, setLang, toggle]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();
  return (
    <div className="inline-flex items-center rounded-full border border-blue-200 bg-white p-0.5 shadow-sm" role="group" aria-label="Language toggle">
      <button
        type="button"
        onClick={() => setLang("bn")}
        aria-pressed={lang === "bn"}
        className={`rounded-full px-3 py-1 text-sm font-bold transition ${lang === "bn" ? "bg-brand text-white" : "text-heading hover:bg-blue-50"} ${compact ? "px-2.5" : ""}`}
      >
        বাংলা
      </button>
      <span className="px-0.5 text-slate-300">|</span>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-3 py-1 text-sm font-bold transition ${lang === "en" ? "bg-brand text-white" : "text-heading hover:bg-blue-50"} ${compact ? "px-2.5" : ""}`}
      >
        EN
      </button>
    </div>
  );
}
