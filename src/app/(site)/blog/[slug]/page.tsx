import { notFound } from "next/navigation";
import Image from "next/image";
import { RichText } from "@/components/ui/rich-text";
import { getBlogPostBySlug } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Post nao encontrado",
      description: "Conteudo indisponivel.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.featuredImage,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl space-y-10 pt-28">
      <div className="space-y-5">
        {post.category?.name ? (
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/70">
            {post.category.name}
          </p>
        ) : null}
        <h1 className="text-5xl leading-none text-slate-950 md:text-6xl">{post.title}</h1>
        <p className="max-w-3xl text-base leading-8 text-slate-600 md:text-lg">{post.excerpt}</p>
      </div>
      {post.featuredImage ? (
        <div className="relative h-[420px] overflow-hidden rounded-[2rem]">
          <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
        </div>
      ) : null}
      <section className="soft-card rounded-[2rem] p-8 md:p-10">
        <RichText content={post.content} />
      </section>
    </article>
  );
}
