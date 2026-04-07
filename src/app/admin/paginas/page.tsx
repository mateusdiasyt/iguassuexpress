import { ChevronDown, FileText, Globe2, ImageIcon, Search } from "lucide-react";
import { savePageContentAction } from "@/actions/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadField } from "@/components/admin/upload-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getPageContents } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";
import { stringifyJson } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Páginas Admin",
  description: "Edição das páginas institucionais do hotel.",
  path: "/admin/paginas",
  noIndex: true,
});

const pageLabels: Record<string, { name: string; route: string; group: string }> = {
  home: { name: "Home", route: "/", group: "Entrada" },
  apartments: { name: "Apartamentos", route: "/apartamentos", group: "Hospedagem" },
  restaurant: { name: "Restaurante", route: "/restaurante", group: "Experiência" },
  gallery: { name: "Galeria", route: "/galeria-de-fotos", group: "Visual" },
  "tour-360": { name: "Tour 360", route: "/tour-360", group: "Experiência" },
  location: { name: "Localização", route: "/localizacao", group: "Acesso" },
  about: { name: "Sobre o hotel", route: "/sobre-o-hotel", group: "Institucional" },
  contact: { name: "Contato", route: "/contato", group: "Atendimento" },
  blog: { name: "Blog", route: "/blog", group: "Conteúdo" },
  careers: { name: "Carreiras", route: "/trabalhe-conosco", group: "Institucional" },
};

function getPageMeta(key: string) {
  return pageLabels[key] ?? { name: key, route: `/${key}`, group: "Página" };
}

function getSeoState(title?: string | null, description?: string | null) {
  if (title?.trim() && description?.trim()) {
    return "SEO pronto";
  }

  if (title?.trim() || description?.trim()) {
    return "SEO parcial";
  }

  return "SEO pendente";
}

