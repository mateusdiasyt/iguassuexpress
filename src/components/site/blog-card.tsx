import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

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
  className?: string;
};

export function BlogCard({ post, className }: BlogCardProps) {
  const compactExcerpt =
    post.excerpt.length > 82 ? `${post.excerpt.slice(0, 82).trimEnd()}...` : post.excerpt;
  const compactTitle =
    post.title.length > 44 ? `${post.title.slice(0, 44).trimEnd()}...` : post.title;

  return (
    <article className={cn("h-full", className)}>
      <Link
        href={`/blog/${post.slug}`}
        className="group soft-card flex h-full flex-col overflow-hidden rounded-[1.55rem] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.32)] focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 sm:rounded-[1.8rem]"
      >
        <div className="relative h-40 overflow-hidden sm:h-52 lg:h-60">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
            />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col space-y-3 p-4 sm:space-y-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand/75 sm:gap-3 sm:text-xs sm:tracking-[0.22em]">
            {post.category?.name ? <span>{post.category.name}</span> : null}
            {post.publishedAt ? (
              <span className="inline-flex items-center gap-2 text-slate-500">
                <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {format(post.publishedAt, "dd 'de' MMM yyyy", { locale: ptBR })}
              </span>
            ) : null}
          </div>
          <h3 className="min-h-[4.4rem] text-[1.2rem] leading-[1] font-extrabold text-slate-950 transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand sm:min-h-0 sm:text-[1.45rem] md:text-[1.65rem] lg:text-[1.8rem]">
            <span className="sm:hidden">{compactTitle}</span>
            <span className="hidden sm:inline">{post.title}</span>
          </h3>
          <p className="min-h-[6.9rem] text-[0.92rem] leading-6 text-slate-600 sm:min-h-0 sm:text-sm sm:leading-7">
            {compactExcerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
