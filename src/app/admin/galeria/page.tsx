import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BedDouble,
  ImageIcon,
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
  description: "Central visual para banners, restaurante e galeria institucional.",
  path: "/admin/galeria",
  noIndex: true,
});

type GalleryImageItem = Awaited<ReturnType<typeof getGalleryImages>>[number];
type PageContentItem = Awaited<ReturnType<typeof getPageContent>>;
type RestaurantContentItem = Awaited<ReturnType<typeof getRestaurantContent>>;

type GuideCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  icon: LucideIcon;
  children: ReactNode;
};

type FieldBlockProps = {
  label: string;
  description: string;
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
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>

      <div className="mt-4">{children}</div>

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
        <span className="block text-xs leading-5 text-slate-500">{description}</span>
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

function ReadOnlyStatusToggle({ active }: { active: boolean }) {
  return (
    <span
      aria-label={active ? "Visivel" : "Oculta"}
      title={active ? "Visivel na pagina publica" : "Oculta na pagina publica"}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border p-1",
        active
          ? "border-slate-900 bg-slate-900 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)]"
          : "border-slate-200 bg-slate-200/90 shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative z-10 h-5 w-5 rounded-full border border-white/90 bg-white shadow-[0_3px_10px_rgba(15,23,42,0.14)] transition-transform duration-200 ease-out",
          active ? "translate-x-5" : "translate-x-0",
        )}
      />
    </span>
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
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3">
      <div className="space-y-1">
        <span className="block text-sm font-medium text-slate-950">{label}</span>
        <span className="block text-xs leading-5 text-slate-500">{description}</span>
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
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Esta foto aparece na grade publica de <span className="font-medium text-slate-900">/galeria-de-fotos</span>.
              Use aqui imagens institucionais do hotel. Fotos especificas de quartos ficam na aba <span className="font-medium text-slate-900">Quartos</span>.
            </p>
          </div>

          <ReadOnlyStatusToggle active={image.isActive} />
        </div>

        <form action={saveGalleryImageAction} className="grid gap-4">
          <input type="hidden" name="id" value={image.id} />

          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
            <FieldPanel>
              <FieldBlock
                label="Categoria"
                description="Agrupe por tema. Ex.: Fachada, Restaurante, Cafe da manha."
              >
                <Input name="category" defaultValue={image.category} />
              </FieldBlock>
            </FieldPanel>

            <FieldPanel>
              <FieldBlock
                label="Ordem"
                description="Numeros menores sobem na pagina."
              >
                <Input name="order" type="number" defaultValue={image.order} />
              </FieldBlock>
            </FieldPanel>
          </div>

          <FieldPanel>
            <FieldBlock
              label="Descricao da imagem"
              description="Explique claramente o ambiente mostrado. Isso ajuda no SEO e na acessibilidade."
            >
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
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Troque a foto aqui quando precisar atualizar este item, sem misturar com banners ou imagens de quartos.
            </p>
          </FieldPanel>

          <FieldPanel>
            <VisibilityToggleField
              name="isActive"
              defaultChecked={image.isActive}
              label="Exibir na galeria publica"
              description="Quando ativo, o item fica visivel para os visitantes abaixo do banner da pagina."
            />
          </FieldPanel>

          <div className="flex flex-wrap items-center gap-3">
            <SubmitButton>Salvar ajustes</SubmitButton>
          </div>
        </form>

        <form action={deleteGalleryImageAction}>
          <input type="hidden" name="id" value={image.id} />
          <Button
            type="submit"
            variant="outline"
            className="h-10 border-slate-200 px-4 text-red-600 normal-case tracking-normal hover:bg-red-50 hover:text-red-700"
          >
            Remover foto
          </Button>
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
      title="As 3 fotos do bloco gastronomico"
      description="Estas imagens pertencem ao bloco visual do restaurante. Elas nao devem ser cadastradas na galeria institucional."
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
      title="Imagem do topo da pagina de galeria"
      description="Este banner aparece antes das fotos em /galeria-de-fotos e e ajustado na aba Paginas."
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
      title="Capas e galerias dos quartos ficam em outro lugar"
      description="Imagens de quartos individuais nao entram nesta aba. Cada acomodacao ja possui seu proprio editor na area de quartos."
      href="/admin/quartos"
      actionLabel="Abrir Quartos"
      icon={BedDouble}
    >
      <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-4">
        <p className="text-sm leading-6 text-slate-600">
          As imagens de <span className="font-medium text-slate-900">Quarto standard</span> e <span className="font-medium text-slate-900">Quarto superior</span> foram removidas desta area para nao duplicar o conteudo administrado na aba de quartos.
        </p>
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
      description="Entenda melhor o papel de cada imagem antes de editar o site."
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
              <p className="text-sm leading-6 text-slate-600">
                Esta aba cuida da galeria institucional. O bloco abaixo ajuda a nao misturar banner, restaurante e quartos no mesmo lugar.
              </p>
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
                Adicionar a galeria institucional
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                Use esta area apenas para imagens que devem aparecer na pagina publica <span className="font-medium text-slate-900">/galeria-de-fotos</span>.
              </p>
            </div>

            <form action={saveGalleryImageAction} className="mt-5 grid gap-4">
              <FieldPanel>
                <FieldBlock
                  label="Categoria"
                  description="Ex.: Fachada, Restaurante, Cafe da manha ou Area comum."
                >
                  <Input name="category" placeholder="Ex.: Fachada" />
                </FieldBlock>
              </FieldPanel>

              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
                <FieldPanel>
                  <FieldBlock
                    label="Descricao da imagem"
                    description="Descreva o ambiente fotografado para SEO e acessibilidade."
                  >
                    <Input name="altText" placeholder="Ex.: Fachada principal do hotel" />
                  </FieldBlock>
                </FieldPanel>

                <FieldPanel>
                  <FieldBlock
                    label="Ordem"
                    description="Posicao da foto na pagina."
                  >
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
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Prefira imagens horizontais, com boa luz e enquadramento claro do ambiente.
                </p>
              </FieldPanel>

              <FieldPanel>
                <VisibilityToggleField
                  name="isActive"
                  defaultChecked
                  label="Publicar assim que salvar"
                  description="Quando ativo, o item ja entra na galeria publica imediatamente."
                />
              </FieldPanel>

              <SubmitButton>Adicionar foto</SubmitButton>
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
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Aqui ficam apenas imagens institucionais do hotel. O layout abaixo foi separado em cards mais fortes, com preview destacado e campos agrupados, para facilitar a leitura de cada item.
            </p>
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
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Comece adicionando uma imagem na coluna ao lado. Ela aparecera aqui com campos separados e preview proprio.
              </p>
            </section>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
