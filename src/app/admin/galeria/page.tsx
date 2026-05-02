import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, ImageIcon, type LucideIcon, UtensilsCrossed } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  GalleryImageCreateCard,
  GalleryImageEditorCard,
} from "@/components/admin/personalization/gallery-image-editor-card";
import { getGalleryImages, getPageContent, getRestaurantContent } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Personalizacao Admin",
  description: "Galeria institucional e referencias visuais.",
  path: "/admin/galeria",
  noIndex: true,
});

type PageContentItem = Awaited<ReturnType<typeof getPageContent>>;
type RestaurantContentItem = Awaited<ReturnType<typeof getRestaurantContent>>;

type ReferenceCardProps = {
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  children?: ReactNode;
};

type ReferenceItemProps = {
  label: string;
  children: ReactNode;
};

function PreviewFrame({
  src,
  alt,
  className,
  href,
  actionLabel,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  href?: string;
  actionLabel?: string;
}) {
  const frame = src ? (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.2rem] border border-slate-200/80 bg-slate-100",
        className,
      )}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 360px" />
    </div>
  ) : (
    <div
      className={cn(
        "flex items-center justify-center rounded-[1.2rem] border border-dashed border-slate-200 bg-slate-100 text-xs text-slate-400",
        className,
      )}
    >
      Sem imagem
    </div>
  );

  if (!href) {
    return frame;
  }

  return (
    <Link href={href} className="group block">
      <div className="relative">
        {frame}
        <div className="absolute inset-0 flex items-center justify-center rounded-[1.2rem] bg-slate-950/0 opacity-0 transition duration-200 group-hover:bg-slate-950/28 group-hover:opacity-100">
          <span className="rounded-full bg-white/94 px-4 py-2 text-sm font-medium text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.16)] backdrop-blur-sm">
            {actionLabel ?? "Alterar imagem"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
      {children}
    </p>
  );
}

function ReferenceCard({
  eyebrow,
  title,
  icon: Icon,
  children,
}: ReferenceCardProps) {
  return (
    <article className="rounded-[1.6rem] border border-white/70 bg-white/88 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.07)] backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-1 text-base font-semibold text-slate-950">{title}</h2>
        </div>
      </div>

      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}

function ReferenceItem({ label, children }: ReferenceItemProps) {
  return (
    <section className="space-y-3 rounded-[1.35rem] border border-slate-200/80 bg-slate-50/60 p-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      {children}
    </section>
  );
}

function PageBannerReference({
  eyebrow,
  title,
  label,
  page,
  icon,
}: {
  eyebrow: string;
  title: string;
  label: string;
  page: PageContentItem;
  icon: LucideIcon;
}) {
  return (
    <ReferenceCard
      eyebrow={eyebrow}
      title={title}
      icon={icon}
    >
      <ReferenceItem label={label}>
        <PreviewFrame
          src={page.bannerImage}
          alt={`Banner da pagina ${page.title}`}
          href="/admin/paginas"
          actionLabel="Alterar imagem"
          className="h-32 w-full"
        />
      </ReferenceItem>
    </ReferenceCard>
  );
}

function RestaurantReference({ restaurant }: { restaurant: RestaurantContentItem }) {
  const images = restaurant.images.filter(Boolean).slice(0, 3);

  return (
    <ReferenceCard
      eyebrow="Coluna"
      title="Restaurante"
      icon={UtensilsCrossed}
    >
      <div className="space-y-3">
        <ReferenceItem label="Banner restaurante">
          <PreviewFrame
            src={restaurant.heroImage}
            alt="Banner do restaurante"
            href="/admin/restaurante"
            actionLabel="Alterar imagem"
            className="h-32 w-full"
          />
        </ReferenceItem>

        <ReferenceItem label="Imagens restaurante">
          <div className="grid grid-cols-3 gap-2">
            {images.length ? (
              images.map((src, index) => (
                <PreviewFrame
                  key={`${src}-${index}`}
                  src={src}
                  alt={`Imagem ${index + 1} do restaurante`}
                  href="/admin/restaurante"
                  actionLabel="Alterar imagem"
                  className="h-24 w-full"
                />
              ))
            ) : (
              <PreviewFrame
                alt="Sem imagens do restaurante"
                href="/admin/restaurante"
                actionLabel="Alterar imagem"
                className="col-span-3 h-24 w-full"
              />
            )}
          </div>
        </ReferenceItem>
      </div>
    </ReferenceCard>
  );
}

export default async function AdminGalleryPage() {
  const session = await requireAdmin();
  const [galleryPage, careersPage, restaurant, images] = await Promise.all([
    getPageContent("gallery"),
    getPageContent("careers"),
    getRestaurantContent(),
    getGalleryImages(true),
  ]);

  return (
    <AdminShell
      title="Personalizacao"
      description="Galeria institucional e referencias visuais."
      pathname="/admin/galeria"
      userName={session.user.name}
    >
      <section className="mx-auto max-w-[1180px] space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionEyebrow>Personalizacao</SectionEyebrow>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Fotos principais do site
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Separe os banners das paginas e o acervo da galeria publica. Assim fica claro
              onde o visitante ve cada imagem.
            </p>
          </div>

          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
            {images.length} {images.length === 1 ? "item" : "itens"}
          </span>
        </div>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionEyebrow>Banners das paginas</SectionEyebrow>
              <h2 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.04em] text-slate-950">
                Referencias visuais
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-slate-500">
              Esses blocos mudam o topo das paginas e os destaques institucionais.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <PageBannerReference
              eyebrow="Pagina"
              title="Galeria de fotos"
              label="Banner da pagina"
              page={galleryPage}
              icon={ImageIcon}
            />
            <PageBannerReference
              eyebrow="Pagina"
              title="Carreiras"
              label="Banner da pagina"
              page={careersPage}
              icon={BriefcaseBusiness}
            />
            <RestaurantReference restaurant={restaurant} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionEyebrow>Galeria publica</SectionEyebrow>
              <h2 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.04em] text-slate-950">
                Fotos da galeria
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-slate-500">
              Esse grid alimenta diretamente a pagina <span className="font-medium text-slate-700">/galeria-de-fotos</span>.
            </p>
          </div>

          {images.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <GalleryImageCreateCard
                nextOrder={(Math.max(0, ...images.map((image) => Number(image.order) || 0)) || 0) + 1}
              />
              {images.map((image) => (
                <GalleryImageEditorCard
                  key={`${image.id}-${image.altText}-${image.order}-${image.imageUrl ?? ""}`}
                  image={image}
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <GalleryImageCreateCard nextOrder={1} />
            </div>
          )}
        </section>
      </section>
    </AdminShell>
  );
}
