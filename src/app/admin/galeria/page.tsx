import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BedDouble,
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

type GuideCardProps = {
  eyebrow: string;
  title: string;
  description?: string;
  href: string;
  actionLabel: string;
  icon: LucideIcon;
  children?: ReactNode;
};

type FieldBlockProps = {
  label: string;
  description?: string;
  children: ReactNode;
};

function GuideCard({
  eyebrow,
  title,
  description,
  href,
  actionLabel,
  icon: Icon,
  children,
}: GuideCardProps) {
  return (
    <article className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-[0_24px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div className="space-y-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {eyebrow}
          </p>
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          {description ? <p className="text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
      </div>

      {children ? <div className="mt-4">{children}</div> : null}

      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
      >
        {actionLabel}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}

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
          "flex items-center justify-center rounded-[1.15rem] border border-dashed border-slate-200 bg-slate-100 text-xs text-slate-400",
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
        "relative overflow-hidden rounded-[1.15rem] border border-slate-200 bg-slate-100",
        className,
      )}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 320px" />
    </div>
  );
}

function FieldBlock({ label, description, children }: FieldBlockProps) {
  return (
    <label className="grid gap-2 text-sm text-slate-600">
      <span className="space-y-1">
        <span className="block font-medium text-slate-950">{label}</span>
        {description ? <span className="block text-xs leading-5 text-slate-500">{description}</span> : null}
      </span>
      {children}
    </label>
  );
}

function FieldPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
      {children}
    </div>
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
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center",
      )}
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
        className="absolute left-1 top-1 z-10 h-5 w-5 rounded-full border border-white/90 bg-white shadow-[0_3px_10px_rgba(15,23,42,0.14)] transition-transform duration-200 ease-out peer-checked:translate-x-5"
      />
    </label>
  );
}

