import { Plus, ScrollText } from "lucide-react";
import { saveMenuCategoryAction } from "@/actions/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadField } from "@/components/admin/upload-field";
import { MenuWorkspace } from "@/components/admin/menu/menu-workspace";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getMenuCategories } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cardapio Admin",
  description: "Gerencie categorias, subcategorias e itens do cardapio interativo do restaurante.",
  path: "/admin/cardapio",
  noIndex: true,
});

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
      {children}
    </p>
  );
}

function MetricPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
      {children}
    </span>
  );
}

export default async function AdminMenuPage() {
  const session = await requireAdmin();
  const categories = await getMenuCategories(true);

  const rootCategories = categories.length;
  const subcategories = categories.reduce((total, category) => total + category.children.length, 0);
  const items = categories.reduce(
    (total, category) =>
      total +
      category.items.length +
      category.children.reduce((childTotal, child) => childTotal + child.items.length, 0),
    0,
  );
  const nextCategoryOrder = rootCategories ? Math.max(...categories.map((category) => category.order)) + 1 : 0;

  return (
    <AdminShell
      title="Cardapio"
      description="Monte o menu interativo do restaurante com categorias, imagens e itens editaveis."
      pathname="/admin/cardapio"
      userName={session.user.name}
    >
      <section className="mx-auto max-w-[1180px] space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionEyebrow>Restaurante</SectionEyebrow>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-slate-950">
              Cardapio interativo
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <MetricPill>{rootCategories} categorias</MetricPill>
            <MetricPill>{subcategories} subcategorias</MetricPill>
            <MetricPill>{items} itens</MetricPill>
          </div>
        </div>

        <details className="group rounded-[1.9rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,250,252,0.92)_100%)] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <summary className="inline-flex cursor-pointer list-none items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:border-slate-300 hover:bg-slate-50/80 [&::-webkit-details-marker]:hidden">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-open:bg-slate-900 group-open:text-white">
              <Plus className="h-4 w-4 transition group-open:rotate-45" />
            </span>
            <span>Adicionar categoria</span>
          </summary>

          <form action={saveMenuCategoryAction} className="mt-4 grid gap-4">
            <input type="hidden" name="isActive" value="true" />

            <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
              <UploadField
                name="heroImage"
                label="Imagem da categoria"
                previewActionLabel="Adicionar imagem"
                hideTextInput
                previewClassName="h-[240px] rounded-[1.4rem]"
                previewImageClassName="object-cover"
              />

              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px]">
                  <label className="grid gap-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-950">Nome</span>
                    <Input name="name" placeholder="Ex.: Vinhos" />
                  </label>

                  <label className="grid gap-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-950">Ordem</span>
                    <Input name="order" type="number" defaultValue={nextCategoryOrder} />
                  </label>
                </div>

                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Slug</span>
                  <Input name="slug" placeholder="Pode deixar em branco para gerar automaticamente" />
                </label>

                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Vincular a uma categoria</span>
                  <select
                    name="parentId"
                    defaultValue=""
                    className="h-11 w-full rounded-2xl border border-brand/10 bg-white/90 px-4 text-sm text-slate-900 outline-none transition focus:border-brand/50 focus:ring-4 focus:ring-brand/10"
                  >
                    <option value="">Categoria principal</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">Descricao</span>
                  <Textarea
                    name="description"
                    className="min-h-[120px]"
                    placeholder="Uma descricao curta ajuda a apresentar a categoria no popup do cardapio."
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3">
              <SubmitButton className="h-10 px-4 text-sm normal-case tracking-normal shadow-sm">
                Adicionar categoria
              </SubmitButton>
            </div>
          </form>
        </details>

        <section className="rounded-[1.8rem] border border-white/70 bg-white/90 p-5 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <ScrollText className="h-4.5 w-4.5" />
              </span>
              <div>
                <SectionEyebrow>Estrutura completa</SectionEyebrow>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  Categorias, blocos e itens
                </h2>
              </div>
            </div>

            <MetricPill>Abra um card para editar</MetricPill>
          </div>

          <div className="mt-5">
            <MenuWorkspace categories={categories} />
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
