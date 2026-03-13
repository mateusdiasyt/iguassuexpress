import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type BlogCardProps = {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    featuredImage?: string | null;
    publishedAt?: Date | null;
    category?: {
      name: string;
    } | null;
  };
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="soft-card overflow-hidden rounded-[1.8rem]">
      <div className="relative h-60">
        {post.featuredImage ? (
          <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
        ) : null}
      </div>
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-brand/75">
          {post.category?.name ? <span>{post.category.name}</span> : null}
          {post.publishedAt ? (
            <span className="inline-flex items-center gap-2 text-slate-500">
              <CalendarDays className="h-3.5 w-3.5" />
              {format(post.publishedAt, "dd 'de' MMM yyyy", { locale: ptBR })}
            </span>
          ) : null}
        </div>
        <h3 className="text-3xl leading-none text-slate-950">{post.title}</h3>
        <p className="text-sm leading-7 text-slate-600">{post.excerpt}</p>
        <a
          href={`/blog/${post.slug}`}
          className="inline-flex text-sm font-semibold uppercase tracking-[0.22em] text-brand"
        >
          Ler artigo
        </a>
      </div>
    </article>
  );
}