function VisibilityToggleField({
  name,
  label,
  description,
  defaultChecked = true,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3">
      <div className="space-y-1">
        <span className="block text-sm font-medium text-slate-950">{label}</span>
        {description ? <span className="block text-xs leading-5 text-slate-500">{description}</span> : null}
      </div>

      <span className="relative inline-flex h-7 w-12 shrink-0 items-center">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full border border-slate-200 bg-slate-200/90 transition peer-checked:border-slate-900 peer-checked:bg-slate-900" />
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full border border-white/90 bg-white shadow-[0_3px_10px_rgba(15,23,42,0.14)] transition-transform duration-200 ease-out peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

function ExistingImageCard({ image }: { image: GalleryImageItem }) {
  const formId = `gallery-image-${image.id}`;

  return (
    <article className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_26px_60px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200 bg-slate-50/80 p-4">
        <PreviewFrame src={image.imageUrl} alt={image.altText} className="h-52 w-full" />
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {image.category}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Ordem {image.order}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-950">{image.altText}</h3>
          </div>

          <InlineVisibilityToggle name="isActive" defaultChecked={image.isActive} form={formId} />
        </div>

        <form id={formId} action={saveGalleryImageAction} className="grid gap-4">
          <input type="hidden" name="id" value={image.id} />

          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
            <FieldPanel>
              <FieldBlock label="Categoria">
                <Input name="category" defaultValue={image.category} />
              </FieldBlock>
            </FieldPanel>

            <FieldPanel>
              <FieldBlock label="Ordem">
                <Input name="order" type="number" defaultValue={image.order} />
              </FieldBlock>
            </FieldPanel>
          </div>

          <FieldPanel>
            <FieldBlock label="Descricao da imagem">
              <Input name="altText" defaultValue={image.altText} />
            </FieldBlock>
          </FieldPanel>

          <FieldPanel>
            <UploadField
              name="imageUrl"
              label="Atualizar arquivo"
              defaultValue={image.imageUrl}
              hideTextInput
              hidePreview
            />
          </FieldPanel>

          <div className="flex items-center justify-between gap-3">
            <SubmitButton
              form={formId}
              className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm"
            >
              Salvar
            </SubmitButton>

            <Button
              type="submit"
              form={`delete-gallery-image-${image.id}`}
              variant="outline"
              className="h-10 w-10 border-slate-200 p-0 text-red-600 normal-case tracking-normal hover:bg-red-50 hover:text-red-700"
              aria-label={`Remover foto ${image.altText}`}
              title="Remover foto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <form id={`delete-gallery-image-${image.id}`} action={deleteGalleryImageAction}>
          <input type="hidden" name="id" value={image.id} />
        </form>
      </div>
    </article>
  );
}

function RestaurantGuideCard({ restaurant }: { restaurant: RestaurantContentItem }) {
  const images = restaurant.images.filter(Boolean).slice(0, 3);

  return (
    <GuideCard
      eyebrow="Restaurante"
      title="3 imagens do restaurante"
      href="/admin/restaurante"
      actionLabel="Abrir Restaurante"
      icon={UtensilsCrossed}
    >
      <div className="grid grid-cols-3 gap-2">
        {images.length ? (
          images.map((src, index) => (
            <PreviewFrame
              key={`${src}-${index}`}
              src={src}
              alt={`Imagem ${index + 1} do restaurante`}
              className="h-28 w-full"
            />
          ))
        ) : (
          <PreviewFrame alt="Sem imagens do restaurante" className="col-span-3 h-28 w-full" />
        )}
      </div>
    </GuideCard>
  );
}

function GalleryBannerGuideCard({ page }: { page: PageContentItem }) {
  return (
    <GuideCard
      eyebrow="Banner"
      title="Banner da galeria"
      href="/admin/paginas"
      actionLabel="Abrir Paginas"
      icon={ImageIcon}
    >
      <PreviewFrame src={page.bannerImage} alt={`Banner da pagina ${page.title}`} className="h-36 w-full" />
    </GuideCard>
  );
}

function RoomsGuideCard() {
  return (
    <GuideCard
      eyebrow="Quartos"
      title="Imagens dos quartos"
      href="/admin/quartos"
      actionLabel="Abrir Quartos"
      icon={BedDouble}
    >
      <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-4">
        <p className="text-sm text-slate-600">Edite em Quartos.</p>
      </div>
    </GuideCard>
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
      description="Galeria institucional e referencias."
      pathname="/admin/galeria"
      userName={session.user.name}
    >
      <div className="mx-auto grid max-w-[1180px] gap-6 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
        <aside className="space-y-6">
          <section className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-[0_28px_60px_rgba(15,23,42,0.08)]">
            <div className="space-y-2">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Guia rapido
              </p>
              <h1 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                Onde cada imagem deve ser editada
              </h1>
            </div>

            <div className="mt-5 grid gap-4">
              <GalleryBannerGuideCard page={galleryPage} />
              <RestaurantGuideCard restaurant={restaurant} />
              <RoomsGuideCard />
            </div>
          </section>

          <section className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-[0_28px_60px_rgba(15,23,42,0.08)]">
            <div className="space-y-2">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Nova foto
              </p>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">
                Adicionar foto
              </h2>
            </div>

            <form action={saveGalleryImageAction} className="mt-5 grid gap-4">
              <FieldPanel>
                <FieldBlock label="Categoria">
                  <Input name="category" placeholder="Ex.: Fachada" />
                </FieldBlock>
              </FieldPanel>

              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
                <FieldPanel>
                  <FieldBlock label="Descricao da imagem">
                    <Input name="altText" placeholder="Ex.: Fachada principal do hotel" />
                  </FieldBlock>
                </FieldPanel>

                <FieldPanel>
                  <FieldBlock label="Ordem">
                    <Input name="order" type="number" defaultValue={nextOrder} />
                  </FieldBlock>
                </FieldPanel>
              </div>

              <FieldPanel>
                <UploadField
                  name="imageUrl"
                  label="Arquivo da foto"
                  hideTextInput
                  previewClassName="h-44 rounded-[1.1rem] border border-slate-200 bg-slate-100"
                />
              </FieldPanel>

              <FieldPanel>
                <VisibilityToggleField
                  name="isActive"
                  defaultChecked
                  label="Publicar"
                />
              </FieldPanel>

              <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
                Adicionar
              </SubmitButton>
            </form>
          </section>
        </aside>

        <section className="space-y-4">
          <div className="rounded-[1.9rem] border border-slate-200 bg-white p-5 shadow-[0_28px_60px_rgba(15,23,42,0.08)]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Galeria institucional
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Fotos exibidas em /galeria-de-fotos
            </h2>
          </div>

          {images.length ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {images.map((image) => (
                <ExistingImageCard key={image.id} image={image} />
              ))}
            </div>
          ) : (
            <section className="rounded-[1.9rem] border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
              <h2 className="text-lg font-semibold text-slate-950">Nenhuma foto cadastrada ainda</h2>
            </section>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
