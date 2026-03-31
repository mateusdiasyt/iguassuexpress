import type { ReactNode } from "react";
import Image from "next/image";
import { ChevronDown, FolderTree, ListPlus, ScrollText } from "lucide-react";
import {
  deleteMenuCategoryAction,
  deleteMenuItemAction,
  saveMenuCategoryAction,
  saveMenuItemAction,
} from "@/actions/admin";
import { UploadField } from "@/components/admin/upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getMenuCategories } from "@/data/queries";
import { cn } from "@/lib/utils";

type MenuCategories = Awaited<ReturnType<typeof getMenuCategories>>;
type MenuCategory = MenuCategories[number];
type MenuItem = MenuCategory["items"][number];

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
      {children}
    </p>
  );
}

function CountPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
      {children}
    </span>
  );
}

function StatusPill({
  active,
  activeLabel = "Visivel",
  inactiveLabel = "Oculto",
}: {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
        active
          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border border-slate-200 bg-slate-100 text-slate-500",
      )}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

function ToggleField({
  name,
  defaultChecked,
  label,
}: {
  name: string;
  defaultChecked?: boolean;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(244,249,253,0.9)_0%,rgba(237,244,250,0.82)_100%)] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
      </div>
      <span className="relative inline-flex h-8 w-[3.3rem] shrink-0 cursor-pointer items-center">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full border border-slate-200 bg-slate-200/90 transition peer-checked:border-slate-900 peer-checked:bg-slate-900" />
        <span className="absolute left-1 top-1 h-6 w-6 rounded-full border border-white/90 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.16)] transition-transform duration-200 ease-out peer-checked:translate-x-[1.35rem]" />
      </span>
    </label>
  );
}

function PreviewThumb({
  src,
  alt,
  size = "md",
}: {
  src?: string | null;
  alt: string;
  size?: "sm" | "md";
}) {
  const classes =
    size === "sm"
      ? "h-14 w-14 rounded-[1rem]"
      : "h-16 w-16 rounded-[1.1rem]";

  return (
    <div className={cn("relative shrink-0 overflow-hidden border border-slate-200 bg-slate-100", classes)}>
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[0.68rem] font-medium uppercase tracking-[0.14em] text-slate-400">
          Sem imagem
        </div>
      )}
    </div>
  );
}

