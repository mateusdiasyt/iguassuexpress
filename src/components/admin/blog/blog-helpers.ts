import { BlogPostStatus } from "@prisma/client";
import { absoluteUrl, toSlug } from "@/lib/utils";

export type AdminBlogCategoryItem = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
};

export type AdminBlogPostItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  categoryId: string | null;
  categoryName: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: BlogPostStatus;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
};

export type BlogEditorDraft = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: string;
  seoTitle: string;
  seoDescription: string;
  status: BlogPostStatus;
};

type SeoCheck = {
  label: string;
  passed: boolean;
  detail: string;
  weight: number;
};

export function createEmptyDraft(): BlogEditorDraft {
  return {
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    categoryId: "",
    seoTitle: "",
    seoDescription: "",
    status: BlogPostStatus.DRAFT,
  };
}

export function createDraftFromPost(post: AdminBlogPostItem): BlogEditorDraft {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage ?? "",
    categoryId: post.categoryId ?? "",
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
    status: post.status,
  };
}

export function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(markdown: string) {
  const plain = stripMarkdown(markdown);

  if (!plain) {
    return 0;
  }

  return plain.split(/\s+/).filter(Boolean).length;
}

export function estimateReadingTime(markdown: string) {
  const words = countWords(markdown);
  return Math.max(1, Math.ceil(words / 220));
}

export function countHeadings(markdown: string) {
  const matches = markdown.match(/^#{2,6}\s+.+$/gm);
  return matches?.length ?? 0;
}

export function countLinks(markdown: string) {
  return Array.from(markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)).length;
}

export function buildExcerptFromContent(markdown: string) {
  const plain = stripMarkdown(markdown);

  if (!plain) {
    return "";
  }

  return plain.length > 180 ? `${plain.slice(0, 177).trimEnd()}...` : plain;
}

export function buildSeoDescriptionFromDraft(draft: Pick<BlogEditorDraft, "seoDescription" | "excerpt" | "content">) {
  return draft.seoDescription || draft.excerpt || buildExcerptFromContent(draft.content);
}

export function buildSeoTitleFromDraft(draft: Pick<BlogEditorDraft, "seoTitle" | "title">) {
  return draft.seoTitle || draft.title;
}

export function buildPostUrl(slug: string) {
  return absoluteUrl(`/blog/${slug || "novo-post"}`);
}

export function analyzeSeo(draft: BlogEditorDraft, targetKeyword: string) {
  const title = buildSeoTitleFromDraft(draft);
  const description = buildSeoDescriptionFromDraft(draft);
  const plainContent = stripMarkdown(draft.content).toLowerCase();
  const keyword = targetKeyword.trim().toLowerCase();
  const headings = countHeadings(draft.content);
  const wordCount = countWords(draft.content);
  const generatedSlug = draft.slug || toSlug(draft.title);

  const checks: SeoCheck[] = [
    {
      label: "SEO title calibrado",
      passed: title.length >= 35 && title.length <= 60,
      detail: `${title.length} caracteres. Ideal entre 35 e 60.`,
      weight: 15,
    },
    {
      label: "SEO description forte",
      passed: description.length >= 120 && description.length <= 160,
      detail: `${description.length} caracteres. Ideal entre 120 e 160.`,
      weight: 15,
    },
    {
      label: "Resumo editorial",
      passed: draft.excerpt.trim().length >= 110,
      detail: `${draft.excerpt.trim().length} caracteres no resumo.`,
      weight: 10,
    },
    {
      label: "Profundidade de conteudo",
      passed: wordCount >= 320,
      detail: `${wordCount} palavras no texto.`,
      weight: 15,
    },
    {
      label: "Escaneabilidade",
      passed: headings >= 2,
      detail: `${headings} subtitulos encontrados em Markdown.`,
      weight: 10,
    },
    {
      label: "Categoria definida",
      passed: Boolean(draft.categoryId),
      detail: draft.categoryId ? "Categoria vinculada." : "Selecione uma categoria para agrupar o conteudo.",
      weight: 10,
    },
    {
      label: "Imagem destacada",
      passed: Boolean(draft.featuredImage),
      detail: draft.featuredImage ? "Imagem pronta para listagem e Open Graph." : "Adicione uma imagem para listagem e compartilhamento.",
      weight: 10,
    },
    {
      label: "Slug pronto para indexacao",
      passed: generatedSlug.length >= 8,
      detail: generatedSlug ? `Slug atual: ${generatedSlug}` : "Gere um slug amigavel.",
      weight: 5,
    },
  ];

  if (keyword) {
    checks.push(
      {
        label: "Keyword no titulo",
        passed: title.toLowerCase().includes(keyword),
        detail: "A palavra-chave deve aparecer no titulo principal ou no SEO title.",
        weight: 5,
      },
      {
        label: "Keyword no slug ou resumo",
        passed:
          generatedSlug.toLowerCase().includes(keyword) ||
          draft.excerpt.toLowerCase().includes(keyword),
        detail: "Use a palavra-chave no slug ou no resumo.",
        weight: 5,
      },
      {
        label: "Keyword no corpo",
        passed: plainContent.includes(keyword),
        detail: "Repita a palavra-chave de forma natural ao longo do conteudo.",
        weight: 10,
      },
    );
  }

  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const currentWeight = checks.reduce(
    (sum, check) => sum + (check.passed ? check.weight : 0),
    0,
  );
  const score = totalWeight ? Math.round((currentWeight / totalWeight) * 100) : 0;

  return {
    score,
    checks,
    title,
    description,
    generatedSlug,
    wordCount,
    readingTime: estimateReadingTime(draft.content),
    headingCount: headings,
    linkCount: countLinks(draft.content),
    grade:
      score >= 85
        ? "Excelente"
        : score >= 70
          ? "Bom"
          : score >= 55
            ? "Ajustar"
            : "Fraco",
  };
}
