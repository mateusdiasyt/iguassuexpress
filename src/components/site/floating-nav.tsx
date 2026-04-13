"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  BookOpenText,
  BriefcaseBusiness,
  Compass,
  House,
  Images,
  MapPinned,
  Menu,
  Phone,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: House, special: true },
  { href: "/apartamentos", label: "Apartamentos", icon: BedDouble },
  { href: "/restaurante", label: "Restaurante", icon: UtensilsCrossed },
  { href: "/galeria-de-fotos", label: "Galeria", icon: Images },
  { href: "/tour-360", label: "Tour 360", icon: Compass },
  { href: "/localizacao", label: "Localizacao", icon: MapPinned },
  { href: "/blog", label: "Blog", icon: BookOpenText },
  { href: "/contato", label: "Contato", icon: Phone },
  { href: "/trabalhe-conosco", label: "Carreiras", icon: BriefcaseBusiness },
];

const languageOptions = [
  { label: "PT-BR", code: "pt" },
  { label: "EN", code: "en" },
  { label: "ESP", code: "es" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          element: string,
        ) => void;
      };
    };
  }
}

type FloatingNavProps = {
  hotelName: string;
  logo?: string | null;
};

const DEFAULT_LOGO_SRC = "/logo-hotel-principal.png";
const TOP_ONLY_THRESHOLD = 6;
const DOCK_THEME_OFFSET = 84;
const HOME_TOP_DARK = "border-[#d7b481]/44 bg-[#355f7b]/94 text-white shadow-[0_12px_30px_rgba(7,27,42,0.24)]";
const HOME_TOP_DARK_ACTIVE = "border-[#edd6b0]/48 bg-[#416f8d]/96";
const HOME_TOP_DARK_HOVER = "hover:border-[#edd6b0]/48 hover:bg-[#3d6987]/96";
const HOME_TOP_LIGHT = "border-[#d6b37d]/45 bg-[#f6ead6] text-[#855f31] shadow-[0_10px_24px_rgba(135,100,53,0.12)]";
const HOME_TOP_LIGHT_ACTIVE = "border-[#c59451] bg-[#efddbb] text-[#6f4b21]";
const HOME_TOP_LIGHT_HOVER = "hover:border-[#c59451] hover:bg-[#f1e1c4]";
const HOME_DOCK_DARK = "border-[#d7b481]/36 bg-[#2f5873]/96 text-white shadow-[0_12px_28px_rgba(10,34,56,0.28)]";
const HOME_DOCK_DARK_ACTIVE = "border-[#edd6b0]/42 bg-[#3b6784]/98";
const HOME_DOCK_DARK_HOVER = "hover:border-[#edd6b0]/42 hover:bg-[#37627e]/98";
const HOME_DOCK_LIGHT = "border-[#d6b37d]/45 bg-[#f6ead6] text-[#855f31] shadow-[0_12px_26px_rgba(135,100,53,0.14)]";
const HOME_DOCK_LIGHT_ACTIVE = "border-[#c59451] bg-[#efddbb] text-[#6f4b21]";
const HOME_DOCK_LIGHT_HOVER = "hover:border-[#c59451] hover:bg-[#f1e1c4]";
const HOME_MOBILE = "border border-[#d7b481]/38 bg-[#355f7b]/94 text-white shadow-[0_12px_24px_rgba(7,27,42,0.22)]";
const HOME_MOBILE_ACTIVE = "ring-1 ring-[#edd6b0]/28";
const HOME_MOBILE_HOVER = "hover:bg-[#3b6784]/96";

function resolveAssetSrc(value: string | null | undefined, fallback: string) {
  const raw = value?.trim() ? value.trim() : fallback;

  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:")) {
    return raw;
  }

  const normalized = raw
    .replaceAll("\\", "/")
    .replace(/^\.?\/?public\//i, "");
  const lower = normalized.toLowerCase();

  if (
    lower.endsWith("/logo-hotel.png") ||
    lower === "logo-hotel.png" ||
    lower.endsWith("/logo%20hotel.png") ||
    lower === "logo%20hotel.png" ||
    lower.endsWith("/logo hotel.png") ||
    lower === "logo hotel.png"
  ) {
    return DEFAULT_LOGO_SRC;
  }

  const withSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return encodeURI(withSlash);
}

