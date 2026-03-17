import {
  deleteBlogCategoryAction,
  deleteBlogPostAction,
  saveBlogCategoryAction,
  saveBlogPostAction,
} from "@/actions/admin";
import { BlogWorkspace } from "@/components/admin/blog/blog-workspace";
import { AdminShell } from "@/components/admin/admin-shell";
import { getBlogCategories, getBlogPosts } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog Admin",
  description: "Gestao editorial completa do blog do Iguassu Express Hotel.",
  path: "/admin/blog",
  noIndex: true,
});

export default async function AdminBlogPage() {
  const session = await requireAdmin();
  const [categories, posts] = await Promise.all([getBlogCategories(), getBlogPosts(true)]);

  const serializedCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    postCount: posts.filter((post) => post.categoryId === category.id).length,
  }));

  const serializedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage ?? null,
    categoryId: post.categoryId ?? null,
    categoryName: post.category?.name ?? null,
    seoTitle: post.seoTitle ?? null,
    seoDescription: post.seoDescription ?? null,
    status: post.status,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt:
      "createdAt" in post && post.createdAt instanceof Date
        ? post.createdAt.toISOString()
        : post.publishedAt?.toISOString() ?? new Date().toISOString(),
    updatedAt:
      "updatedAt" in post && post.updatedAt instanceof Date
        ? post.updatedAt.toISOString()
        : post.publishedAt?.toISOString() ?? new Date().toISOString(),
  }));

  return (
    <AdminShell
      title="Blog"
      description="Biblioteca de conteudos, editor profissional, SEO ao vivo e operacao editorial em um unico fluxo."
      pathname="/admin/blog"
      userName={session.user.name}
    >
      <BlogWorkspace
        categories={serializedCategories}
        posts={serializedPosts}
        saveCategoryAction={saveBlogCategoryAction}
        deleteCategoryAction={deleteBlogCategoryAction}
        savePostAction={saveBlogPostAction}
        deletePostAction={deleteBlogPostAction}
      />
    </AdminShell>
  );
}
