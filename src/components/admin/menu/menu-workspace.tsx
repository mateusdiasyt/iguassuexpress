import type { ReactNode } from "react";
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

type MenuCategories = Awaited<ReturnType<typeof getMenuCategories>>;
type MenuCategory = MenuCategories[number];
type MenuItem = MenuCategory["items"][number];

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
      {children}
    </p>
  );
}

function CountPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
      {children}
    </span>
  );
}

function InlineToggle({
  name,
  defaultChecked,
  label,
}: {
  name: string;
  defaultChecked?: boolean;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="relative inline-flex h-8 w-[3.3rem] shrink-0 cursor-pointer items-center">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="absolute inset-0 rounded-full border border-slate-200 bg-slate-200/90 transition peer-checked:border-slate-900 peer-checked:bg-slate-900" />
        <span className="absolute left-1 top-1 h-6 w-6 rounded-full border border-white/90 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.16)] transition-transform duration-200 ease-out peer-checked:translate-x-[1.35rem]" />
      </span>
    </label>
  );
}

function ItemEditorCard({
  item,
  categoryId,
  fallbackImage,
}: {
  item: MenuItem;
  categoryId: string;
  fallbackImage?: string | null;
}) {
  const deleteFormId = `delete-menu-item-${item.id}`;

  return (
    <article className="rounded-[1.55rem] border border-slate-200 bg-white/92 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <form action={saveMenuItemAction} className="grid gap-4">
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="categoryId" value={categoryId} />

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <UploadField
            name="imageUrl"
            label="Imagem do item"
            defaultValue={item.imageUrl ?? undefined}
            previewFallbackSrc={fallbackImage}
            previewActionLabel="Alterar imagem"
            className="space-y-3"
            hideTextInput
            previewClassName="h-[204px] rounded-[1.35rem]"
            previewImageClassName="object-cover"
          />

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px]">
              <label className="grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Nome</span>
                <Input name="name" defaultValue={item.name} />
              </label>

              <label className="grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Ordem</span>
                <Input name="order" type="number" defaultValue={item.order} />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px]">
              <label className="grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Descricao</span>
                <Textarea
                  name="description"
                  className="min-h-[132px]"
                  defaultValue={item.description ?? ""}
                />
              </label>

              <div className="grid gap-4 content-start">
                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Preco</span>
                  <Input
                    name="price"
                    inputMode="decimal"
                    defaultValue={item.price === null ? "" : item.price.toFixed(2)}
                    placeholder="Opcional"
                  />
                </label>

                <InlineToggle name="isActive" defaultChecked={item.isActive} label="Visivel" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
          <Button
            type="submit"
            form={deleteFormId}
            variant="outline"
            className="h-10 border-slate-200 px-4 text-red-600 normal-case tracking-normal hover:bg-red-50 hover:text-red-700"
          >
            Excluir
          </Button>
          <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
            Salvar
          </SubmitButton>
        </div>
      </form>

      <form id={deleteFormId} action={deleteMenuItemAction}>
        <input type="hidden" name="id" value={item.id} />
      </form>
    </article>
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
    <details className="group rounded-[1.55rem] border border-dashed border-slate-300 bg-slate-50/70 p-4">
      <summary className="inline-flex cursor-pointer list-none items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:border-slate-300 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-open:bg-slate-900 group-open:text-white">
          <ListPlus className="h-4 w-4" />
        </span>
        <span>Adicionar item em {category.name}</span>
      </summary>

      <form action={saveMenuItemAction} className="mt-4 grid gap-4">
        <input type="hidden" name="categoryId" value={category.id} />
        <input type="hidden" name="isActive" value="true" />

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <UploadField
            name="imageUrl"
            label="Imagem do item"
            previewFallbackSrc={category.heroImage}
            previewActionLabel="Adicionar imagem"
            hideTextInput
            previewClassName="h-[204px] rounded-[1.35rem]"
            previewImageClassName="object-cover"
          />

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px]">
              <label className="grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Nome</span>
                <Input name="name" placeholder="Ex.: File mignon" />
              </label>

              <label className="grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Ordem</span>
                <Input name="order" type="number" defaultValue={nextOrder} />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px]">
              <label className="grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Descricao</span>
                <Textarea
                  name="description"
                  className="min-h-[132px]"
                  placeholder="Descreva o que compoe o item."
                />
              </label>

              <div className="grid gap-4 content-start">
                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Preco</span>
                  <Input name="price" inputMode="decimal" placeholder="Opcional" />
                </label>

                <div className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-500">
                  Deixe o preco vazio quando o item for apenas uma opcao complementar.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3">
          <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
            Adicionar
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
      className={[
        "group rounded-[1.8rem] border border-white/70 bg-white/92 p-4 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm",
        depth > 0 ? "border-slate-200 bg-slate-50/90 shadow-[0_14px_32px_rgba(15,23,42,0.05)]" : "",
      ].join(" ")}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[1.35rem] border border-slate-200 bg-slate-50/70 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-open:bg-slate-900 group-open:text-white">
            {depth > 0 ? <FolderTree className="h-4.5 w-4.5" /> : <ScrollText className="h-4.5 w-4.5" />}
          </span>

          <div className="min-w-0">
            <SectionEyebrow>{depth > 0 ? "Subcategoria" : "Categoria"}</SectionEyebrow>
            <h2 className="mt-1 truncate text-lg font-semibold tracking-[-0.03em] text-slate-950">
              {category.name}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CountPill>{category.items.length} itens</CountPill>
          {category.children.length ? <CountPill>{category.children.length} blocos</CountPill> : null}
          <CountPill>Ordem {category.order + 1}</CountPill>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition group-open:rotate-180 group-open:text-slate-700">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </summary>

      <div className="mt-4 grid gap-4">
        <form action={saveMenuCategoryAction} className="grid gap-4 rounded-[1.55rem] border border-slate-200 bg-white/80 p-4">
          <input type="hidden" name="id" value={category.id} />
          <input type="hidden" name="parentId" value={category.parentId ?? ""} />

          <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
            <UploadField
              name="heroImage"
              label={depth > 0 ? "Imagem da subcategoria" : "Imagem da categoria"}
              defaultValue={category.heroImage}
              previewActionLabel="Alterar imagem"
              hideTextInput
              previewClassName="h-[240px] rounded-[1.4rem]"
              previewImageClassName="object-cover"
            />

            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px]">
                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Nome</span>
                  <Input name="name" defaultValue={category.name} />
                </label>

                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Ordem</span>
                  <Input name="order" type="number" defaultValue={category.order} />
                </label>
              </div>

              <label className="grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Slug</span>
                <Input name="slug" defaultValue={category.slug} />
              </label>

              <label className="grid gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-950">Descricao</span>
                <Textarea
                  name="description"
                  className="min-h-[120px]"
                  defaultValue={category.description ?? ""}
                />
              </label>

              <InlineToggle name="isActive" defaultChecked={category.isActive} label="Categoria visivel no site" />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
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
          <section className="space-y-3 rounded-[1.55rem] border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <SectionEyebrow>Subcategorias</SectionEyebrow>
                <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                  Blocos vinculados a {category.name}
                </h3>
              </div>
              <CountPill>{category.children.length} ativas na estrutura</CountPill>
            </div>

            <div className="space-y-3">
              {category.children.map((child) => (
                <CategoryEditorCard key={child.id} category={child} depth={depth + 1} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4 rounded-[1.55rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(248,250,252,0.82)_100%)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <SectionEyebrow>{depth > 0 ? "Itens da subcategoria" : "Itens da categoria"}</SectionEyebrow>
              <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {category.name}
              </h3>
            </div>
            <CountPill>{category.items.length} itens cadastrados</CountPill>
          </div>

          {category.items.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {category.items.map((item) => (
                <ItemEditorCard
                  key={item.id}
                  item={item}
                  categoryId={category.id}
                  fallbackImage={item.imageUrl ?? category.heroImage}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.4rem] border border-dashed border-slate-200 bg-white px-5 py-8 text-center">
              <SectionEyebrow>Sem itens</SectionEyebrow>
              <p className="mt-2 text-sm text-slate-500">
                Use o botao abaixo para adicionar o primeiro item desta estrutura.
              </p>
            </div>
          )}

          <NewItemPanel category={category} nextOrder={nextItemOrder} />
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
