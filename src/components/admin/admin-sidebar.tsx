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
import Link from "next/link";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/paginas", label: "Paginas", icon: House },
  { href: "/admin/quartos", label: "Quartos", icon: BedDouble },
  { href: "/admin/restaurante", label: "Restaurante", icon: UtensilsCrossed },
  { href: "/admin/galeria", label: "Galeria", icon: Images },
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
    <aside className="rounded-[2rem] border border-brand/10 bg-white p-4 shadow-sm">
      <Link href="/" className="flex items-center gap-3 rounded-[1.5rem] bg-brand-deep px-4 py-4 text-white">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 font-semibold">
          IE
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/65">
            Iguassu Express
          </p>
          <p className="text-sm text-white/80">Voltar ao site</p>
        </div>
      </Link>

      <nav className="mt-5 grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                pathname === item.href
                  ? "bg-brand text-white"
                  : "text-slate-600 hover:bg-brand/5 hover:text-brand",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
