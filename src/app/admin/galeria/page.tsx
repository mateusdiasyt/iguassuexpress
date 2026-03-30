import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ImageIcon,
  Images,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { deleteGalleryImageAction, saveGalleryImageAction } from "@/actions/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadField } from "@/components/admin/upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { getGalleryImages } from "@/data/queries";
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

type ScopeCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  icon: LucideIcon;
};

type FieldBlockProps = {
  label: string;
  description: string;
  className?: string;
  children: ReactNode;
};

type VisibilityToggleFieldProps = {
  name: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
};

function ScopeCard({
  eyebrow,
  title,
  description,
  href,
  actionLabel,
  icon: Icon,
}: ScopeCardProps) {
  return (
    <article className="rounded-[1.4rem] border border-slate-200/80 bg-white p-4 shadow-sm">
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

function FieldBlock({ label, description, className, children }: FieldBlockProps) {
  return (
    <label className={cn("grid gap-2 text-sm text-slate-600", className)}>
      <span className="space-y-1">
        <span className="block font-medium text-slate-950">{label}</span>
        <span className="block text-xs leading-5 text-slate-500">{description}</span>
      </span>
      {children}
    </label>
  );
}

function VisibilityToggleField({
  name,
  label,
  description,
  defaultChecked = true,
}: VisibilityToggleFieldProps) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[1.15rem] border border-slate-200 bg-slate-50 px-4 py-3">
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
    <article className="rounded-[1.6rem] border border-slate-200/80 bg-white p-5 shadow-sm">
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
            Mantenha aqui imagens institucionais como fachada, apartamentos, restaurante ou areas comuns.
          </p>
        </div>

        <span
          title={image.isActive ? "Visivel na pagina publica" : "Oculta na pagina publica"}
          className={cn(
            "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border p-1",
            image.isActive
              ? "border-slate-900 bg-slate-900 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)]"
              : "border-slate-200 bg-slate-200/90 shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)]",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "relative z-10 h-5 w-5 rounded-full border border-white/90 bg-white shadow-[0_3px_10px_rgba(15,23,42,0.14)] transition-transform duration-200 ease-out",
              image.isActive ? "translate-x-5" : "translate-x-0",
            )}
          />
        </span>
      </div>

      <form action={saveGalleryImageAction} className="mt-5 grid gap-4">
        <input type="hidden" name="id" value={image.id} />

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
          <FieldBlock
            label="Categoria"
            description="Agrupe por tema para manter a galeria coerente. Ex.: Fachada, Apartamentos, Restaurante."
          >
            <Input name="category" defaultValue={image.category} />
          </FieldBlock>

          <FieldBlock
            label="Ordem"
            description="Numeros menores aparecem primeiro na pagina."
          >
            <Input name="order" type="number" defaultValue={image.order} />
          </FieldBlock>
        </div>

        <FieldBlock
          label="Descricao da imagem"
          description="Explique o que aparece na foto. Esse texto ajuda no SEO e na acessibilidade."
        >
          <Input name="altText" defaultValue={image.altText} />
        </FieldBlock>

        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4">
          <UploadField
            name="imageUrl"
            label="Arquivo da foto"
            defaultValue={image.imageUrl}
            hideTextInput
            previewClassName="h-44 rounded-[1.1rem] border border-slate-200 bg-slate-100"
          />
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Use esta imagem para a galeria institucional. Se a foto for do restaurante ou de um banner principal, edite nas areas especificas indicadas no mapa acima.
          </p>
        </div>

        <VisibilityToggleField
          name="isActive"
          defaultChecked={image.isActive}
          label="Exibir na galeria publica"
          description="Quando ativo, este item aparece para os visitantes abaixo do banner da pagina."
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <SubmitButton>Salvar ajustes</SubmitButton>
        </div>
      </form>

      <form action={deleteGalleryImageAction} className="mt-3">
        <input type="hidden" name="id" value={image.id} />
        <Button
          type="submit"
          variant="outline"
          className="h-10 border-slate-200 px-4 text-red-600 normal-case tracking-normal hover:bg-red-50 hover:text-red-700"
        >
          Remover foto
        </Button>
      </form>
    </article>
  );
}