function getTopNavItemClasses(isDark: boolean, isActive: boolean, isHomeItem: boolean) {
  if (isHomeItem) {
    return isDark
      ? cn(
          HOME_TOP_DARK,
          isActive ? HOME_TOP_DARK_ACTIVE : HOME_TOP_DARK_HOVER,
        )
      : cn(
          HOME_TOP_LIGHT,
          isActive ? HOME_TOP_LIGHT_ACTIVE : HOME_TOP_LIGHT_HOVER,
        );
  }

  return isDark
    ? cn(
        "border border-white/15 bg-slate-950/18 shadow-[0_8px_22px_rgba(4,18,32,0.22)]",
        isActive
          ? "border-white/24 bg-white/16"
          : "hover:border-white/24 hover:bg-white/12",
      )
    : cn(
        "border border-slate-300/75 bg-white/76 text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.12)]",
        isActive
          ? "border-brand/40 bg-brand/12 text-brand"
          : "hover:border-brand/30 hover:bg-white",
      );
}

function getDockItemClasses(
  useDockDarkTone: boolean,
  useInternalDockDarkTone: boolean,
  isActive: boolean,
  isHomeItem: boolean,
) {
  if (isHomeItem) {
    return useDockDarkTone
      ? cn(
          HOME_DOCK_DARK,
          isActive ? HOME_DOCK_DARK_ACTIVE : HOME_DOCK_DARK_HOVER,
        )
      : cn(
          HOME_DOCK_LIGHT,
          isActive ? HOME_DOCK_LIGHT_ACTIVE : HOME_DOCK_LIGHT_HOVER,
        );
  }

  if (useDockDarkTone) {
    return useInternalDockDarkTone
      ? cn(
          "border border-white/10 bg-white/7 text-white/92",
          isActive
            ? "border-[#4f9bce]/55 bg-[#0d4f7d]/88 text-white shadow-[0_10px_24px_rgba(6,45,71,0.34)]"
            : "hover:border-white/18 hover:bg-white/12",
        )
      : cn(
          "border border-white/12 bg-white/6",
          isActive
            ? "border-white/24 bg-white/16"
            : "hover:border-white/24 hover:bg-white/12",
        );
  }

  return cn(
    "border border-slate-300/75 bg-white/66",
    isActive
      ? "border-brand/40 bg-brand/12 text-brand"
      : "hover:border-brand/30 hover:bg-white",
  );
}

function getMobileItemClasses(isActive: boolean, isHomeItem: boolean) {
  if (isHomeItem) {
    return cn(
      HOME_MOBILE,
      isActive ? HOME_MOBILE_ACTIVE : HOME_MOBILE_HOVER,
    );
  }

  return isActive ? "bg-white/12" : "hover:bg-white/8";
}

function writeTranslateCookie(code: string) {
  const value = code === "pt" ? "" : `/pt/${code}`;
  const maxAge = code === "pt" ? "0" : "31536000";
  const hostname = window.location.hostname;
  const domains = [hostname, `.${hostname}`];
  const cookieBase = `googtrans=${value};path=/;max-age=${maxAge};SameSite=Lax`;

  window.document.cookie = cookieBase;

  domains.forEach((domain) => {
    window.document.cookie = `googtrans=${value};domain=${domain};path=/;max-age=${maxAge};SameSite=Lax`;
  });
}