export default async function AdminPagesPage() {
  const session = await requireAdmin();
  const pages = await getPageContents();
  const publishedPages = pages.filter((page) => page.isPublished).length;
  const pagesWithBanner = pages.filter((page) => Boolean(page.bannerImage)).length;

  return (
    <AdminShell
      title="Páginas"
      description="Gerencie os textos, banners e SEO das rotas institucionais do site."
      pathname="/admin/paginas"
      userName={session.user.name}
    >
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-brand/10 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8">
            <div className="flex flex-col justify-between gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand/60">
                  Conteúdo institucional
                </p>
                <h2 className="mt-4 max-w-2xl text-[2.25rem] leading-[0.95] font-extrabold tracking-[-0.05em] text-slate-950 md:text-[3rem]">
                  Edite as páginas sem perder a visão geral do site.
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                Abra apenas a página que precisa ajustar. Os campos essenciais ficam no topo; SEO e JSON avançado ficam separados para reduzir ruído.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Páginas
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-950">{pages.length}</p>
              </div>
              <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-emerald-600/70">
                  Publicadas
                </p>
                <p className="mt-2 text-2xl font-extrabold text-emerald-800">{publishedPages}</p>
              </div>
              <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50/75 p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-sky-700/60">
                  Com banner
                </p>
                <p className="mt-2 text-2xl font-extrabold text-sky-900">{pagesWithBanner}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 px-1 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand/60">
                Rotas do site
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-slate-950">
                Lista de páginas
              </h2>
            </div>
            <span className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm">
              Abra um card para editar
            </span>
          </div>

          <div className="grid gap-4">
            {pages.map((page) => {
              const meta = getPageMeta(page.key);
              const seoState = getSeoState(page.seoTitle, page.seoDescription);

              return (
                <details
                  key={page.key}
                  className="group/page overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.05)] transition-all duration-300 open:border-brand/18 open:bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_52%)] open:shadow-[0_24px_70px_rgba(9,77,122,0.1)]"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-4 outline-none transition hover:bg-slate-50/80 md:p-5 [&::-webkit-details-marker]:hidden">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-deep text-white shadow-[0_12px_26px_rgba(6,45,71,0.18)]">
                      <FileText className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand/50">
                          {meta.group}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {meta.route}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-lg font-extrabold tracking-[-0.03em] text-slate-950 md:text-xl">
                        {meta.name}
                      </span>
                    </span>
                    <span className="hidden flex-wrap items-center justify-end gap-2 md:flex">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
                        {seoState}
                      </span>
                      <span className={page.isPublished ? "rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700" : "rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500"}>
                        {page.isPublished ? "Publicada" : "Oculta"}
                      </span>
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition group-open/page:rotate-180">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </summary>

                  <form action={savePageContentAction} className="border-t border-slate-200/70 p-4 md:p-5">
                    <input type="hidden" name="key" value={page.key} />

                    <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
                      <section className="rounded-[1.6rem] border border-slate-200/80 bg-slate-50/70 p-4">
                        <div className="mb-4 flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-brand shadow-sm">
                            <ImageIcon className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand/50">
                              Banner
                            </p>
                            <p className="text-sm font-semibold text-slate-950">Imagem principal</p>
                          </div>
                        </div>
                        <UploadField
                          name="bannerImage"
                          label="Banner da página"
                          defaultValue={page.bannerImage}
                          hideTextInput
                          hideLabel
                          previewActionLabel="Alterar banner"
                          previewClassName="h-48 rounded-[1.25rem]"
                        />
                        <label className="mt-4 flex h-12 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600">
                          Página publicada
                          <input
                            type="checkbox"
                            name="isPublished"
                            defaultChecked={page.isPublished}
                            className="h-5 w-5 accent-brand"
                          />
                        </label>
                      </section>

                      <div className="space-y-4">
                        <section className="rounded-[1.6rem] border border-slate-200/80 bg-white p-4 md:p-5">
                          <div className="mb-5 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                              <Globe2 className="h-4 w-4" />
                            </span>
                            <div>
                              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand/50">
                                Conteúdo
                              </p>
                              <p className="text-sm font-semibold text-slate-950">Texto exibido na página</p>
                            </div>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="grid gap-2 text-sm font-medium text-slate-600">
                              Título
                              <Input name="title" defaultValue={page.title} />
                            </label>
                            <label className="grid gap-2 text-sm font-medium text-slate-600">
                              Subtítulo
                              <Input name="subtitle" defaultValue={page.subtitle ?? ""} />
                            </label>
                          </div>
                        </section>

                        <section className="rounded-[1.6rem] border border-slate-200/80 bg-white p-4 md:p-5">
                          <div className="mb-5 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                              <Search className="h-4 w-4" />
                            </span>
                            <div>
                              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                                SEO
                              </p>
                              <p className="text-sm font-semibold text-slate-950">Título e descrição para buscadores</p>
                            </div>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="grid gap-2 text-sm font-medium text-slate-600">
                              SEO title
                              <Input name="seoTitle" defaultValue={page.seoTitle ?? ""} />
                            </label>
                            <label className="grid gap-2 text-sm font-medium text-slate-600 md:col-span-2">
                              SEO description
                              <Textarea
                                name="seoDescription"
                                className="min-h-24"
                                defaultValue={page.seoDescription ?? ""}
                              />
                            </label>
                          </div>
                        </section>

                        <details className="rounded-[1.6rem] border border-dashed border-slate-200 bg-slate-50/70">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-slate-600 [&::-webkit-details-marker]:hidden">
                            JSON avançado
                            <ChevronDown className="h-4 w-4 transition group-open/page:rotate-180" />
                          </summary>
                          <div className="px-4 pb-4">
                            <Textarea
                              name="content"
                              className="min-h-52 rounded-[1.25rem] bg-white font-mono text-xs"
                              defaultValue={stringifyJson(page.content)}
                            />
                          </div>
                        </details>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end rounded-[1.4rem] border border-slate-200/80 bg-slate-50/80 p-3">
                      <SubmitButton className="h-10 px-5 text-sm normal-case tracking-normal">
                        Salvar página
                      </SubmitButton>
                    </div>
                  </form>
                </details>
              );
            })}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