export default async function AdminGalleryPage() {
  const session = await requireAdmin();
  const images = await getGalleryImages();
  const activeImagesCount = images.filter((image) => image.isActive).length;
  const categoriesCount = new Set(
    images.map((image) => image.category.trim().toLowerCase()).filter(Boolean),
  ).size;
  const nextOrder = images.length ? Math.max(...images.map((image) => image.order)) + 1 : 1;

  return (
    <AdminShell
      title="Personalizacao"
      description="Central visual para entender banners, restaurante e galeria institucional."
      pathname="/admin/galeria"
      userName={session.user.name}
    >
      <div className="mx-auto grid max-w-6xl gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-sm">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_300px] xl:items-start">
            <div className="max-w-3xl space-y-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Personalizacao visual
              </p>
              <div className="space-y-3">
                <h1 className="text-3xl leading-tight font-semibold tracking-[-0.03em] text-slate-950 md:text-[2.5rem]">
                  Organize melhor as imagens do site sem misturar o papel de cada area.
                </h1>
                <p className="text-sm leading-7 text-slate-600 md:text-base">
                  Esta aba agora funciona como um mapa visual. Aqui voce entende onde entram os banners do topo, as fotos do restaurante e as imagens da galeria institucional. O editor abaixo cuida especificamente das fotos exibidas em <span className="font-medium text-slate-900">/galeria-de-fotos</span>.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[1.35rem] border border-slate-200/80 bg-white/90 p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Fotos ativas
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                  {activeImagesCount}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Itens visiveis na galeria publica.
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-slate-200/80 bg-white/90 p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Total de fotos
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                  {images.length}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Acervo atual desta galeria institucional.
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-slate-200/80 bg-white/90 p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Categorias
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                  {categoriesCount}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Grupos usados para organizar as imagens.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)] xl:items-start">
          <aside className="space-y-6">
            <section className="rounded-[1.8rem] border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="space-y-2">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Onde cada imagem entra
                </p>
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">
                  Mapa rapido do visual do site
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Para nao confundir edicoes, use este guia antes de subir uma nova foto.
                </p>
              </div>

              <div className="mt-5 grid gap-4">
                <ScopeCard
                  eyebrow="Banners"
                  title="Header e topo das paginas"
                  description="As imagens grandes do topo das paginas publicas ficam na aba Paginas. Ex.: Home, Apartamentos, Galeria de fotos e Contato."
                  href="/admin/paginas"
                  actionLabel="Abrir Paginas"
                  icon={ImageIcon}
                />
                <ScopeCard
                  eyebrow="Restaurante"
                  title="Fotos gastronomicas"
                  description="As imagens usadas no teaser da home e na pagina do restaurante sao ajustadas na aba Restaurante."
                  href="/admin/restaurante"
                  actionLabel="Abrir Restaurante"
                  icon={UtensilsCrossed}
                />
                <ScopeCard
                  eyebrow="Galeria"
                  title="Galeria institucional"
                  description="As fotos desta pagina aparecem abaixo do banner em /galeria-de-fotos. Aqui entram fachada, apartamentos, ambientes e estrutura."
                  href="/galeria-de-fotos"
                  actionLabel="Ver pagina publica"
                  icon={Images}
                />
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="space-y-2">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Nova foto
                </p>
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">
                  Adicionar imagem da galeria
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  Use esta area somente para as fotos da galeria institucional. Evite misturar aqui banners ou imagens exclusivas do restaurante.
                </p>
              </div>

              <form action={saveGalleryImageAction} className="mt-5 grid gap-4">
                <FieldBlock
                  label="Categoria"
                  description="Nome do grupo visual. Ex.: Fachada, Lobby, Apartamentos, Restaurante."
                >
                  <Input name="category" placeholder="Ex.: Apartamentos" />
                </FieldBlock>

                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
                  <FieldBlock
                    label="Descricao da imagem"
                    description="Descreva o que aparece na foto para SEO e acessibilidade."
                  >
                    <Input name="altText" placeholder="Ex.: Quarto superior com cama box e bancada" />
                  </FieldBlock>

                  <FieldBlock
                    label="Ordem"
                    description="Defina a posicao na pagina publica."
                  >
                    <Input name="order" type="number" defaultValue={nextOrder} />
                  </FieldBlock>
                </div>

                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-4">
                  <UploadField
                    name="imageUrl"
                    label="Arquivo da foto"
                    hideTextInput
                    previewClassName="h-44 rounded-[1.1rem] border border-slate-200 bg-slate-100"
                  />
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Prefira imagens horizontais, bem iluminadas e que representem claramente o ambiente mostrado.
                  </p>
                </div>

                <VisibilityToggleField
                  name="isActive"
                  defaultChecked
                  label="Publicar assim que salvar"
                  description="Deixe ativo para que a foto apareca imediatamente na galeria publica."
                />

                <SubmitButton>Adicionar foto</SubmitButton>
              </form>
            </section>
          </aside>

          <section className="space-y-4">
            <div className="rounded-[1.8rem] border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl space-y-2">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Acervo atual
                  </p>
                  <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">
                    Fotos da galeria institucional
                  </h2>
                  <p className="text-sm leading-6 text-slate-600">
                    Edite com calma cada imagem para manter a pagina publica mais organizada. O ideal aqui e usar fotos que mostrem estrutura, quartos, restaurante e atmosferas do hotel.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <Sparkles className="h-3.5 w-3.5" />
                  {images.length} foto{images.length === 1 ? "" : "s"} cadastrada{images.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>

            {images.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {images.map((image) => (
                  <ExistingImageCard key={image.id} image={image} />
                ))}
              </div>
            ) : (
              <section className="rounded-[1.8rem] border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">Nenhuma foto cadastrada ainda</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Comece adicionando uma imagem na coluna ao lado. Ela podera ser organizada por categoria, ordem e visibilidade publica.
                </p>
              </section>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
