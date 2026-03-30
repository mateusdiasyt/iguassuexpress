import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ImageIcon, type LucideIcon, UtensilsCrossed } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { GalleryImageEditorCard } from "@/components/admin/personalization/gallery-image-editor-card";
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
  href: string;
  actionLabel: string;
  icon: LucideIcon;
  children?: ReactNode;
};

function PreviewFrame({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-[1.2rem] border border-dashed border-slate-200 bg-slate-100 text-xs text-slate-400",
          className,
        )}
      >
        Sem imagem
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.2rem] border border-slate-200/80 bg-slate-100",
        className,
      )}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 360px" />
    </div>
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
  href,
  actionLabel,
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

      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
      >
        {actionLabel}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}

function GalleryBannerReference({ page }: { page: PageContentItem }) {
  return (
    <ReferenceCard
      eyebrow="Banner"
      title="Banner da galeria"
      href="/admin/paginas"
      actionLabel="Paginas"
      icon={ImageIcon}
    >
      <PreviewFrame src={page.bannerImage} alt={`Banner da pagina ${page.title}`} className="h-32 w-full" />
    </ReferenceCard>
  );
}

function RestaurantReference({ restaurant }: { restaurant: RestaurantContentItem }) {
  const images = restaurant.images.filter(Boolean).slice(0, 3);

  return (
    <ReferenceCard
      eyebrow="Restaurante"
      title="3 imagens"
      href="/admin/restaurante"
      actionLabel="Restaurante"
      icon={UtensilsCrossed}
    >
      <div className="grid grid-cols-3 gap-2">
        {images.length ? (
          images.map((src, index) => (
            <PreviewFrame
              key={`${src}-${index}`}
              src={src}
              alt={`Imagem ${index + 1} do restaurante`}
              className="h-24 w-full"
            />
          ))
        ) : (
          <PreviewFrame alt="Sem imagens do restaurante" className="col-span-3 h-24 w-full" />
        )}
      </div>
    </ReferenceCard>
  );
}

export default async function AdminGalleryPage() {
  const session = await requireAdmin();
  const [galleryPage, restaurant, images] = await Promise.all([
    getPageContent("gallery"),
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
          </div>

          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
            {images.length} {images.length === 1 ? "item" : "itens"}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <GalleryBannerReference page={galleryPage} />
          <RestaurantReference restaurant={restaurant} />
        </div>

        <section className="space-y-4">
          {images.length ? (
            <div className="grid gap-5">
              {images.map((image) => (
                <GalleryImageEditorCard key={image.id} image={image} />
              ))}
            </div>
          ) : (
            <section className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
              <h2 className="text-lg font-semibold text-slate-950">Nenhuma foto cadastrada</h2>
            </section>
          )}
        </section>
      </section>
    </AdminShell>
  );
}
