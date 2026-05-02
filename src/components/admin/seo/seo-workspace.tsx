"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  BedDouble,
  BriefcaseBusiness,
  Building2,
  Globe2,
  Home,
  ImageIcon,
  MapPinned,
  Newspaper,
  Pencil,
  Phone,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { savePageSeoAction, saveSiteSeoAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type SiteSeoSettings = {
  hotelName: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

type PageSeoItem = {
  key: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
};

type SeoWorkspaceProps = {
  settings: SiteSeoSettings;
  pages: PageSeoItem[];
};

const pageMeta = {
  home: {
    label: "Home",
    path: "/",
    icon: Home,
    tint: "from-brand/10 via-brand/5 to-transparent",
  },
  apartments: {
    label: "Apartamentos",
    path: "/apartamentos",
    icon: BedDouble,
    tint: "from-sky-500/10 via-sky-500/5 to-transparent",
  },
  restaurant: {
    label: "Restaurante",
    path: "/restaurante",
    icon: UtensilsCrossed,
    tint: "from-amber-500/10 via-amber-500/5 to-transparent",
  },
  gallery: {
    label: "Galeria",
    path: "/galeria-de-fotos",
    icon: ImageIcon,
    tint: "from-violet-500/10 via-violet-500/5 to-transparent",
  },
  "tour-360": {
    label: "Tour 360",
    path: "/tour-360",
    icon: Sparkles,
    tint: "from-cyan-500/10 via-cyan-500/5 to-transparent",
  },
  location: {
    label: "Localização",
    path: "/localizacao",
    icon: MapPinned,
    tint: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  },
  about: {
    label: "Sobre o hotel",
    path: "/sobre-o-hotel",
    icon: Building2,
    tint: "from-slate-500/10 via-slate-500/5 to-transparent",
  },
  contact: {
    label: "Contato",
    path: "/contato",
    icon: Phone,
    tint: "from-brand/10 via-brand/5 to-transparent",
  },
  blog: {
    label: "Blog",
    path: "/blog",
    icon: Newspaper,
    tint: "from-indigo-500/10 via-indigo-500/5 to-transparent",
  },
  careers: {
    label: "Carreiras",
    path: "/trabalhe-conosco",
    icon: BriefcaseBusiness,
    tint: "from-rose-500/10 via-rose-500/5 to-transparent",
  },
} as const;

function summarize(value?: string | null, fallback = "Sem conteúdo definido") {
  const trimmed = value?.trim();

  if (!trimmed) {
    return fallback;
  }

  return trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
}

function SeoModalShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[120] bg-slate-950/56 backdrop-blur-md" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-[130] w-[calc(100vw-1.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_36px_120px_rgba(15,23,42,0.2)] backdrop-blur-xl">
        <div className="border-b border-slate-200/80 px-5 py-5 md:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
                {eyebrow}
              </p>
              <div className="space-y-1">
                <Dialog.Title className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {title}
                </Dialog.Title>
                {subtitle ? (
                  <Dialog.Description className="text-sm leading-6 text-slate-500">
                    {subtitle}
                  </Dialog.Description>
                ) : null}
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-brand/20 hover:text-brand"
                aria-label="Fechar editor de SEO"
              >
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>
        </div>

        <div className="max-h-[calc(100vh-11rem)] overflow-y-auto px-5 py-5 md:px-6 md:py-6">
          {children}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function SeoSummary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.3rem] border border-slate-200/80 bg-slate-50/85 px-4 py-3">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function SiteSeoCard({ settings }: { settings: SiteSeoSettings }) {
  return (
    <Dialog.Root>
      <section className="relative overflow-hidden rounded-[2rem] border border-brand/10 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(30,94,154,0.08),transparent_45%)]" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex size-14 items-center justify-center rounded-[1.4rem] bg-brand/10 text-brand shadow-inner shadow-white/60">
              <Globe2 className="size-6" />
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Site
                </p>
                <h2 className="text-[1.7rem] font-semibold tracking-[-0.04em] text-slate-950">
                  SEO global
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-brand/10 bg-brand/5 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand">
                  {settings.hotelName}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Site inteiro
                </span>
              </div>
            </div>
          </div>

          <Dialog.Trigger asChild>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brand/20 hover:text-brand"
              aria-label="Editar SEO global"
            >
              <Pencil className="size-4.5" />
            </button>
          </Dialog.Trigger>
        </div>

        <div className="relative mt-6 grid gap-3 md:grid-cols-2">
          <SeoSummary
            label="SEO title"
            value={summarize(settings.seoTitle, "Usando título padrão do site")}
          />
          <SeoSummary
            label="Meta description"
            value={summarize(settings.seoDescription, "Sem descrição global definida")}
          />
        </div>
      </section>

      <SeoModalShell
        eyebrow="SEO global"
        title="SEO do site"
        subtitle="Título e descrição que ajudam a leitura geral da marca nos buscadores."
      >
        <form action={saveSiteSeoAction} className="grid gap-5">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            SEO title
            <Input
              name="seoTitle"
              defaultValue={settings.seoTitle ?? ""}
              placeholder="Ex.: Iguassu Express Hotel | Hotel em Foz do Iguaçu"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Meta description
            <Textarea
              name="seoDescription"
              defaultValue={settings.seoDescription ?? ""}
              placeholder="Resumo curto do hotel para resultados de busca."
              className="min-h-36"
            />
          </label>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200/80 pt-5">
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-5 normal-case tracking-normal"
              >
                Fechar
              </Button>
            </Dialog.Close>
            <SubmitButton className="rounded-full px-6 normal-case tracking-normal">
              Salvar SEO global
            </SubmitButton>
          </div>
        </form>
      </SeoModalShell>
    </Dialog.Root>
  );
}

