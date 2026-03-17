"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  BookOpenText,
  BriefcaseBusiness,
  Compass,
  Images,
  MapPinned,
  Menu,
  Phone,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Compass },
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

export function FloatingNav({ hotelName, logo }: FloatingNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isDockedLeft, setIsDockedLeft] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [logoSrc, setLogoSrc] = useState(() => resolveAssetSrc(logo, DEFAULT_LOGO_SRC));

  useEffect(() => {
    setLogoSrc(resolveAssetSrc(logo, DEFAULT_LOGO_SRC));
  }, [logo]);

  useEffect(() => {
    function syncDockState() {
      const y = window.scrollY;
      setScrollY(y);
      setIsDockedLeft(y > 180);
    }

    syncDockState();
    window.addEventListener("scroll", syncDockState, { passive: true });

    return () => window.removeEventListener("scroll", syncDockState);
  }, []);

  const isHomePath = pathname === "/";
  const useHeroTopTone = isHomePath && scrollY < 180;
  const useHeroDockTone = isHomePath && scrollY < 560;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-6">
        <div
          className={cn(
            "inline-flex items-center gap-4 transition-all duration-500 md:gap-8",
            useHeroTopTone ? "text-white" : "text-slate-700",
            isDockedLeft
              ? "pointer-events-none -translate-y-6 scale-95 opacity-0"
              : "translate-y-0 scale-100 opacity-100",
          )}
        >
          <Link
            href="/"
            className={cn(
              "flex shrink-0 items-center rounded-full px-2.5 py-1.5 transition-all duration-300",
              useHeroTopTone
                ? "bg-transparent"
                : "border border-slate-300/70 bg-slate-950/74 shadow-[0_10px_24px_rgba(15,23,42,0.18)] backdrop-blur-xl",
            )}
          >
            <img
              src={logoSrc}
              alt={hotelName}
              className="h-10 w-auto max-w-[170px] object-contain md:h-11 md:max-w-[240px]"
              onError={() => setLogoSrc(DEFAULT_LOGO_SRC)}
            />
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex h-11 items-center rounded-full px-4 backdrop-blur-xl transition-all duration-300",
                    useHeroTopTone
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
                        ),
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
              useHeroTopTone
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
            "flex flex-col gap-2 overflow-hidden rounded-[1.8rem] p-2 backdrop-blur-2xl transition-all duration-300",
            useHeroDockTone
              ? "border border-white/16 bg-slate-950/20 text-white shadow-[0_18px_42px_rgba(4,18,32,0.26)]"
              : "border border-slate-300/75 bg-white/78 text-slate-700 shadow-[0_22px_42px_rgba(15,23,42,0.16)]",
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={`dock-${item.href}`}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  "group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300",
                  useHeroDockTone
                    ? cn(
                        "border border-white/12 bg-white/6",
                        isActive
                          ? "border-white/24 bg-white/16"
                          : "hover:border-white/24 hover:bg-white/12",
                      )
                    : cn(
                        "border border-slate-300/75 bg-white/66",
                        isActive
                          ? "border-brand/40 bg-brand/12 text-brand"
                          : "hover:border-brand/30 hover:bg-white",
                      ),
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

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium",
                    pathname === item.href ? "bg-white/12" : "hover:bg-white/8",
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
