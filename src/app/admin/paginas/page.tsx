import { savePageContentAction } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
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
  title: "Paginas Admin",
  description: "Edicao das paginas institucionais do hotel.",
  path: "/admin/paginas",
  noIndex: true,
});

export default async function AdminPagesPage() {
  const session = await requireAdmin();
  const pages = await getPageContents();

  return (
    <AdminShell
      title="Paginas"
      description="Edite titulos, subtitulos, banners, publicacao e blocos em JSON de cada rota institucional."
      pathname="/admin/paginas"
      userName={session.user.name}
    >
      <div className="grid gap-6">
        {pages.map((page) => (
          <AdminCard
            key={page.key}
            title={page.title}
            description={`Chave da pagina: ${page.key}`}
          >
            <form action={savePageContentAction} className="grid gap-5">
              <input type="hidden" name="key" value={page.key} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-600">
                  Titulo
                  <Input name="title" defaultValue={page.title} />
                </label>
                <label className="grid gap-2 text-sm text-slate-600">
                  Subtitulo
                  <Input name="subtitle" defaultValue={page.subtitle ?? ""} />
                </label>
              </div>
              <UploadField name="bannerImage" label="Banner" defaultValue={page.bannerImage} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-600">
                  SEO title
                  <Input name="seoTitle" defaultValue={page.seoTitle ?? ""} />
                </label>
                <label className="grid gap-2 text-sm text-slate-600">
                  Publicada
                  <span className="flex h-11 items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4">
                    <input type="checkbox" name="isPublished" defaultChecked={page.isPublished} />
                    Ativa no site
                  </span>
                </label>
              </div>
              <label className="grid gap-2 text-sm text-slate-600">
                SEO description
                <Textarea name="seoDescription" defaultValue={page.seoDescription ?? ""} />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Conteudo / JSON avancado
                <Textarea
                  name="content"
                  className="min-h-52 font-mono text-xs"
                  defaultValue={stringifyJson(page.content)}
                />
              </label>
              <div>
                <SubmitButton>Salvar pagina</SubmitButton>
              </div>
            </form>
          </AdminCard>
        ))}
      </div>
    </AdminShell>
  );
}
