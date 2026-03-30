import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ImageIcon,
  Trash2,
  type LucideIcon,
  UtensilsCrossed,
} from "lucide-react";
import { deleteGalleryImageAction, saveGalleryImageAction } from "@/actions/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadField } from "@/components/admin/upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
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

type GalleryImageItem = Awaited<ReturnType<typeof getGalleryImages>>[number];
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

type FieldBlockProps = {
  label: string;
  children: ReactNode;
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

function FieldBlock({ label, children }: FieldBlockProps) {
  return (
    <label className="grid gap-2 text-sm text-slate-600">
      <span className="font-medium text-slate-950">{label}</span>
      {children}
    </label>
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

function InlineVisibilityToggle({
  name,
  defaultChecked = true,
  form,
}: {
  name: string;
  defaultChecked?: boolean;
  form?: string;
}) {
  return (
    <label
      aria-label="Exibir na galeria publica"
      title="Exibir na galeria publica"
      className="relative inline-flex h-8 w-[3.3rem] shrink-0 cursor-pointer items-center"
    >
      <input
        type="checkbox"
        name={name}
        form={form}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="absolute inset-0 rounded-full border border-slate-200 bg-slate-200/90 transition peer-checked:border-slate-900 peer-checked:bg-slate-900" />
      <span
        aria-hidden="true"
        className="absolute left-1 top-1 h-6 w-6 rounded-full border border-white/90 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.16)] transition-transform duration-200 ease-out peer-checked:translate-x-[1.35rem]"
      />
    </label>
  );
}

function VisibilityRow({
  name,
  defaultChecked = true,
}: {
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-slate-50/90 px-4 py-3">
      <span className="text-sm font-medium text-slate-950">Publicar</span>
      <InlineVisibilityToggle name={name} defaultChecked={defaultChecked} />
    </div>
  );
}

function ExistingImageCard({ image }: { image: GalleryImageItem }) {
  const formId = `gallery-image-${image.id}`;
  const deleteFormId = `delete-gallery-image-${image.id}`;

  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
      <div className="grid gap-0 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="border-b border-slate-200/80 bg-slate-50/70 p-4 xl:border-b-0 xl:border-r">
          <PreviewFrame src={image.imageUrl} alt={image.altText} className="min-h-[220px] w-full" />
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {image.category}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Ordem {image.order}
                </span>
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">
                {image.altText}
              </h3>
            </div>

            <InlineVisibilityToggle name="isActive" defaultChecked={image.isActive} form={formId} />
          </div>

          <form id={formId} action={saveGalleryImageAction} className="mt-6 grid gap-5">
            <input type="hidden" name="id" value={image.id} />

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_8rem]">
              <FieldBlock label="Categoria">
                <Input name="category" defaultValue={image.category} />
              </FieldBlock>

              <FieldBlock label="Ordem">
                <Input name="order" type="number" defaultValue={image.order} />
              </FieldBlock>
            </div>

            <FieldBlock label="Descricao da imagem">
              <Input name="altText" defaultValue={image.altText} />
            </FieldBlock>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="max-w-sm">
                <UploadField
                  name="imageUrl"
                  label="Atualizar arquivo"
                  defaultValue={image.imageUrl}
                  hideTextInput
                  hidePreview
                  className="space-y-2"
                />
              </div>

              <div className="flex items-center justify-between gap-3 lg:min-w-[9.5rem] lg:justify-end">
                <SubmitButton
                  form={formId}
                  className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm"
                >
                  Salvar
                </SubmitButton>

                <Button
                  type="submit"
                  form={deleteFormId}
                  variant="outline"
                  className="h-10 w-10 border-slate-200 p-0 text-red-600 normal-case tracking-normal hover:bg-red-50 hover:text-red-700"
                  aria-label={`Remover foto ${image.altText}`}
                  title="Remover foto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>

          <form id={deleteFormId} action={deleteGalleryImageAction}>
            <input type="hidden" name="id" value={image.id} />
          </form>
        </div>
      </div>
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
  const nextOrder = images.length ? Math.max(...images.map((image) => image.order)) + 1 : 1;

  return (
    <AdminShell
      title="Personalizacao"
      description="Galeria institucional e referencias visuais."
      pathname="/admin/galeria"
      userName={session.user.name}
    >
      <div className="mx-auto grid max-w-[1180px] gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
        <aside className="xl:sticky xl:top-6">
          <section className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.92)_100%)] p-5 shadow-[0_28px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <SectionEyebrow>Referencias</SectionEyebrow>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Personalizacao
            </h1>

            <div className="mt-5 grid gap-4">
              <GalleryBannerReference page={galleryPage} />
              <RestaurantReference restaurant={restaurant} />
            </div>
          </section>
        </aside>

        <section className="space-y-5">
          <section className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.94)_100%)] p-5 shadow-[0_28px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionEyebrow>Nova foto</SectionEyebrow>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  Adicionar a galeria
                </h2>
              </div>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
                /galeria-de-fotos
              </span>
            </div>

            <form action={saveGalleryImageAction} className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
              <UploadField
                name="imageUrl"
                label="Arquivo da foto"
                hideTextInput
                className="space-y-3"
                previewClassName="h-[18rem] rounded-[1.35rem] border border-slate-200/80 bg-slate-100"
              />

              <div className="grid content-start gap-5">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_8rem]">
                  <FieldBlock label="Categoria">
                    <Input name="category" placeholder="Ex.: Fachada" />
                  </FieldBlock>

                  <FieldBlock label="Ordem">
                    <Input name="order" type="number" defaultValue={nextOrder} />
                  </FieldBlock>
                </div>

                <FieldBlock label="Descricao da imagem">
                  <Input name="altText" placeholder="Ex.: Fachada principal do hotel" />
                </FieldBlock>

                <VisibilityRow name="isActive" defaultChecked />

                <div className="flex items-center gap-3">
                  <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
                    Adicionar
                  </SubmitButton>
                </div>
              </div>
            </form>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionEyebrow>Galeria institucional</SectionEyebrow>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  Fotos da pagina
                </h2>
              </div>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
                {images.length} {images.length === 1 ? "item" : "itens"}
              </span>
            </div>

            {images.length ? (
              <div className="grid gap-5">
                {images.map((image) => (
                  <ExistingImageCard key={image.id} image={image} />
                ))}
              </div>
            ) : (
              <section className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
                <h2 className="text-lg font-semibold text-slate-950">Nenhuma foto cadastrada</h2>
              </section>
            )}
          </section>
        </section>
      </div>
    </AdminShell>
  );
}