function PageSeoCard({ page }: { page: PageSeoItem }) {
  const meta = pageMeta[page.key as keyof typeof pageMeta] ?? {
    label: page.title,
    path: `/${page.key}`,
    icon: Globe2,
    tint: "from-slate-500/10 via-slate-500/5 to-transparent",
  };
  const Icon = meta.icon;

  return (
    <Dialog.Root>
      <section className="group relative overflow-hidden rounded-[1.9rem] border border-slate-200/80 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.055)] transition-transform duration-300 hover:-translate-y-0.5">
        <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90", meta.tint)} />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[1.2rem] bg-white/92 text-slate-700 shadow-sm ring-1 ring-slate-200/80">
              <Icon className="size-5" />
            </div>

            <div className="min-w-0 space-y-3">
              <div className="space-y-1">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Página
                </p>
                <h3 className="truncate text-xl font-semibold tracking-[-0.04em] text-slate-950">
                  {meta.label}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {meta.path}
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em]",
                    page.isPublished
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-amber-200 bg-amber-50 text-amber-700",
                  )}
                >
                  {page.isPublished ? "Indexável" : "Oculta"}
                </span>
              </div>
            </div>
          </div>

          <Dialog.Trigger asChild>
            <button
              type="button"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brand/20 hover:text-brand"
              aria-label={`Editar SEO da página ${meta.label}`}
            >
              <Pencil className="size-4.5" />
            </button>
          </Dialog.Trigger>
        </div>

        <div className="relative mt-5 grid gap-3">
          <SeoSummary
            label="SEO title"
            value={summarize(page.seoTitle, "Usando o título padrão da página")}
          />
          <SeoSummary
            label="Meta description"
            value={summarize(page.seoDescription, "Sem descrição personalizada")}
          />
        </div>
      </section>

      <SeoModalShell
        eyebrow="SEO por página"
        title={meta.label}
        subtitle={meta.path}
      >
        <form action={savePageSeoAction} className="grid gap-5">
          <input type="hidden" name="key" value={page.key} />

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
              {meta.path}
            </span>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em]",
                page.isPublished
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-amber-200 bg-amber-50 text-amber-700",
              )}
            >
              {page.isPublished ? "Indexável" : "Oculta"}
            </span>
          </div>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            SEO title
            <Input
              name="seoTitle"
              defaultValue={page.seoTitle ?? ""}
              placeholder={`Ex.: ${meta.label} | Iguassu Express Hotel`}
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Meta description
            <Textarea
              name="seoDescription"
              defaultValue={page.seoDescription ?? ""}
              placeholder="Resumo curto desta página para os buscadores."
              className="min-h-36"
            />
          </label>

          <label className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-800">Indexar página</p>
              <p className="text-xs leading-5 text-slate-500">
                Mantém esta rota visível para leitura dos buscadores.
              </p>
            </div>

            <span className="relative inline-flex shrink-0">
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={page.isPublished}
                className="peer sr-only"
              />
              <span className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-brand/85" />
              <span className="pointer-events-none absolute left-1 top-1 size-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5" />
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200/80 pt-5">
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-5 normal-case tracking-normal"
              >
                Fechar
              </Button>
            </Dialog.Close>
            <SubmitButton className="rounded-full px-6 normal-case tracking-normal">
              Salvar SEO
            </SubmitButton>
          </div>
        </form>
      </SeoModalShell>
    </Dialog.Root>
  );
}

export function SeoWorkspace({ settings, pages }: SeoWorkspaceProps) {
  const indexedPages = pages.filter((page) => page.isPublished).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
            SEO
          </p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950">
            SEO por página
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
            {pages.length} páginas
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            {indexedPages} indexadas
          </span>
        </div>
      </div>

      <SiteSeoCard settings={settings} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pages.map((page) => (
          <PageSeoCard key={page.key} page={page} />
        ))}
      </div>
    </div>
  );
}
