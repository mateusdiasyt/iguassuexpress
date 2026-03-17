"use client";

import { BlogPostStatus } from "@prisma/client";
import {
  CalendarClock,
  Eye,
  FolderTree,
  Heading2,
  Heading3,
  Link2,
  List,
  MessageSquareQuote,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
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
    score >= 85 ? "bg-emerald-100 text-emerald-700" : score >= 65 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${tone}`}>
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
    <div className="grid gap-6 2xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-6">
        <AdminCard
          title="Conteudos"
          description="Biblioteca de posts para localizar rapidamente qualquer artigo."
        >
          <div className="space-y-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-10"
                placeholder="Buscar por titulo, slug ou categoria"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <div className="flex gap-3">
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
                className="h-10 gap-2 normal-case tracking-normal"
                variant="outline"
                onClick={() => selectPost("new")}
              >
                <Plus className="h-4 w-4" />
                Novo post
              </Button>
            </div>

            <div className="max-h-[40rem] space-y-3 overflow-y-auto pr-1">
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
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-base font-semibold text-slate-950">{post.title}</p>
                      <StatusBadge status={post.status} />
                    </div>
                    <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-slate-400">
                      /blog/{post.slug}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <ScorePill score={postSeo.score} />
                      <p className="text-xs text-slate-500">{formatDate(post.updatedAt)}</p>
                    </div>
                  </button>
                );
              })}

              {!filteredPosts.length ? (
                <div className="rounded-[1.4rem] border border-dashed border-brand/15 bg-slate-50 px-4 py-8 text-sm leading-7 text-slate-500">
                  Nenhum conteudo encontrado para esse filtro.
                </div>
              ) : null}
            </div>
          </div>
        </AdminCard>

        <AdminCard
          title="Categorias"
          description="Estruture os temas editoriais para facilitar navegacao e SEO."
        >
          <div className="space-y-4">
            <form
              action={saveCategoryAction}
              className="grid gap-3 rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4"
            >
              <Input name="name" placeholder="Nova categoria" />
              <Input name="slug" placeholder="slug-da-categoria" />
              <SubmitButton className="h-10 w-full normal-case tracking-normal">
                Criar categoria
              </SubmitButton>
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
                      <SubmitButton className="h-10 flex-1 normal-case tracking-normal">
                        Salvar
                      </SubmitButton>
                      <Button
                        className="h-10 gap-2 px-4 text-red-600 normal-case tracking-normal hover:bg-red-50"
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
      </aside>

      <form action={savePostAction} className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <input name="id" type="hidden" value={draft.id} />

        <div className="space-y-6">
          <AdminCard
            title={draft.id ? "Editar post" : "Novo post"}
            description="Escreva o conteudo principal com foco em clareza e escaneabilidade."
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <StatusBadge status={draft.status} />
                  <ScorePill score={seo.score} />
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    {seo.grade}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CalendarClock className="h-4 w-4 text-slate-400" />
                  {draft.id ? `Ultima edicao: ${formatDate(selectedPost?.updatedAt ?? null)}` : "Novo rascunho"}
                </div>
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

              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_190px]">
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
                    Gerar automatico
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {editorBlocks.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Button
                        key={tool.label}
                        type="button"
                        variant="outline"
                        className="h-10 gap-2 px-4 normal-case tracking-normal"
                        onClick={() => insertSnippet(tool.snippet)}
                      >
                        <Icon className="h-4 w-4" />
                        {tool.label}
                      </Button>
                    );
                  })}
                </div>

                <div className="overflow-hidden rounded-[1.8rem] border border-brand/10 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-brand/10 bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {seo.wordCount} palavras / {seo.readingTime} min / {seo.headingCount} headings
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={
                          editorTab === "write"
                            ? "rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                            : "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 hover:bg-slate-100"
                        }
                        onClick={() => setEditorTab("write")}
                      >
                        Escrever
                      </button>
                      <button
                        type="button"
                        className={
                          editorTab === "preview"
                            ? "rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                            : "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 hover:bg-slate-100"
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
                      className="min-h-[32rem] w-full resize-y border-0 bg-white px-5 py-4 text-sm leading-7 text-slate-900 outline-none"
                      placeholder="Escreva o artigo em Markdown..."
                      value={draft.content}
                      onChange={(event) => updateDraft("content", event.target.value)}
                    />
                  ) : (
                    <div className="editorial-prose min-h-[32rem] px-5 py-6">
                      {deferredContent.trim() ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{deferredContent}</ReactMarkdown>
                      ) : (
                        <div className="flex min-h-[24rem] items-center justify-center rounded-[1.6rem] border border-dashed border-brand/15 bg-slate-50 text-sm text-slate-500">
                          O preview aparece aqui assim que voce comecar a escrever.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Resumo" description="Texto de apoio para listagem do blog e compartilhamento.">
            <div className="space-y-3">
              <Textarea
                name="excerpt"
                className="min-h-28"
                placeholder="Resumo enxuto e atrativo do artigo."
                value={draft.excerpt}
                onChange={(event) => updateDraft("excerpt", event.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 normal-case tracking-normal"
                onClick={extractExcerpt}
              >
                <Sparkles className="h-4 w-4" />
                Extrair do conteudo
              </Button>
            </div>
          </AdminCard>
        </div>

        <aside className="space-y-6 2xl:sticky 2xl:top-6 2xl:self-start">
          <AdminCard title="Publicacao" description="Controle de status, categoria e imagem destacada.">
            <div className="space-y-4">
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
                onValueChange={(value) => updateDraft("featuredImage", value)}
              />

              <a
                className="inline-flex h-10 w-full items-center justify-center rounded-full border border-brand/20 bg-white px-4 text-sm font-semibold text-brand transition hover:bg-brand/5"
                href={buildPostUrl(seo.generatedSlug)}
                rel="noreferrer"
                target="_blank"
              >
                Abrir URL final
              </a>

              <div className="grid gap-3">
                <SubmitButton className="h-10 w-full normal-case tracking-normal">
                  Salvar post
                </SubmitButton>

                {draft.id ? (
                  <Button
                    className="h-10 w-full gap-2 text-red-600 normal-case tracking-normal hover:bg-red-50"
                    formAction={deletePostAction}
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir post
                  </Button>
                ) : null}
              </div>
            </div>
          </AdminCard>

          <AdminCard title="SEO ao vivo" description="Ajustes on-page com leitura imediata da qualidade do post.">
            <div className="space-y-4">
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
                className="h-10 w-full gap-2 normal-case tracking-normal"
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
                  className="min-h-24"
                  placeholder="Descricao para resultados do Google"
                  value={draft.seoDescription}
                  onChange={(event) => updateDraft("seoDescription", event.target.value)}
                />
              </label>

              <div className="rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/70">
                    Score
                  </p>
                  <span className="text-sm font-semibold text-slate-700">{seo.score}/100</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${seo.score}%` }} />
                </div>
              </div>

              <div className="max-h-[19rem] space-y-2 overflow-y-auto pr-1">
                {seo.checks.map((check) => (
                  <div
                    key={check.label}
                    className={
                      check.passed
                        ? "rounded-[1.1rem] border border-emerald-100 bg-emerald-50/70 p-3"
                        : "rounded-[1.1rem] border border-amber-100 bg-amber-50/70 p-3"
                    }
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{check.label}</p>
                      <span className="text-xs uppercase tracking-[0.14em] text-slate-500">
                        {check.weight} pts
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-6 text-slate-500">{check.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Preview Google" description="Visual de como o resultado pode aparecer na busca.">
            <div className="rounded-[1.4rem] border border-brand/10 bg-slate-50 p-4">
              <p className="truncate text-xs text-emerald-700">{buildPostUrl(seo.generatedSlug)}</p>
              <p className="mt-2 text-lg font-semibold leading-7 text-brand">
                {seo.title || "Titulo do artigo"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {seo.description || "A descricao SEO aparecera aqui conforme voce preencher os campos."}
              </p>
            </div>
          </AdminCard>
        </aside>
      </form>
    </div>
  );
}
