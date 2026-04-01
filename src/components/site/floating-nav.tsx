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

type FloatingNavProps = {
  hotelName: string;
  logo?: string | null;
};

const DEFAULT_LOGO_SRC = "/logo-hotel-principal.png";
const TOP_ONLY_THRESHOLD = 6;
const DOCK_THEME_OFFSET = 84;

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
          "border border-[#e5c894]/35 bg-[linear-gradient(135deg,rgba(212,177,126,0.28),rgba(18,63,97,0.34))] text-white shadow-[0_12px_30px_rgba(7,27,42,0.24)]",
          isActive
            ? "border-[#f1dbb4]/45 bg-[linear-gradient(135deg,rgba(229,200,148,0.34),rgba(18,63,97,0.48))]"
            : "hover:border-[#f1dbb4]/45 hover:bg-[linear-gradient(135deg,rgba(229,200,148,0.3),rgba(18,63,97,0.42))]",
        )
      : cn(
          "border border-[#d6b37d]/45 bg-[#f6ead6] text-[#855f31] shadow-[0_10px_24px_rgba(135,100,53,0.12)]",
          isActive
            ? "border-[#c59451] bg-[#efddbb] text-[#6f4b21]"
            : "hover:border-[#c59451] hover:bg-[#f1e1c4]",
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
          "border border-[#e5c894]/28 bg-[linear-gradient(180deg,rgba(229,200,148,0.24),rgba(13,79,125,0.54))] text-white shadow-[0_12px_28px_rgba(10,34,56,0.28)]",
          isActive
            ? "border-[#f1dbb4]/40 bg-[linear-gradient(180deg,rgba(229,200,148,0.34),rgba(13,79,125,0.76))]"
            : "hover:border-[#f1dbb4]/40 hover:bg-[linear-gradient(180deg,rgba(229,200,148,0.3),rgba(13,79,125,0.64))]",
        )
      : cn(
          "border border-[#d6b37d]/45 bg-[#f6ead6] text-[#855f31] shadow-[0_12px_26px_rgba(135,100,53,0.14)]",
          isActive
            ? "border-[#c59451] bg-[#efddbb] text-[#6f4b21]"
            : "hover:border-[#c59451] hover:bg-[#f1e1c4]",
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
      "bg-[linear-gradient(135deg,rgba(229,200,148,0.24),rgba(13,79,125,0.24))] text-white",
      isActive ? "ring-1 ring-[#f1dbb4]/25" : "hover:bg-[linear-gradient(135deg,rgba(229,200,148,0.3),rgba(13,79,125,0.3))]",
    );
  }

  return isActive ? "bg-white/12" : "hover:bg-white/8";
}

export function FloatingNav({ hotelName, logo }: FloatingNavProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [open, setOpen] = useState(false);
  const [isDockedLeft, setIsDockedLeft] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [useDockDarkTone, setUseDockDarkTone] = useState(true);
  const [logoSrc, setLogoSrc] = useState(() => resolveAssetSrc(logo, DEFAULT_LOGO_SRC));

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

  const useTopDarkTone = scrollY <= TOP_ONLY_THRESHOLD;
  const useInternalDockDarkTone = !isHomePage;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-6">
        <div
          className={cn(
            "inline-flex items-center gap-4 transition-all duration-500 md:gap-8",
            useTopDarkTone ? "text-white" : "text-slate-700",
            isDockedLeft
              ? "pointer-events-none -translate-y-6 scale-95 opacity-0"
              : "translate-y-0 scale-100 opacity-100",
          )}
        >
          <Link href="/" className="flex shrink-0 items-center">
            <img
              src={logoSrc}
              alt={hotelName}
              className="h-10 w-auto max-w-[170px] object-contain drop-shadow-[0_10px_18px_rgba(2,14,26,0.5)] md:h-11 md:max-w-[240px]"
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

          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-xl md:hidden",
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
        <div className="fixed inset-x-4 top-20 z-40 rounded-[2rem] border border-white/15 bg-slate-950/85 p-4 text-white shadow-2xl backdrop-blur-2xl md:hidden">
          <nav className="grid gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isHomeItem = Boolean(item.special);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium",
                    getMobileItemClasses(pathname === item.href, isHomeItem),
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </>
  );
}
