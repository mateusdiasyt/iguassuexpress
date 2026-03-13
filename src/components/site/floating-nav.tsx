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
  favicon?: string | null;
};

const DEFAULT_LOGO_SRC = "/logo-hotel.png";
const DEFAULT_FAVICON_SRC = "/favicon-hotel.png";

function resolveAssetSrc(value: string | null | undefined, fallback: string) {
  const raw = value?.trim() ? value.trim() : fallback;

  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:")) {
    return raw;
  }

  const normalized = raw
    .replaceAll("\\", "/")
    .replace(/^\.?\/?public\//i, "");
  const withSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return encodeURI(withSlash);
}

export function FloatingNav({ hotelName, logo, favicon }: FloatingNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState(() => resolveAssetSrc(logo, DEFAULT_LOGO_SRC));
  const [faviconSrc, setFaviconSrc] = useState(() =>
    resolveAssetSrc(favicon, DEFAULT_FAVICON_SRC),
  );

  useEffect(() => {
    setLogoSrc(resolveAssetSrc(logo, DEFAULT_LOGO_SRC));
  }, [logo]);

  useEffect(() => {
    setFaviconSrc(resolveAssetSrc(favicon, DEFAULT_FAVICON_SRC));
  }, [favicon]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/15 bg-slate-950/25 px-4 py-3 text-white shadow-2xl backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 text-sm font-semibold">
              <img
                src={faviconSrc}
                alt={`${hotelName} favicon`}
                className="h-6 w-6 object-contain"
                onError={() => setFaviconSrc(DEFAULT_FAVICON_SRC)}
              />
            </span>
            <span className="hidden md:block">
              <img
                src={logoSrc}
                alt={hotelName}
                className="h-8 w-auto object-contain"
                onError={() => setLogoSrc(DEFAULT_LOGO_SRC)}
              />
            </span>
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
                    "group flex h-11 items-center rounded-full border px-4 transition-all duration-300",
                    isActive
                      ? "border-white/20 bg-white/16"
                      : "border-transparent bg-transparent hover:border-white/15 hover:bg-white/10",
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 md:hidden"
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
