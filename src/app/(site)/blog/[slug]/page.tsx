import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, MessageCircle, PhoneCall } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BlogCard } from "@/components/site/blog-card";
import { RichText } from "@/components/ui/rich-text";
import { getBlogPostBySlug, getBlogPosts, getSiteSettings } from "@/data/queries";
import { buildMetadata } from "@/lib/seo";
import { formatPhoneHref, formatWhatsAppHref } from "@/lib/utils";

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
  const [post, allPosts, settings] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts(),
    getSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 180));
  const sections = post.content
    .split(/\r?\n/)
    .filter((line) => /^##\s+/.test(line))
    .map((line) => line.replace(/^##\s+/, "").trim())
    .slice(0, 6);
  const highlights = post.content
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith("- "))
    .map((line) => line.replace(/^\s*-\s+/, "").trim())
    .slice(0, 4);
  const relatedPosts = allPosts
    .filter((item) => item.slug !== post.slug)
    .sort((a, b) => {
      const aSameCategory = a.category?.name === post.category?.name ? 1 : 0;
      const bSameCategory = b.category?.name === post.category?.name ? 1 : 0;
      return bSameCategory - aSameCategory;
    })
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-6xl space-y-10 pt-28">
      <div className="soft-card rounded-[2rem] p-6 md:p-10">
        <Link
          href="/blog"
          className="inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 transition hover:text-brand"
        >
          Voltar para o blog
        </Link>
        <div className="mt-6 space-y-5">
          {post.category?.name ? (
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/70">
              {post.category.name}
            </p>
          ) : null}
          <h1 className="text-[2.3rem] leading-[0.94] text-slate-950 md:text-[3.7rem]">
            {post.title}
          </h1>
          <p className="max-w-4xl text-base leading-8 text-slate-600 md:text-lg">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {post.publishedAt ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white/80 px-3 py-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-brand/80" />
                {format(post.publishedAt, "dd 'de' MMM yyyy", { locale: ptBR })}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white/80 px-3 py-1.5">
              <Clock3 className="h-3.5 w-3.5 text-brand/80" />
              {readingTime} min de leitura
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-8">
          {post.featuredImage ? (
            <div className="relative h-[420px] overflow-hidden rounded-[2rem]">
              <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
            </div>
          ) : null}

          <section className="soft-card rounded-[2rem] p-8 md:p-10">
            <RichText content={post.content} />
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28">
          <div className="soft-card rounded-[1.6rem] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand/70">
              Reserve direto
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Fale agora com nossa equipe e garanta a melhor tarifa para sua estada.
            </p>
            <div className="mt-4 grid gap-2">
              <a
                href={formatWhatsAppHref(settings.whatsapp, `Olá! Vi o artigo "${post.title}" e quero reservar.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={formatPhoneHref(settings.phone)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand/20 bg-white px-4 text-sm font-semibold text-brand transition hover:bg-brand/5"
              >
                <PhoneCall className="h-4 w-4" />
                Ligar
              </a>
            </div>
          </div>

          {sections.length ? (
            <div className="soft-card rounded-[1.6rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand/70">
                Neste artigo
              </p>
              <ul className="mt-4 space-y-2">
                {sections.map((section) => (
                  <li key={section} className="text-sm leading-7 text-slate-600">
                    {section}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {highlights.length ? (
            <div className="soft-card rounded-[1.6rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand/70">
                Pontos-chave
              </p>
              <ul className="mt-4 space-y-2">
                {highlights.map((highlight) => (
                  <li key={highlight} className="text-sm leading-7 text-slate-600">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      {relatedPosts.length ? (
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand/70">
              Continue lendo
            </p>
            <h2 className="text-[2rem] leading-[0.95] text-slate-950 md:text-[2.6rem]">
              Artigos relacionados
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {relatedPosts.map((item) => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
