"use client";

import { BlogPostStatus } from "@prisma/client";
import {
  BookOpenText,
  Eye,
  FilePenLine,
  FolderTree,
  Heading2,
  Heading3,
  ImagePlus,
  Link2,
  List,
  MessageSquareQuote,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import { startTransition, useDeferredValue, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AdminCard } from "@/components/admin/admin-card";
import {
  analyzeSeo,
  buildExcerptFromContent,
  buildPostUrl,
  buildSeoDescriptionFromDraft,
  countWords,
  createDraftFromPost,
  createEmptyDraft,
  type AdminBlogCategoryItem,
  type AdminBlogPostItem,
  type BlogEditorDraft,
} from "@/components/admin/blog/blog-helpers";
import { UploadField } from "@/components/admin/upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { toSlug } from "@/lib/utils";

type ActionFn = (formData: FormData) => void | Promise<void>;

type BlogWorkspaceProps = {
  categories: AdminBlogCategoryItem[];
  posts: AdminBlogPostItem[];
  saveCategoryAction: ActionFn;
  deleteCategoryAction: ActionFn;
  savePostAction: ActionFn;
  deletePostAction: ActionFn;
};

const editorBlocks = [
  {
    label: "H2",
    icon: Heading2,
    snippet: "\n## Novo subtitulo\nExplique o ponto principal desta secao.\n",
  },
  {
    label: "H3",
    icon: Heading3,
    snippet: "\n### Detalhe importante\nDesenvolva um subtitulo secundario.\n",
  },
  {
    label: "Lista",
    icon: List,
    snippet: "\n- Beneficio principal\n- Diferencial do hotel\n- CTA contextual\n",
  },
  {
    label: "Link",
    icon: Link2,
    snippet: "\n[Veja mais sobre Foz do Iguacu](/blog)\n",
  },
  {
    label: "Citacao",
    icon: MessageSquareQuote,
    snippet: "\n> Destaque uma frase memoravel ou dado relevante para a leitura.\n",
  },
];

function formatDate(value: string | null) {
  if (!value) {
    return "Ainda nao publicado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: BlogPostStatus }) {
  return (
    <span
      className={
        status === BlogPostStatus.PUBLISHED
          ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700"
          : "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700"
      }
    >
      {status === BlogPostStatus.PUBLISHED ? "Publicado" : "Rascunho"}
    </span>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-brand/10 bg-white p-5 shadow-sm">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold leading-none text-slate-950">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  );
}

export function BlogWorkspace({
  categories,
  posts,
  saveCategoryAction,
  deleteCategoryAction,
  savePostAction,
  deletePostAction,
}: BlogWorkspaceProps) {
  const firstPost = posts[0];
  const [selectedId, setSelectedId] = useState(firstPost?.id ?? "new");
  const [draft, setDraft] = useState<BlogEditorDraft>(
    firstPost ? createDraftFromPost(firstPost) : createEmptyDraft(),
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | BlogPostStatus>("ALL");
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");
  const [targetKeyword, setTargetKeyword] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const deferredSearch = useDeferredValue(search);
  const deferredContent = useDeferredValue(draft.content);

  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === "ALL" || post.status === statusFilter;
    const haystack =
      `${post.title} ${post.slug} ${post.excerpt} ${post.categoryName ?? ""}`.toLowerCase();
    const matchesSearch = haystack.includes(deferredSearch.trim().toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const seo = analyzeSeo(draft, targetKeyword);
  const averageSeo = posts.length
    ? Math.round(
        posts.reduce(
          (sum, post) => sum + analyzeSeo(createDraftFromPost(post), "").score,
          0,
        ) / posts.length,
      )
    : 0;
  const publishedCount = posts.filter((post) => post.status === BlogPostStatus.PUBLISHED).length;
  const draftCount = posts.length - publishedCount;

  function selectPost(postId: string) {
    if (postId === "new") {
      startTransition(() => {
        setSelectedId("new");
        setDraft(createEmptyDraft());
        setTargetKeyword("");
        setEditorTab("write");
      });

      return;
    }

    const post = posts.find((item) => item.id === postId);

    if (!post) {
      return;
    }

    startTransition(() => {
      setSelectedId(post.id);
      setDraft(createDraftFromPost(post));
      setTargetKeyword("");
      setEditorTab("write");
    });
  }

  function updateDraft<Key extends keyof BlogEditorDraft>(field: Key, value: BlogEditorDraft[Key]) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function insertSnippet(snippet: string) {
    const textarea = textareaRef.current;

    if (!textarea) {
      updateDraft("content", `${draft.content}${snippet}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextContent = `${draft.content.slice(0, start)}${snippet}${draft.content.slice(end)}`;

    updateDraft("content", nextContent);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + snippet.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  function generateSlug() {
    updateDraft("slug", toSlug(draft.title));
  }

  function extractExcerpt() {
    updateDraft("excerpt", buildExcerptFromContent(draft.content));
  }

  function fillSeoFields() {
    setDraft((current) => ({
      ...current,
      slug: current.slug || toSlug(current.title),
      seoTitle: current.seoTitle || current.title,
      seoDescription: current.seoDescription || buildSeoDescriptionFromDraft(current),
    }));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Conteudos"
          value={String(posts.length)}
          detail="Biblioteca editorial completa para organizar todos os artigos."
        />
        <MetricCard
          label="Publicados"
          value={String(publishedCount)}
          detail="Posts visiveis no site e prontos para captacao organica."
        />
        <MetricCard
          label="Rascunhos"
          value={String(draftCount)}
          detail="Textos em evolucao aguardando revisao, SEO e publicacao."
        />
        <MetricCard
          label="SEO medio"
          value={`${averageSeo}/100`}
          detail="Media atual da biblioteca com base nas boas praticas do editor."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <AdminCard
            title="Conteudos"
            description="Liste, filtre e abra qualquer post sem se perder em formularios longos."
          >
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="pl-10"
                    placeholder="Buscar por titulo, slug ou categoria"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </label>
                <div className="flex flex-col gap-3 md:flex-row">
                  <Select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as "ALL" | BlogPostStatus)
                    }
                  >
                    <option value="ALL">Todos os status</option>
                    <option value={BlogPostStatus.PUBLISHED}>Publicados</option>
                    <option value={BlogPostStatus.DRAFT}>Rascunhos</option>
                  </Select>
                  <Button
                    type="button"
                    className="gap-2"
                    variant="outline"
                    onClick={() => selectPost("new")}
                  >
                    <Plus className="h-4 w-4" />
                    Novo post
                  </Button>
                </div>
              </div>

              <div className="max-h-[38rem] space-y-3 overflow-y-auto pr-1">
                {filteredPosts.map((post) => {
                  const postSeo = analyzeSeo(createDraftFromPost(post), "");

                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => selectPost(post.id)}
                      className={
                        selectedId === post.id
                          ? "w-full rounded-[1.4rem] border border-brand bg-brand/[0.08] p-4 text-left shadow-sm transition"
                          : "w-full rounded-[1.4rem] border border-brand/10 bg-slate-50/80 p-4 text-left transition hover:border-brand/30 hover:bg-white"
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold text-slate-950">
                            {post.title}
                          </p>
                          <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-slate-400">
                            /blog/{post.slug}
                          </p>
                        </div>
                        <StatusBadge status={post.status} />
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-600">
                          SEO {postSeo.score}
                        </span>
                        <span>{post.categoryName ?? "Sem categoria"}</span>
                        <span>/</span>
                        <span>{formatDate(post.updatedAt)}</span>
                      </div>
                    </button>
                  );
                })}

                {!filteredPosts.length ? (
                  <div className="rounded-[1.4rem] border border-dashed border-brand/15 bg-slate-50 px-4 py-8 text-sm leading-7 text-slate-500">
                    Nenhum conteudo encontrado com esse filtro.
                  </div>
                ) : null}
              </div>
            </div>
          </AdminCard>

          <AdminCard
            title="Categorias"
            description="Organize o blog por temas e mantenha a navegacao editorial consistente."
          >
            <div className="space-y-4">
              <form action={saveCategoryAction} className="grid gap-3 rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4">
                <div className="grid gap-3">
                  <Input name="name" placeholder="Nova categoria" />
                  <Input name="slug" placeholder="slug-da-categoria" />
                </div>
                <SubmitButton className="w-full">Criar categoria</SubmitButton>
              </form>

              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-[1.4rem] border border-brand/10 bg-white p-4"
                  >
                    <form action={saveCategoryAction} className="grid gap-3">
                      <input type="hidden" name="id" value={category.id} />
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand/70">
                          {category.postCount} posts
                        </p>
                        <FolderTree className="h-4 w-4 text-brand/60" />
                      </div>
                      <Input name="name" defaultValue={category.name} />
                      <Input name="slug" defaultValue={category.slug} />
                      <div className="flex gap-3">
                        <SubmitButton className="flex-1">Salvar</SubmitButton>
                        <Button
                          className="gap-2 px-4 text-red-600 hover:bg-red-50"
                          formAction={deleteCategoryAction}
                          name="id"
                          type="submit"
                          value={category.id}
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </AdminCard>
        </div>

        <form action={savePostAction} className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <AdminCard
            title={draft.id ? "Editar post" : "Novo post"}
            description="Editor completo com estrutura editorial, Markdown, imagem, SEO e controle de publicacao."
            className="h-full"
          >
            <input name="id" type="hidden" value={draft.id} />

            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-[1.6rem] border border-brand/10 bg-slate-50/80 p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={draft.status} />
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      SEO {seo.score} / {seo.grade}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-500">
                    {draft.id
                      ? `Ultima edicao: ${formatDate(posts.find((post) => post.id === draft.id)?.updatedAt ?? null)}`
                      : "Rascunho novo, pronto para comecar a escrever."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="outline" onClick={() => selectPost("new")}>
                    Limpar editor
                  </Button>
                  {draft.id ? (
                    <Button className="gap-2 text-red-600 hover:bg-red-50" formAction={deletePostAction} variant="outline">
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </Button>
                  ) : null}
                  <SubmitButton>Salvar post</SubmitButton>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-600">
                  Titulo do artigo
                  <Input
                    name="title"
                    placeholder="Ex.: Onde ficar em Foz do Iguacu perto do aeroporto"
                    value={draft.title}
                    onChange={(event) => updateDraft("title", event.target.value)}
                  />
                </label>

                <div className="grid gap-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <span>Slug</span>
                    <button
                      type="button"
                      className="text-xs font-semibold uppercase tracking-[0.18em] text-brand"
                      onClick={generateSlug}
                    >
                      Gerar automatico
                    </button>
                  </div>
                  <Input
                    name="slug"
                    placeholder="slug-do-post"
                    value={draft.slug}
                    onChange={(event) => updateDraft("slug", event.target.value)}
                  />
                </div>

                <label className="grid gap-2 text-sm text-slate-600">
                  Categoria
                  <Select
                    name="categoryId"
                    value={draft.categoryId}
                    onChange={(event) => updateDraft("categoryId", event.target.value)}
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </label>

                <label className="grid gap-2 text-sm text-slate-600">
                  Status de publicacao
                  <Select
                    name="status"
                    value={draft.status}
                    onChange={(event) =>
                      updateDraft("status", event.target.value as BlogPostStatus)
                    }
                  >
                    <option value={BlogPostStatus.DRAFT}>Rascunho</option>
                    <option value={BlogPostStatus.PUBLISHED}>Publicado</option>
                  </Select>
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <label className="grid gap-2 text-sm text-slate-600">
                  Resumo do artigo
                  <Textarea
                    name="excerpt"
                    className="min-h-32"
                    placeholder="Resumo enxuto e convincente para a listagem do blog."
                    value={draft.excerpt}
                    onChange={(event) => updateDraft("excerpt", event.target.value)}
                  />
                </label>

                <div className="rounded-[1.6rem] border border-brand/10 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand/70">
                    Acoes rapidas
                  </p>
                  <div className="mt-4 grid gap-3">
                    <Button type="button" variant="outline" className="justify-start gap-2" onClick={extractExcerpt}>
                      <Sparkles className="h-4 w-4" />
                      Extrair resumo do texto
                    </Button>
                    <Button type="button" variant="outline" className="justify-start gap-2" onClick={fillSeoFields}>
                      <Tag className="h-4 w-4" />
                      Preencher campos SEO
                    </Button>
                    <a
                      className="inline-flex h-11 items-center justify-center rounded-full border border-brand/20 bg-white px-5 text-sm font-semibold uppercase tracking-[0.16em] text-brand transition hover:bg-brand/5"
                      href={buildPostUrl(seo.generatedSlug)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Abrir URL final
                    </a>
                  </div>
                </div>
              </div>

              <UploadField
                defaultValue={draft.featuredImage}
                key={draft.id || "new-upload"}
                label="Imagem destacada"
                name="featuredImage"
                onValueChange={(value) => updateDraft("featuredImage", value)}
                value={draft.featuredImage}
              />
              
              <div className="space-y-3">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Conteudo em Markdown</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Use blocos prontos para acelerar a escrita e mantenha o texto escaneavel.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editorBlocks.map((tool) => {
                      const Icon = tool.icon;

                      return (
                        <Button
                          key={tool.label}
                          type="button"
                          className="gap-2 px-4 tracking-[0.08em]"
                          onClick={() => insertSnippet(tool.snippet)}
                          variant="outline"
                        >
                          <Icon className="h-4 w-4" />
                          {tool.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.8rem] border border-brand/10 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-brand/10 bg-slate-50/80 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      <span>{countWords(draft.content)} palavras</span>
                      <span>/</span>
                      <span>{seo.readingTime} min de leitura</span>
                      <span>/</span>
                      <span>{seo.headingCount} headings</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={
                          editorTab === "write"
                            ? "rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                            : "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:bg-slate-100"
                        }
                        onClick={() => setEditorTab("write")}
                      >
                        Escrever
                      </button>
                      <button
                        type="button"
                        className={
                          editorTab === "preview"
                            ? "rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                            : "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:bg-slate-100"
                        }
                        onClick={() => setEditorTab("preview")}
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  {editorTab === "write" ? (
                    <textarea
                      ref={textareaRef}
                      className="min-h-[28rem] w-full resize-y border-0 bg-white px-5 py-4 text-sm leading-7 text-slate-900 outline-none"
                      name="content"
                      placeholder="Escreva o artigo em Markdown..."
                      value={draft.content}
                      onChange={(event) => updateDraft("content", event.target.value)}
                    />
                  ) : (
                    <div className="editorial-prose min-h-[28rem] px-5 py-6">
                      {deferredContent.trim() ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{deferredContent}</ReactMarkdown>
                      ) : (
                        <div className="flex min-h-[22rem] items-center justify-center rounded-[1.6rem] border border-dashed border-brand/15 bg-slate-50 text-sm leading-7 text-slate-500">
                          O preview aparece aqui assim que voce comecar a escrever.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-600">
                  SEO title
                  <Input
                    name="seoTitle"
                    placeholder="Titulo otimizado para o Google"
                    value={draft.seoTitle}
                    onChange={(event) => updateDraft("seoTitle", event.target.value)}
                  />
                </label>
                <label className="grid gap-2 text-sm text-slate-600">
                  SEO description
                  <Textarea
                    name="seoDescription"
                    className="min-h-28"
                    placeholder="Descricao que aparece nos resultados de busca"
                    value={draft.seoDescription}
                    onChange={(event) => updateDraft("seoDescription", event.target.value)}
                  />
                </label>
              </div>
            </div>
          </AdminCard>

          <div className="space-y-6">
            <AdminCard title="SEO ao vivo" description="Auditoria instantanea para publicar com mais seguranca.">
              <div className="space-y-5">
                <div className="rounded-[1.6rem] border border-brand/10 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand/70">
                        Score
                      </p>
                      <p className="mt-3 text-4xl font-semibold leading-none text-slate-950">
                        {seo.score}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                      {seo.grade}
                    </span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-brand transition-all duration-500"
                      style={{ width: `${seo.score}%` }}
                    />
                  </div>
                </div>

                <label className="grid gap-2 text-sm text-slate-600">
                  Palavra-chave foco
                  <Input
                    placeholder="Ex.: hotel em Foz do Iguacu"
                    value={targetKeyword}
                    onChange={(event) => setTargetKeyword(event.target.value)}
                  />
                </label>

                <div className="space-y-3">
                  {seo.checks.map((check) => (
                    <div
                      key={check.label}
                      className={
                        check.passed
                          ? "rounded-[1.2rem] border border-emerald-100 bg-emerald-50/80 p-4"
                          : "rounded-[1.2rem] border border-amber-100 bg-amber-50/80 p-4"
                      }
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">{check.label}</p>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {check.weight} pts
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{check.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AdminCard>

            <AdminCard title="Preview SERP" description="Como o post tende a aparecer no Google.">
              <div className="space-y-4 rounded-[1.6rem] border border-brand/10 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Resultado organico</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Previa de indexacao
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-brand/10 bg-white p-4">
                  <p className="truncate text-xs text-emerald-700">{buildPostUrl(seo.generatedSlug)}</p>
                  <p className="mt-2 text-xl font-semibold leading-7 text-brand">
                    {seo.title || "Titulo do artigo"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {seo.description || "A descricao SEO aparecera aqui conforme voce editar o post."}
                  </p>
                </div>
              </div>
            </AdminCard>

            <AdminCard title="Ferramentas de escrita" description="Sinais editoriais para manter o texto forte.">
              <div className="grid gap-3">
                <div className="rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <BookOpenText className="h-5 w-5 text-brand" />
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{seo.wordCount} palavras</p>
                      <p className="text-sm text-slate-500">Volume atual do conteudo.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-brand" />
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{seo.readingTime} min de leitura</p>
                      <p className="text-sm text-slate-500">Tempo estimado para o visitante.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <FilePenLine className="h-5 w-5 text-brand" />
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{seo.headingCount} subtitulos</p>
                      <p className="text-sm text-slate-500">Ajuda a leitura e o SEO semantico.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <ImagePlus className="h-5 w-5 text-brand" />
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {draft.featuredImage ? "Imagem pronta" : "Sem imagem"}
                      </p>
                      <p className="text-sm text-slate-500">Imagem destacada e Open Graph do artigo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </AdminCard>
          </div>
        </form>
      </div>
    </div>
  );
}
