import {
  deleteBlogCategoryAction,
  deleteBlogPostAction,
  saveBlogCategoryAction,
  saveBlogPostAction,
} from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadField } from "@/components/admin/upload-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getBlogCategories, getBlogPosts } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog Admin",
  description: "CRUD de categorias e posts do blog.",
  path: "/admin/blog",
  noIndex: true,
});

export default async function AdminBlogPage() {
  const session = await requireAdmin();
  const [categories, posts] = await Promise.all([getBlogCategories(), getBlogPosts(true)]);

  return (
    <AdminShell
      title="Blog"
      description="Crie categorias, publique posts e controle SEO por artigo."
      pathname="/admin/blog"
      userName={session.user.name}
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <AdminCard title="Nova categoria">
          <form action={saveBlogCategoryAction} className="grid gap-4">
            <label className="grid gap-2 text-sm text-slate-600">
              Nome
              <Input name="name" placeholder="Foz do Iguacu" />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Slug
              <Input name="slug" placeholder="foz-do-iguacu" />
            </label>
            <div>
              <SubmitButton>Adicionar categoria</SubmitButton>
            </div>
          </form>
          <div className="mt-6 space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="rounded-2xl border border-brand/10 bg-slate-50 p-4">
                <form action={saveBlogCategoryAction} className="grid gap-4">
                  <input type="hidden" name="id" value={category.id} />
                  <label className="grid gap-2 text-sm text-slate-600">
                    Nome
                    <Input name="name" defaultValue={category.name} />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-600">
                    Slug
                    <Input name="slug" defaultValue={category.slug} />
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <SubmitButton>Salvar categoria</SubmitButton>
                  </div>
                </form>
                <form action={deleteBlogCategoryAction} className="mt-3">
                  <input type="hidden" name="id" value={category.id} />
                  <button type="submit" className="text-sm font-semibold text-red-500">
                    Excluir categoria
                  </button>
                </form>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Novo post">
          <form action={saveBlogPostAction} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-600">
                Titulo
                <Input name="title" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Slug
                <Input name="slug" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Categoria
                <Select name="categoryId" defaultValue="">
                  <option value="">Sem categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Status
                <Select name="status" defaultValue="DRAFT">
                  <option value="DRAFT">Rascunho</option>
                  <option value="PUBLISHED">Publicado</option>
                </Select>
              </label>
            </div>
            <label className="grid gap-2 text-sm text-slate-600">
              Resumo
              <Textarea name="excerpt" className="min-h-24" />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Conteudo em Markdown
              <Textarea name="content" className="min-h-64" />
            </label>
            <UploadField name="featuredImage" label="Imagem destacada" />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-600">
                SEO title
                <Input name="seoTitle" />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                SEO description
                <Textarea name="seoDescription" className="min-h-24" />
              </label>
            </div>
            <div>
              <SubmitButton>Adicionar post</SubmitButton>
            </div>
          </form>
        </AdminCard>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <AdminCard key={post.id} title={post.title} description={`Slug: ${post.slug}`}>
            <form action={saveBlogPostAction} className="grid gap-4">
              <input type="hidden" name="id" value={post.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-600">
                  Titulo
                  <Input name="title" defaultValue={post.title} />
                </label>
                <label className="grid gap-2 text-sm text-slate-600">
                  Slug
                  <Input name="slug" defaultValue={post.slug} />
                </label>
                <label className="grid gap-2 text-sm text-slate-600">
                  Categoria
                  <Select name="categoryId" defaultValue={post.categoryId ?? ""}>
                    <option value="">Sem categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="grid gap-2 text-sm text-slate-600">
                  Status
                  <Select name="status" defaultValue={post.status}>
                    <option value="DRAFT">Rascunho</option>
                    <option value="PUBLISHED">Publicado</option>
                  </Select>
                </label>
              </div>
              <label className="grid gap-2 text-sm text-slate-600">
                Resumo
                <Textarea name="excerpt" className="min-h-24" defaultValue={post.excerpt} />
              </label>
              <label className="grid gap-2 text-sm text-slate-600">
                Conteudo em Markdown
                <Textarea name="content" className="min-h-64" defaultValue={post.content} />
              </label>
              <UploadField name="featuredImage" label="Imagem destacada" defaultValue={post.featuredImage} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-600">
                  SEO title
                  <Input name="seoTitle" defaultValue={post.seoTitle ?? ""} />
                </label>
                <label className="grid gap-2 text-sm text-slate-600">
                  SEO description
                  <Textarea name="seoDescription" className="min-h-24" defaultValue={post.seoDescription ?? ""} />
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                <SubmitButton>Salvar post</SubmitButton>
              </div>
            </form>
            <form action={deleteBlogPostAction} className="mt-4">
              <input type="hidden" name="id" value={post.id} />
              <button type="submit" className="text-sm font-semibold text-red-500">
                Excluir post
              </button>
            </form>
          </AdminCard>
        ))}
      </div>
    </AdminShell>
  );
}
