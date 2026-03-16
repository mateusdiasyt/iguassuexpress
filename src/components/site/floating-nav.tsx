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
  const [logoSrc, setLogoSrc] = useState(() => resolveAssetSrc(logo, DEFAULT_LOGO_SRC));

  useEffect(() => {
    setLogoSrc(resolveAssetSrc(logo, DEFAULT_LOGO_SRC));
  }, [logo]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-6">
        <div className="inline-flex items-center gap-4 text-white md:gap-8">
          <Link href="/" className="flex shrink-0 items-center">
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
                    "group flex h-11 items-center rounded-full border border-white/15 bg-slate-950/18 px-4 shadow-[0_8px_22px_rgba(4,18,32,0.22)] backdrop-blur-xl transition-all duration-300",
                    isActive
                      ? "border-white/24 bg-white/16"
                      : "hover:border-white/24 hover:bg-white/12",
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-slate-950/22 shadow-[0_8px_22px_rgba(4,18,32,0.22)] backdrop-blur-xl md:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

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
