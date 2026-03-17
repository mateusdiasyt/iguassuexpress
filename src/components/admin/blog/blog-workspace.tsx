"use client";

import { BlogPostStatus } from "@prisma/client";
import {
  Heading2,
  Heading3,
  Link2,
  List,
  MessageSquareQuote,
  PencilLine,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { startTransition, useDeferredValue, useMemo, useRef, useState } from "react";
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

type EditorMode = "closed" | "create" | "edit";

const editorBlocks = [
  {
    label: "H2",
    icon: Heading2,
    snippet: "\n## Novo subtitulo\nDesenvolva uma secao clara para o leitor.\n",
  },
  {
    label: "H3",
    icon: Heading3,
    snippet: "\n### Detalhe importante\nExplique um ponto de apoio para a leitura.\n",
  },
  {
    label: "Lista",
    icon: List,
    snippet: "\n- Ponto principal\n- Diferencial do hotel\n- Chamada para reserva\n",
  },
  {
    label: "Link interno",
    icon: Link2,
    snippet: "\n[Veja mais conteudos](/blog)\n",
  },
  {
    label: "Citacao",
    icon: MessageSquareQuote,
    snippet: "\n> Frase de impacto para reforcar a mensagem.\n",
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
  const classes =
    status === BlogPostStatus.PUBLISHED
      ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700"
      : "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700";

  return (
    <span className={classes}>
      {status === BlogPostStatus.PUBLISHED ? "Publicado" : "Rascunho"}
    </span>
  );
}

function ScorePill({ score }: { score: number }) {
  const tone =
    score >= 85
      ? "bg-emerald-100 text-emerald-700"
      : score >= 65
        ? "bg-amber-100 text-amber-700"
        : "bg-rose-100 text-rose-700";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${tone}`}
    >
      SEO {score}
    </span>
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
  const [editorMode, setEditorMode] = useState<EditorMode>("closed");
  const [selectedId, setSelectedId] = useState<string>("");
  const [draft, setDraft] = useState<BlogEditorDraft>(createEmptyDraft());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | BlogPostStatus>("ALL");
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [confirmDeletePost, setConfirmDeletePost] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const deferredSearch = useDeferredValue(search);
  const deferredContent = useDeferredValue(draft.content);

  const publishedCount = posts.filter(
    (post) => post.status === BlogPostStatus.PUBLISHED,
  ).length;
  const draftCount = posts.length - publishedCount;

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesStatus = statusFilter === "ALL" || post.status === statusFilter;
        const haystack =
          `${post.title} ${post.slug} ${post.excerpt} ${post.categoryName ?? ""}`.toLowerCase();
        const matchesSearch = haystack.includes(deferredSearch.trim().toLowerCase());

        return matchesStatus && matchesSearch;
      }),
    [posts, statusFilter, deferredSearch],
  );

  const selectedPost = posts.find((post) => post.id === selectedId) ?? null;
  const seo = analyzeSeo(draft, targetKeyword);
  const isEditorOpen = editorMode !== "closed";
  const submitLabel =
    draft.status === BlogPostStatus.PUBLISHED ? "Publicar post" : "Salvar rascunho";

  function openCreate() {
    startTransition(() => {
      setEditorMode("create");
      setSelectedId("");
      setDraft(createEmptyDraft());
      setTargetKeyword("");
      setEditorTab("write");
      setConfirmDeletePost(false);
    });
  }

  function openEdit(postId: string) {
    const post = posts.find((item) => item.id === postId);

    if (!post) {
      return;
    }

    startTransition(() => {
      setEditorMode("edit");
      setSelectedId(post.id);
      setDraft(createDraftFromPost(post));
      setTargetKeyword("");
      setEditorTab("write");
      setConfirmDeletePost(false);
    });
  }

  function closeEditor() {
    startTransition(() => {
      setEditorMode("closed");
      setSelectedId("");
      setDraft(createEmptyDraft());
      setTargetKeyword("");
      setEditorTab("write");
      setConfirmDeletePost(false);
    });
  }

  function updateDraft<Key extends keyof BlogEditorDraft>(
    field: Key,
    value: BlogEditorDraft[Key],
  ) {
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
    <>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-6">
        <AdminCard
          title="Conteudos"
          description="Biblioteca minimalista. Abra o editor somente quando quiser criar ou editar."
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <label className="relative block flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-10"
                  placeholder="Buscar por titulo, slug ou categoria"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <Button
                type="button"
                className="h-11 gap-2 normal-case tracking-normal"
                onClick={openCreate}
              >
                <Plus className="h-4 w-4" />
                Novo post
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={
                  statusFilter === "ALL"
                    ? "rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                    : "rounded-full border border-brand/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:border-brand/35"
                }
                onClick={() => setStatusFilter("ALL")}
              >
                Todos ({posts.length})
              </button>
              <button
                type="button"
                className={
                  statusFilter === BlogPostStatus.PUBLISHED
                    ? "rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                    : "rounded-full border border-brand/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:border-brand/35"
                }
                onClick={() => setStatusFilter(BlogPostStatus.PUBLISHED)}
              >
                Publicados ({publishedCount})
              </button>
              <button
                type="button"
                className={
                  statusFilter === BlogPostStatus.DRAFT
                    ? "rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                    : "rounded-full border border-brand/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:border-brand/35"
                }
                onClick={() => setStatusFilter(BlogPostStatus.DRAFT)}
              >
                Rascunhos ({draftCount})
              </button>
            </div>

            <div className="overflow-hidden rounded-[1.4rem] border border-brand/10">
              <div className="overflow-x-auto">
                <div className="min-w-[860px]">
                  <div className="hidden grid-cols-[minmax(260px,1fr)_140px_120px_96px_130px_90px] gap-4 border-b border-brand/10 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 lg:grid">
                    <span className="truncate">Titulo</span>
                    <span className="truncate">Categoria</span>
                    <span className="truncate">Status</span>
                    <span className="truncate">SEO</span>
                    <span className="truncate">Atualizado</span>
                    <span className="truncate">Acoes</span>
                  </div>

                  <div className="divide-y divide-brand/10">
                    {filteredPosts.map((post) => {
                      const score = analyzeSeo(createDraftFromPost(post), "").score;

                      return (
                        <div key={post.id} className="px-4 py-4">
                          <div className="hidden grid-cols-[minmax(260px,1fr)_140px_120px_96px_130px_90px] items-center gap-4 lg:grid">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">{post.title}</p>
                              <p className="truncate text-xs text-slate-500">/blog/{post.slug}</p>
                            </div>
                            <p className="truncate text-sm text-slate-600">{post.categoryName ?? "Sem categoria"}</p>
                            <div className="flex items-center">
                              <StatusBadge status={post.status} />
                            </div>
                            <div className="flex items-center">
                              <ScorePill score={score} />
                            </div>
                            <p className="text-sm text-slate-600">{formatDate(post.updatedAt)}</p>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-9 gap-1 px-3 normal-case tracking-normal"
                              onClick={() => openEdit(post.id)}
                            >
                              <PencilLine className="h-3.5 w-3.5" />
                              Editar
                            </Button>
                          </div>

                          <div className="space-y-3 lg:hidden">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{post.title}</p>
                              <p className="text-xs text-slate-500">/blog/{post.slug}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge status={post.status} />
                              <ScorePill score={score} />
                              <span className="text-xs text-slate-500">{post.categoryName ?? "Sem categoria"}</span>
                              <span className="text-xs text-slate-400">/</span>
                              <span className="text-xs text-slate-500">{formatDate(post.updatedAt)}</span>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-9 gap-1 px-3 normal-case tracking-normal"
                              onClick={() => openEdit(post.id)}
                            >
                              <PencilLine className="h-3.5 w-3.5" />
                              Editar
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    {!filteredPosts.length ? (
                      <div className="px-4 py-10 text-sm text-slate-500">
                        Nenhum conteudo encontrado para esse filtro.
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminCard>

      </div>

      {isEditorOpen ? (
        <div
          className="fixed inset-0 z-50 bg-slate-950/45 px-3 py-4 backdrop-blur-[2px] md:px-6 md:py-8"
          onClick={closeEditor}
        >
          <div
            className="mx-auto max-h-[94vh] w-full max-w-[1180px] overflow-y-auto rounded-[1.8rem] border border-brand/15 bg-slate-50 p-4 shadow-2xl md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <form action={savePostAction} className="space-y-6">
          <input name="id" type="hidden" value={draft.id} />

          <AdminCard
            title={editorMode === "create" ? "Novo post" : "Editar post"}
            description="Editor em popup amplo para escrever e revisar o conteudo com mais conforto."
          >
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-brand/10 bg-slate-50 p-3">
                <div className="flex items-center gap-2">
                  <StatusBadge status={draft.status} />
                  <ScorePill score={seo.score} />
                  {editorMode === "edit" ? (
                    <span className="text-xs text-slate-500">
                      {formatDate(selectedPost?.updatedAt ?? null)}
                    </span>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 gap-1 px-3 normal-case tracking-normal"
                  onClick={closeEditor}
                >
                  <X className="h-3.5 w-3.5" />
                  Fechar editor
                </Button>
              </div>

              <label className="grid gap-2 text-sm text-slate-600">
                Titulo do artigo
                <Input
                  name="title"
                  placeholder="Ex.: Onde ficar em Foz do Iguacu com localizacao estrategica"
                  value={draft.title}
                  onChange={(event) => updateDraft("title", event.target.value)}
                />
              </label>

              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
                <label className="grid gap-2 text-sm text-slate-600">
                  Slug
                  <Input
                    name="slug"
                    placeholder="slug-do-post"
                    value={draft.slug}
                    onChange={(event) => updateDraft("slug", event.target.value)}
                  />
                </label>
                <div className="grid gap-2 text-sm text-slate-600">
                  <span className="opacity-0 select-none">acao</span>
                  <Button
                    type="button"
                    className="h-10 normal-case tracking-normal"
                    variant="outline"
                    onClick={generateSlug}
                  >
                    Gerar
                  </Button>
                </div>
              </div>

              <label className="grid gap-2 text-sm text-slate-600">
                Resumo
                <Textarea
                  name="excerpt"
                  className="min-h-24"
                  placeholder="Resumo enxuto e atrativo do artigo."
                  value={draft.excerpt}
                  onChange={(event) => updateDraft("excerpt", event.target.value)}
                />
              </label>
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 normal-case tracking-normal"
                onClick={extractExcerpt}
              >
                <Sparkles className="h-4 w-4" />
                Extrair resumo do conteudo
              </Button>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editorBlocks.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Button
                        key={tool.label}
                        type="button"
                        variant="outline"
                        className="h-9 gap-2 px-3 normal-case tracking-normal"
                        onClick={() => insertSnippet(tool.snippet)}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {tool.label}
                      </Button>
                    );
                  })}
                </div>

                <div className="overflow-hidden rounded-[1.2rem] border border-brand/10">
                  <div className="flex items-center justify-between border-b border-brand/10 bg-slate-50 px-3 py-2">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {countWords(draft.content)} palavras / {seo.readingTime} min
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={
                          editorTab === "write"
                            ? "rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white"
                            : "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 hover:bg-slate-100"
                        }
                        onClick={() => setEditorTab("write")}
                      >
                        Escrever
                      </button>
                      <button
                        type="button"
                        className={
                          editorTab === "preview"
                            ? "rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white"
                            : "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 hover:bg-slate-100"
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
                      name="content"
                      className="min-h-[28rem] w-full resize-y border-0 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none"
                      placeholder="Escreva o artigo em Markdown..."
                      value={draft.content}
                      onChange={(event) => updateDraft("content", event.target.value)}
                    />
                  ) : (
                    <div className="editorial-prose min-h-[28rem] px-4 py-4">
                      {deferredContent.trim() ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{deferredContent}</ReactMarkdown>
                      ) : (
                        <p className="text-sm text-slate-500">
                          O preview aparece aqui assim que voce comecar a escrever.
                        </p>
                      )}
                    </div>
                  )}
                </div>
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
                Status
                <Select
                  name="status"
                  value={draft.status}
                  onChange={(event) => updateDraft("status", event.target.value as BlogPostStatus)}
                >
                  <option value={BlogPostStatus.DRAFT}>Rascunho</option>
                  <option value={BlogPostStatus.PUBLISHED}>Publicado</option>
                </Select>
              </label>

              <UploadField
                name="featuredImage"
                label="Imagem destacada"
                value={draft.featuredImage}
                defaultValue={draft.featuredImage}
                uploadStrategy="server"
                onValueChange={(value) => updateDraft("featuredImage", value)}
              />

              <label className="grid gap-2 text-sm text-slate-600">
                Palavra-chave foco
                <Input
                  placeholder="Ex.: hotel em Foz do Iguacu"
                  value={targetKeyword}
                  onChange={(event) => setTargetKeyword(event.target.value)}
                />
              </label>
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 normal-case tracking-normal"
                onClick={fillSeoFields}
              >
                <Tag className="h-4 w-4" />
                Preencher campos SEO
              </Button>

              <label className="grid gap-2 text-sm text-slate-600">
                SEO title
                <Input
                  name="seoTitle"
                  placeholder="Titulo otimizado para busca"
                  value={draft.seoTitle}
                  onChange={(event) => updateDraft("seoTitle", event.target.value)}
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-600">
                SEO description
                <Textarea
                  name="seoDescription"
                  className="min-h-20"
                  placeholder="Descricao para resultados do Google"
                  value={draft.seoDescription}
                  onChange={(event) => updateDraft("seoDescription", event.target.value)}
                />
              </label>

              <div className="rounded-[1.2rem] border border-brand/10 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand/70">
                    Score SEO
                  </p>
                  <p className="text-sm font-semibold text-slate-700">{seo.score}/100</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${seo.score}%` }} />
                </div>
              </div>

              <a
                className="inline-flex h-10 items-center justify-center rounded-full border border-brand/20 bg-white px-4 text-sm font-semibold text-brand transition hover:bg-brand/5"
                href={buildPostUrl(seo.generatedSlug)}
                rel="noreferrer"
                target="_blank"
              >
                Abrir URL final
              </a>

              <div className="grid gap-3">
                <SubmitButton className="h-10 w-full normal-case tracking-normal">
                  {submitLabel}
                </SubmitButton>

                {editorMode === "edit" && draft.id ? (
                  confirmDeletePost ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        className="h-10 gap-2 text-red-600 normal-case tracking-normal hover:bg-red-50"
                        formAction={deletePostAction}
                        variant="outline"
                      >
                        <Trash2 className="h-4 w-4" />
                        Confirmar
                      </Button>
                      <Button
                        type="button"
                        className="h-10 normal-case tracking-normal"
                        onClick={() => setConfirmDeletePost(false)}
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      className="h-10 w-full gap-2 text-red-600 normal-case tracking-normal hover:bg-red-50"
                      onClick={() => setConfirmDeletePost(true)}
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir post
                    </Button>
                  )
                ) : null}
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Checklist SEO" description="Feedback rapido de qualidade para publicar com seguranca.">
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {seo.checks.map((check) => (
                <div
                  key={check.label}
                  className={
                    check.passed
                      ? "rounded-[1rem] border border-emerald-100 bg-emerald-50/70 p-3"
                      : "rounded-[1rem] border border-amber-100 bg-amber-50/70 p-3"
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{check.label}</p>
                    <span className="text-xs uppercase tracking-[0.12em] text-slate-500">
                      {check.weight} pts
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-6 text-slate-500">{check.detail}</p>
                </div>
              ))}
            </div>
          </AdminCard>
            </form>
          </div>
        </div>
      ) : (
        <aside className="space-y-6">
          <AdminCard
            title="Dados do blog"
            description="Visao rapida para acompanhar o estado editorial."
          >
            <div className="grid gap-3">
              <div className="rounded-[1rem] border border-brand/10 bg-slate-50 p-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand/70">
                  Total de posts
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{posts.length}</p>
              </div>
              <div className="rounded-[1rem] border border-brand/10 bg-slate-50 p-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand/70">
                  Publicados
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{publishedCount}</p>
              </div>
              <div className="rounded-[1rem] border border-brand/10 bg-slate-50 p-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand/70">
                  Rascunhos
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{draftCount}</p>
              </div>
            </div>
          </AdminCard>

          <AdminCard
            title="Categorias"
            description="Coluna compacta e minimalista para manter categorias."
          >
            <div className="space-y-4">
              <form
                action={saveCategoryAction}
                className="grid gap-3 rounded-[1rem] border border-brand/10 bg-slate-50 p-3"
              >
                <Input className="h-10" name="name" placeholder="Nova categoria" />
                <Input className="h-10" name="slug" placeholder="slug-da-categoria" />
                <SubmitButton className="h-10 w-full normal-case tracking-normal">
                  Criar categoria
                </SubmitButton>
              </form>

              <div className="overflow-hidden rounded-[1rem] border border-brand/10">
                {categories.map((category, index) => (
                  <form
                    key={category.id}
                    action={saveCategoryAction}
                    className={`grid gap-2 p-3 ${index < categories.length - 1 ? "border-b border-brand/10" : ""}`}
                  >
                    <input type="hidden" name="id" value={category.id} />
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {category.postCount} posts
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          className="h-8 px-3 text-xs normal-case tracking-normal"
                          type="submit"
                          variant="outline"
                        >
                          Salvar
                        </Button>
                        <Button
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          formAction={deleteCategoryAction}
                          name="id"
                          type="submit"
                          value={category.id}
                          variant="outline"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <Input className="h-10" name="name" defaultValue={category.name} />
                    <Input className="h-10" name="slug" defaultValue={category.slug} />
                  </form>
                ))}
              </div>
            </div>
          </AdminCard>
        </aside>
      )}
    </div>
    </>
  );
}
