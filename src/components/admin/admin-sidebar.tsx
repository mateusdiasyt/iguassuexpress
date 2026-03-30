import {
  BedDouble,
  BookOpenText,
  BriefcaseBusiness,
  FileCog,
  House,
  Images,
  LayoutDashboard,
  MapPinned,
  MessageCircleQuestion,
  PhoneCall,
  Settings,
  UtensilsCrossed,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/paginas", label: "Paginas", icon: House },
  { href: "/admin/quartos", label: "Quartos", icon: BedDouble },
  { href: "/admin/restaurante", label: "Restaurante", icon: UtensilsCrossed },
  { href: "/admin/galeria", label: "Personalizacao", icon: Images },
  { href: "/admin/tour-360", label: "Tour 360", icon: Video },
  { href: "/admin/localizacao", label: "Localizacao", icon: MapPinned },
  { href: "/admin/contato", label: "Contato", icon: PhoneCall },
  { href: "/admin/blog", label: "Blog", icon: BookOpenText },
  { href: "/admin/faq", label: "FAQ", icon: MessageCircleQuestion },
  { href: "/admin/trabalhe-conosco", label: "Carreiras", icon: BriefcaseBusiness },
  { href: "/admin/seo", label: "SEO", icon: FileCog },
  { href: "/admin/configuracoes", label: "Configuracoes", icon: Settings },
];

type AdminSidebarProps = {
  pathname: string;
};

export function AdminSidebar({ pathname }: AdminSidebarProps) {
  return (
    <aside className="rounded-[2rem] border border-brand/10 bg-white p-3 shadow-sm">
      <Link
        href="/"
        aria-label="Voltar ao site"
        className="group/site relative flex items-center gap-3 rounded-[1.25rem] px-2 py-2 text-slate-700 lg:justify-center"
      >
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-deep shadow-sm">
          <Image
            src="/favicon-hotel.png"
            alt="Iguassu Express favicon"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
            priority
          />
        </span>
        <div className="lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Iguassu Express
          </p>
          <p className="text-sm text-slate-700">Voltar ao site</p>
        </div>
        <span className="pointer-events-none hidden whitespace-nowrap rounded-xl border border-brand/20 bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-sm transition lg:absolute lg:left-full lg:top-1/2 lg:ml-3 lg:block lg:-translate-y-1/2 lg:translate-x-1 lg:opacity-0 lg:group-hover/site:translate-x-0 lg:group-hover/site:opacity-100">
          Voltar ao site
        </span>
      </Link>

      <nav className="mt-5 grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "group/item relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition lg:justify-center lg:px-0",
                pathname === item.href
                  ? "bg-brand text-white"
                  : "text-slate-600 hover:bg-brand/5 hover:text-brand",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="lg:hidden">{item.label}</span>
              <span className="pointer-events-none hidden whitespace-nowrap rounded-xl border border-brand/20 bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-sm transition lg:absolute lg:left-full lg:top-1/2 lg:ml-3 lg:block lg:-translate-y-1/2 lg:translate-x-1 lg:opacity-0 lg:group-hover/item:translate-x-0 lg:group-hover/item:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