function ItemEditorRow({
  item,
  categoryId,
  categoryName,
  fallbackImage,
}: {
  item: MenuItem;
  categoryId: string;
  categoryName: string;
  fallbackImage?: string | null;
}) {
  const deleteFormId = `delete-menu-item-${item.id}`;
  const priceLabel = item.price === null ? "Sem preco" : `R$ ${item.price.toFixed(2)}`;

  return (
    <details className="group rounded-[1.45rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(247,251,254,0.98)_0%,rgba(240,247,252,0.9)_100%)] shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[1.45rem] px-4 py-3 transition hover:bg-white/55 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <PreviewThumb src={item.imageUrl ?? fallbackImage} alt={item.name} size="sm" />
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {categoryName}
            </p>
            <h4 className="truncate text-base font-semibold tracking-[-0.03em] text-slate-950">
              {item.name}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CountPill>{priceLabel}</CountPill>
          <CountPill>Ordem {item.order + 1}</CountPill>
          <StatusPill active={item.isActive} />
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition group-open:rotate-180 group-open:text-slate-700">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </summary>

      <div className="border-t border-brand/10 px-4 py-4">
        <form action={saveMenuItemAction} className="grid gap-4">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="categoryId" value={categoryId} />

          <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
            <div className="rounded-[1.35rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(241,247,252,0.9)_0%,rgba(235,244,250,0.82)_100%)] p-4">
              <SectionEyebrow>Imagem</SectionEyebrow>
              <div className="mt-3">
                <UploadField
                  name="imageUrl"
                  label="Imagem do item"
                  defaultValue={item.imageUrl ?? undefined}
                  previewFallbackSrc={fallbackImage}
                  previewActionLabel="Alterar imagem"
                  hideTextInput
                  previewClassName="h-[210px] rounded-[1.2rem]"
                  previewImageClassName="object-cover"
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.35rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(250,253,255,0.98)_0%,rgba(244,249,253,0.9)_100%)] p-4">
                <SectionEyebrow>Dados do item</SectionEyebrow>
                <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_130px_160px]">
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-950">Nome</span>
                    <Input name="name" defaultValue={item.name} />
                  </label>

                  <label className="grid gap-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-950">Ordem</span>
                    <Input name="order" type="number" defaultValue={item.order} />
                  </label>

                  <label className="grid gap-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-950">Preco</span>
                    <Input
                      name="price"
                      inputMode="decimal"
                      defaultValue={item.price === null ? "" : item.price.toFixed(2)}
                      placeholder="Opcional"
                    />
                  </label>
                </div>

                <label className="mt-4 grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Descricao</span>
                  <Textarea name="description" className="min-h-[130px]" defaultValue={item.description ?? ""} />
                </label>
              </div>

              <ToggleField name="isActive" defaultChecked={item.isActive} label="Item visivel no site" />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 rounded-[1.2rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(242,248,252,0.92)_0%,rgba(235,244,250,0.84)_100%)] px-4 py-3">
            <Button
              type="submit"
              form={deleteFormId}
              variant="outline"
              className="h-10 border-slate-200 px-4 text-red-600 normal-case tracking-normal hover:bg-red-50 hover:text-red-700"
            >
              Excluir
            </Button>
            <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
              Salvar item
            </SubmitButton>
          </div>
        </form>

        <form id={deleteFormId} action={deleteMenuItemAction}>
          <input type="hidden" name="id" value={item.id} />
        </form>
      </div>
    </details>
  );
}

function NewItemPanel({
  category,
  nextOrder,
}: {
  category: MenuCategory;
  nextOrder: number;
}) {
  return (
    <details className="group rounded-[1.45rem] border border-dashed border-brand/20 bg-[linear-gradient(180deg,rgba(245,250,253,0.88)_0%,rgba(239,246,251,0.78)_100%)] p-4">
      <summary className="inline-flex cursor-pointer list-none items-center gap-3 rounded-full border border-brand/10 bg-white/88 px-4 py-3 text-sm font-medium text-slate-950 transition hover:border-brand/20 hover:bg-white [&::-webkit-details-marker]:hidden">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-open:bg-slate-900 group-open:text-white">
          <ListPlus className="h-4 w-4" />
        </span>
        <span>Adicionar item</span>
      </summary>

      <form action={saveMenuItemAction} className="mt-4 grid gap-4">
        <input type="hidden" name="categoryId" value={category.id} />
        <input type="hidden" name="isActive" value="true" />

        <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
          <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4">
            <SectionEyebrow>Imagem</SectionEyebrow>
            <div className="mt-3">
              <UploadField
                name="imageUrl"
                label="Imagem do item"
                previewFallbackSrc={category.heroImage}
                previewActionLabel="Adicionar imagem"
                hideTextInput
                previewClassName="h-[210px] rounded-[1.2rem]"
                previewImageClassName="object-cover"
              />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.35rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(250,253,255,0.98)_0%,rgba(243,249,253,0.9)_100%)] p-4">
              <SectionEyebrow>Novo item</SectionEyebrow>
              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_130px_160px]">
                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Nome</span>
                  <Input name="name" placeholder="Ex.: Vinho Tinto Malbec" />
                </label>

                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Ordem</span>
                  <Input name="order" type="number" defaultValue={nextOrder} />
                </label>

                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Preco</span>
                  <Input name="price" inputMode="decimal" placeholder="Opcional" />
                </label>
              </div>

              <label className="mt-4 grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Descricao</span>
                <Textarea
                  name="description"
                  className="min-h-[130px]"
                  placeholder="Descreva o item de forma curta e clara."
                />
              </label>
            </div>

            <div className="rounded-[1.2rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(245,250,253,0.94)_0%,rgba(239,246,251,0.84)_100%)] px-4 py-3 text-sm leading-6 text-slate-500">
              Deixe o preco vazio quando esse cadastro for apenas uma opcao complementar.
            </div>
          </div>
        </div>

        <div className="flex justify-end rounded-[1.2rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(245,250,253,0.94)_0%,rgba(239,246,251,0.84)_100%)] px-4 py-3">
          <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
            Adicionar item
          </SubmitButton>
        </div>
      </form>
    </details>
  );
}