export function FloatingNav({ hotelName, logo }: FloatingNavProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [open, setOpen] = useState(false);
  const [isDockedLeft, setIsDockedLeft] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [useDockDarkTone, setUseDockDarkTone] = useState(true);
  const [logoSrc, setLogoSrc] = useState(() => resolveAssetSrc(logo, DEFAULT_LOGO_SRC));
  const [selectedLanguage, setSelectedLanguage] = useState("pt");

  useEffect(() => {
    setLogoSrc(resolveAssetSrc(logo, DEFAULT_LOGO_SRC));
  }, [logo]);

  useEffect(() => {
    function getDockDarkBoundary() {
      const anchor = document.querySelector<HTMLElement>("[data-floating-nav-theme='dark']");

      if (!anchor) {
        return TOP_ONLY_THRESHOLD;
      }

      const rect = anchor.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const absoluteBottom = absoluteTop + rect.height;

      return Math.max(TOP_ONLY_THRESHOLD, absoluteBottom - DOCK_THEME_OFFSET);
    }

    function syncDockState() {
      const y = window.scrollY;
      setScrollY(y);
      setIsDockedLeft(y > TOP_ONLY_THRESHOLD);
      setUseDockDarkTone(isHomePage ? y < getDockDarkBoundary() : true);
    }

    syncDockState();
    window.addEventListener("scroll", syncDockState, { passive: true });
    window.addEventListener("resize", syncDockState);

    return () => {
      window.removeEventListener("scroll", syncDockState);
      window.removeEventListener("resize", syncDockState);
    };
  }, [isHomePage, pathname]);

  useEffect(() => {
    const translatedLanguage = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("googtrans="))
      ?.split("/")
      .at(-1);

    if (translatedLanguage === "en" || translatedLanguage === "es") {
      setSelectedLanguage(translatedLanguage);
    }

    if (!document.getElementById("google-translate-element")) {
      const element = document.createElement("div");
      element.id = "google-translate-element";
      element.className = "pointer-events-none fixed -left-[9999px] -top-[9999px] h-0 w-0 overflow-hidden";
      document.body.appendChild(element);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "pt",
          includedLanguages: "pt,en,es",
          autoDisplay: false,
        },
        "google-translate-element",
      );
    };

    if (!document.querySelector("script[data-google-translate='true']")) {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.dataset.googleTranslate = "true";
      document.body.appendChild(script);
    } else {
      window.googleTranslateElementInit();
    }
  }, []);

  const useTopDarkTone = scrollY <= TOP_ONLY_THRESHOLD;
  const useInternalDockDarkTone = !isHomePage;

  function handleLanguageChange(code: string) {
    setSelectedLanguage(code);
    writeTranslateCookie(code);

    if (code === "pt") {
      window.location.reload();
      return;
    }

    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");

    if (!combo) {
      window.location.reload();
      return;
    }

    combo.value = code;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-6 pt-4 md:flex md:justify-center md:px-6">
        <div
          className={cn(
            "flex w-full items-center justify-between transition-all duration-500 md:inline-flex md:w-auto md:justify-center md:gap-8",
            useTopDarkTone ? "text-white" : "text-slate-700",
            isDockedLeft
              ? "pointer-events-none -translate-y-6 scale-95 opacity-0"
              : "translate-y-0 scale-100 opacity-100",
          )}
        >
          <Link href="/" className="flex min-w-0 shrink-0 items-center">
            <img
              src={logoSrc}
              alt={hotelName}
              className="h-9 w-auto max-w-[168px] object-contain drop-shadow-[0_10px_18px_rgba(2,14,26,0.5)] md:h-11 md:max-w-[240px]"
              onError={() => setLogoSrc(DEFAULT_LOGO_SRC)}
            />
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isHomeItem = Boolean(item.special);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex h-11 items-center rounded-full px-4 backdrop-blur-xl transition-all duration-300",
                    getTopNavItemClasses(useTopDarkTone, isActive, isHomeItem),
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold uppercase tracking-[0.22em] opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-40 group-hover:opacity-100">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div
            className={cn(
              "hidden h-9 items-center gap-0.5 rounded-full border p-0.5 backdrop-blur-xl transition-all duration-300 md:flex",
              useTopDarkTone
                ? "border-white/14 bg-slate-950/18 text-white shadow-[0_8px_22px_rgba(4,18,32,0.18)]"
                : "border-slate-300/75 bg-white/76 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.1)]",
            )}
            aria-label="Selecionar idioma"
          >
            {languageOptions.map((language) => {
              const isActive = language.code === selectedLanguage;

              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => handleLanguageChange(language.code)}
                  className={cn(
                    "h-8 rounded-full px-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] transition-all duration-300",
                    isActive
                      ? useTopDarkTone
                        ? "bg-white/18 text-white"
                        : "bg-brand/10 text-brand"
                      : useTopDarkTone
                        ? "text-white/62 hover:bg-white/10 hover:text-white"
                        : "text-slate-500 hover:bg-white hover:text-brand",
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  {language.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className={cn(
              "mr-1 ml-5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full backdrop-blur-xl md:hidden",
              useTopDarkTone
                ? "border border-white/20 bg-slate-950/22 shadow-[0_8px_22px_rgba(4,18,32,0.22)]"
                : "border border-slate-300/75 bg-white/76 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.12)]",
            )}
            onClick={() => setOpen((current) => !current)}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <aside
        className={cn(
          "nav-left-dock pointer-events-none fixed inset-y-0 left-4 z-50 hidden items-center py-4 md:flex",
          isDockedLeft ? "is-visible" : null,
        )}
      >
        <nav
          className={cn(
            "flex flex-col gap-2 overflow-visible rounded-[1.8rem] p-2 backdrop-blur-2xl transition-all duration-300",
            useDockDarkTone
              ? useInternalDockDarkTone
                ? "border border-slate-950/75 bg-slate-950/72 text-white shadow-[0_22px_46px_rgba(2,14,26,0.34)]"
                : "border border-white/16 bg-slate-950/20 text-white shadow-[0_18px_42px_rgba(4,18,32,0.26)]"
              : "border border-slate-300/75 bg-white/78 text-slate-700 shadow-[0_22px_42px_rgba(15,23,42,0.16)]",
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isHomeItem = Boolean(item.special);

            return (
              <Link
                key={`dock-${item.href}`}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  "group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300",
                  getDockItemClasses(useDockDarkTone, useInternalDockDarkTone, isActive, isHomeItem),
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1/2 -translate-y-1/2 -translate-x-2 rounded-full border border-slate-900/20 bg-slate-950/88 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white opacity-0 shadow-[0_10px_24px_rgba(4,18,32,0.24)] backdrop-blur-xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {open ? (
        <div className="fixed left-6 top-[5.25rem] z-40 w-[min(20.75rem,calc(100vw-4.75rem))] rounded-[2rem] border border-white/15 bg-slate-950/88 p-4 text-white shadow-2xl backdrop-blur-2xl md:hidden">
          <nav className="grid gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isHomeItem = Boolean(item.special);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-[1.35rem] px-4 py-2.5 text-[0.92rem] font-medium",
                    getMobileItemClasses(pathname === item.href, isHomeItem),
                  )}
                >
                  <Icon className="h-[15px] w-[15px]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-white/5 px-3.5 py-3.5">
            <p className="px-1 pb-2 text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-white/40">
              Idioma
            </p>
            <div className="flex items-center gap-1.5">
              {languageOptions.map((language) => {
                const isActive = language.code === selectedLanguage;

                return (
                  <button
                    key={`mobile-${language.code}`}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      handleLanguageChange(language.code);
                    }}
                    className={cn(
                      "flex h-8 min-w-[3.05rem] items-center justify-center rounded-full px-2 text-center text-[0.6rem] font-semibold uppercase tracking-[0.12em] transition",
                      isActive
                        ? "bg-white text-brand"
                        : "bg-white/8 text-white/70 hover:bg-white/14 hover:text-white",
                    )}
                  >
                    {language.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