function CategoryEditorCard({
  category,
  depth = 0,
}: {
  category: MenuCategory;
  depth?: number;
}) {
  const deleteFormId = `delete-menu-category-${category.id}`;
  const nextItemOrder = category.items.length
    ? Math.max(...category.items.map((item) => item.order)) + 1
    : 0;

  return (
    <details
      className={cn(
        "group rounded-[1.9rem] border border-white/70 bg-white/92 p-4 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-colors duration-300 group-open:border-brand/15 group-open:bg-[linear-gradient(180deg,rgba(244,249,253,0.98)_0%,rgba(236,245,251,0.94)_100%)]",
        depth > 0 &&
          "border-slate-200 bg-slate-50/95 shadow-[0_12px_28px_rgba(15,23,42,0.05)] group-open:border-brand/12 group-open:bg-[linear-gradient(180deg,rgba(245,249,252,0.98)_0%,rgba(239,245,250,0.94)_100%)]",
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[1.4rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(248,250,252,0.84)_100%)] px-4 py-3 transition duration-300 hover:border-slate-300 hover:bg-slate-50/80 group-open:border-brand/20 group-open:bg-[linear-gradient(180deg,rgba(235,245,252,0.98)_0%,rgba(225,238,248,0.92)_100%)] [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-open:bg-brand group-open:text-white">
            {depth > 0 ? <FolderTree className="h-5 w-5" /> : <ScrollText className="h-5 w-5" />}
          </span>

          <div className="min-w-0">
            <SectionEyebrow>{depth > 0 ? "Subcategoria" : "Categoria"}</SectionEyebrow>
            <h2 className="mt-1 truncate text-xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors duration-300 group-open:text-brand-deep">
              {category.name}
            </h2>
            {category.description ? (
              <p className="mt-1 max-w-[38rem] truncate text-sm text-slate-500">{category.description}</p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill active={category.isActive} activeLabel="Visivel" inactiveLabel="Oculta" />
          <CountPill>{category.items.length} itens</CountPill>
          {category.children.length ? <CountPill>{category.children.length} blocos</CountPill> : null}
          <CountPill>Ordem {category.order + 1}</CountPill>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition group-open:rotate-180 group-open:text-slate-700">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </summary>

      <div className="mt-5 space-y-5 rounded-[1.55rem] bg-brand/[0.03] p-1.5">
        <form action={saveMenuCategoryAction} className="grid gap-4">
          <input type="hidden" name="id" value={category.id} />
          <input type="hidden" name="parentId" value={category.parentId ?? ""} />

          <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
            <div className="rounded-[1.45rem] border border-brand/12 bg-[linear-gradient(180deg,rgba(244,249,253,0.98)_0%,rgba(236,245,251,0.9)_100%)] p-4">
              <SectionEyebrow>Mídia</SectionEyebrow>
              <div className="mt-3">
                <UploadField
                  name="heroImage"
                  label={depth > 0 ? "Imagem da subcategoria" : "Imagem da categoria"}
                  defaultValue={category.heroImage}
                  previewActionLabel="Alterar imagem"
                  hideTextInput
                  previewClassName="h-[240px] rounded-[1.25rem]"
                  previewImageClassName="object-cover"
                />
              </div>

              <div className="mt-4">
                <ToggleField
                  name="isActive"
                  defaultChecked={category.isActive}
                  label={depth > 0 ? "Subcategoria visivel no site" : "Categoria visivel no site"}
                />
              </div>
            </div>

            <div className="rounded-[1.45rem] border border-brand/12 bg-[linear-gradient(180deg,rgba(250,253,255,0.98)_0%,rgba(242,248,252,0.9)_100%)] p-4">
              <SectionEyebrow>Configuracao</SectionEyebrow>
              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_130px]">
                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Nome</span>
                  <Input name="name" defaultValue={category.name} />
                </label>

                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Ordem</span>
                  <Input name="order" type="number" defaultValue={category.order} />
                </label>
              </div>

              <label className="mt-4 grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Slug</span>
                <Input name="slug" defaultValue={category.slug} />
              </label>

              <label className="mt-4 grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Descricao</span>
                <Textarea
                  name="description"
                  className="min-h-[140px]"
                  defaultValue={category.description ?? ""}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 rounded-[1.25rem] border border-brand/12 bg-[linear-gradient(180deg,rgba(243,248,252,0.94)_0%,rgba(236,245,251,0.88)_100%)] px-4 py-3">
            <Button
              type="submit"
              form={deleteFormId}
              variant="outline"
              className="h-10 border-slate-200 px-4 text-red-600 normal-case tracking-normal hover:bg-red-50 hover:text-red-700"
            >
              Excluir categoria
            </Button>
            <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
              Salvar categoria
            </SubmitButton>
          </div>
        </form>

        <form id={deleteFormId} action={deleteMenuCategoryAction}>
          <input type="hidden" name="id" value={category.id} />
        </form>

        {category.children.length ? (
          <section className="space-y-4 rounded-[1.45rem] border border-brand/12 bg-[linear-gradient(180deg,rgba(243,248,252,0.9)_0%,rgba(236,244,250,0.82)_100%)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <SectionEyebrow>Subcategorias</SectionEyebrow>
                <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                  Blocos dentro de {category.name}
                </h3>
              </div>
              <CountPill>{category.children.length} blocos</CountPill>
            </div>

            <div className="space-y-3">
              {category.children.map((child) => (
                <CategoryEditorCard key={child.id} category={child} depth={depth + 1} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4 rounded-[1.45rem] border border-brand/12 bg-[linear-gradient(180deg,rgba(244,249,253,0.96)_0%,rgba(236,245,251,0.88)_100%)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <SectionEyebrow>{depth > 0 ? "Itens da subcategoria" : "Itens da categoria"}</SectionEyebrow>
              <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                Produtos de {category.name}
              </h3>
            </div>
            <CountPill>{category.items.length} itens cadastrados</CountPill>
          </div>

          <NewItemPanel category={category} nextOrder={nextItemOrder} />

          {category.items.length ? (
            <div className="space-y-3">
              {category.items.map((item) => (
                <ItemEditorRow
                  key={item.id}
                  item={item}
                  categoryId={category.id}
                  categoryName={category.name}
                  fallbackImage={item.imageUrl ?? category.heroImage}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-slate-200 bg-white px-5 py-8 text-center">
              <SectionEyebrow>Sem itens</SectionEyebrow>
              <p className="mt-2 text-sm text-slate-500">
                Adicione o primeiro item desta categoria para montar a leitura do cardapio.
              </p>
            </div>
          )}
        </section>
      </div>
    </details>
  );
}

export function MenuWorkspace({ categories }: { categories: MenuCategories }) {
  if (!categories.length) {
    return (
      <article className="rounded-[1.9rem] border border-dashed border-slate-200 bg-white/80 px-6 py-10 text-center shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
        <SectionEyebrow>Sem estrutura</SectionEyebrow>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
          Nenhuma categoria cadastrada ainda
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Crie a primeira categoria do cardapio para montar o popup interativo do restaurante.
        </p>
      </article>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <CategoryEditorCard key={category.id} category={category} />
      ))}
    </div>
  );
}
