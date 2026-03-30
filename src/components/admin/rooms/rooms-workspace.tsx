"use client";

import Image from "next/image";
import { type FormEvent, useDeferredValue, useMemo, useState } from "react";
import { ArrowUpRight, PencilLine, Plus, Search, Trash2, Users, X } from "lucide-react";
import { AdminCard } from "@/components/admin/admin-card";
import { RoomFeaturesField } from "@/components/admin/rooms/room-features-field";
import { UploadField } from "@/components/admin/upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { toSlug } from "@/lib/utils";

type ActionFn = (formData: FormData) => void | Promise<void>;

type AdminRoomCategoryItem = {
  id: string;
  name: string;
  slug: string;
  badge: string | null;
  description: string | null;
  heroImage: string | null;
  order: number;
  isActive: boolean;
  roomCount: number;
};

type AdminRoomItem = {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryOrder: number;
  title: string;
  slug: string;
  occupancy: number;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  coverImage: string | null;
  gallery: string[];
  isActive: boolean;
  order: number;
};

type RoomsWorkspaceProps = {
  categories: AdminRoomCategoryItem[];
  rooms: AdminRoomItem[];
  saveRoomAction: ActionFn;
  deleteRoomAction: ActionFn;
  saveCategoryAction: ActionFn;
  deleteCategoryAction: ActionFn;
};

type RoomDraft = {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  occupancy: string;
  order: string;
  shortDescription: string;
  fullDescription: string;
  features: string;
  gallery: string;
  coverImage: string;
  isActive: boolean;
};

const COMMON_ROOM_FEATURES = [
  "Reformado",
  "Novo",
  "Cama box",
  "Cama box nova",
  "Internet wi-fi",
  "Ar condicionado de janela",
  "Ar condicionado split",
  "Telefone",
  "TV LCD 32 polegadas a cabo",
  "Frigobar",
  "Aquecimento de agua",
  "Servico de quarto",
];

function emptyRoomDraft(defaultCategoryId = ""): RoomDraft {
  return {
    id: "",
    categoryId: defaultCategoryId,
    title: "",
    slug: "",
    occupancy: "2",
    order: "0",
    shortDescription: "",
    fullDescription: "",
    features: "",
    gallery: "",
    coverImage: "",
    isActive: true,
  };
}

function roomDraftFromItem(room: AdminRoomItem): RoomDraft {
  return {
    id: room.id,
    categoryId: room.categoryId,
    title: room.title,
    slug: room.slug,
    occupancy: String(room.occupancy),
    order: String(room.order),
    shortDescription: room.shortDescription,
    fullDescription: room.fullDescription,
    features: room.features.join("\n"),
    gallery: room.gallery.join("\n"),
    coverImage: room.coverImage ?? "",
    isActive: room.isActive,
  };
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={
        active
          ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700"
          : "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700"
      }
    >
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

function getRoomPreviewImage(room: AdminRoomItem) {
  return room.coverImage || room.gallery[0] || "/piscina-hotel-iguassu.jpg";
}

function RoomHoverPreview({ room }: { room: AdminRoomItem }) {
  const tags = room.features.slice(0, 2);

  return (
    <div className="pointer-events-none absolute left-0 top-full z-[80] mt-3 w-[300px] translate-y-2 opacity-0 transition-all duration-250 group-hover/room-title:translate-y-0 group-hover/room-title:opacity-100">
      <article className="overflow-hidden rounded-[1.8rem] border border-slate-200/70 bg-white shadow-[0_26px_48px_rgba(15,23,42,0.2)]">
        <div className="relative h-44 overflow-hidden">
          <Image
            src={getRoomPreviewImage(room)}
            alt={room.title}
            fill
            className="object-cover"
            sizes="300px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/35 text-white backdrop-blur-sm"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <div className="space-y-3 bg-slate-900 px-4 py-4 text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/95">
            <Users className="h-3.5 w-3.5" />
            {room.occupancy} pessoa{room.occupancy > 1 ? "s" : ""}
          </span>
          <h4 className="text-4xl leading-[0.9] font-extrabold tracking-[-0.03em]">{room.title}</h4>
          <p className="line-clamp-2 text-sm leading-6 text-white/80">{room.shortDescription}</p>
          {tags.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full bg-white/18 px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white/90"
                >
                  {feature}
                </span>
              ))}
            </div>
          ) : null}
          <span
            aria-hidden="true"
            className="inline-flex h-10 items-center rounded-full bg-white px-5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-900"
          >
            Ver detalhes
          </span>
        </div>
      </article>
    </div>
  );
}

export function RoomsWorkspace({
  categories,
  rooms,
  saveRoomAction,
  deleteRoomAction,
  saveCategoryAction,
  deleteCategoryAction,
}: RoomsWorkspaceProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [roomDraft, setRoomDraft] = useState<RoomDraft>(emptyRoomDraft(categories[0]?.id));

  const deferredSearch = useDeferredValue(search);
  const activeRoomsCount = rooms.filter((room) => room.isActive).length;
  const inactiveRoomsCount = rooms.length - activeRoomsCount;
  const roomFeatureSuggestions = useMemo(() => {
    const seen = new Set<string>();

    return [...COMMON_ROOM_FEATURES, ...rooms.flatMap((room) => room.features)].filter((feature) => {
      const normalized = feature.trim();

      if (!normalized) {
        return false;
      }

      const key = normalized.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }, [rooms]);

  const sortedRooms = useMemo(
    () =>
      [...rooms].sort((a, b) => {
        if (a.categoryOrder !== b.categoryOrder) {
          return a.categoryOrder - b.categoryOrder;
        }

        if (a.order !== b.order) {
          return a.order - b.order;
        }

        return a.title.localeCompare(b.title);
      }),
    [rooms],
  );

  const filteredRooms = useMemo(
    () =>
      sortedRooms.filter((room) => {
        const searchHaystack =
          `${room.title} ${room.slug} ${room.categoryName} ${room.shortDescription}`.toLowerCase();
        const matchesSearch = searchHaystack.includes(deferredSearch.trim().toLowerCase());
        const matchesStatus =
          statusFilter === "ALL" ||
          (statusFilter === "ACTIVE" && room.isActive) ||
          (statusFilter === "INACTIVE" && !room.isActive);
        const matchesCategory = categoryFilter === "ALL" || room.categoryId === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      }),
    [sortedRooms, deferredSearch, statusFilter, categoryFilter],
  );

  function updateRoomDraft<Key extends keyof RoomDraft>(field: Key, value: RoomDraft[Key]) {
    setRoomDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateRoom() {
    setRoomDraft(emptyRoomDraft(categories[0]?.id));
    setIsEditorOpen(true);
  }

  function openEditRoom(room: AdminRoomItem) {
    setRoomDraft(roomDraftFromItem(room));
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setRoomDraft(emptyRoomDraft(categories[0]?.id));
  }

  function generateRoomSlug() {
    updateRoomDraft("slug", toSlug(roomDraft.title));
  }

  function confirmDeleteRoom(
    event: FormEvent<HTMLFormElement>,
    roomTitle: string,
  ) {
    if (!window.confirm(`Excluir o quarto "${roomTitle}"?`)) {
      event.preventDefault();
    }
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <AdminCard
            title="Conteudos"
            description="Estrutura editorial para quartos com hierarquia por categoria e ordem."
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
                  onClick={openCreateRoom}
                >
                  <Plus className="h-4 w-4" />
                  Novo quarto
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
                  Todos ({rooms.length})
                </button>
                <button
                  type="button"
                  className={
                    statusFilter === "ACTIVE"
                      ? "rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                      : "rounded-full border border-brand/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:border-brand/35"
                  }
                  onClick={() => setStatusFilter("ACTIVE")}
                >
                  Ativos ({activeRoomsCount})
                </button>
                <button
                  type="button"
                  className={
                    statusFilter === "INACTIVE"
                      ? "rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                      : "rounded-full border border-brand/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:border-brand/35"
                  }
                  onClick={() => setStatusFilter("INACTIVE")}
                >
                  Inativos ({inactiveRoomsCount})
                </button>
              </div>

              <label className="grid gap-2 text-sm text-slate-600 md:max-w-sm">
                Filtrar categoria
                <Select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="ALL">Todas as categorias</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </label>

              <div className="relative rounded-[1.4rem] border border-brand/10 lg:overflow-visible">
                <div className="overflow-x-auto lg:overflow-visible">
                  <div className="min-w-[940px]">
                    <div className="hidden grid-cols-[minmax(260px,1fr)_160px_90px_90px_120px_160px] gap-4 border-b border-brand/10 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 lg:grid">
                      <span>Titulo</span>
                      <span>Categoria</span>
                      <span>Ocupacao</span>
                      <span>Ordem</span>
                      <span>Status</span>
                      <span>Acoes</span>
                    </div>
                    <div className="divide-y divide-brand/10">
                      {filteredRooms.map((room) => (
                        <div key={room.id} className="px-4 py-4">
                          <div className="hidden grid-cols-[minmax(260px,1fr)_160px_90px_90px_120px_160px] items-center gap-4 lg:grid">
                            <div className="group/room-title relative min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">{room.title}</p>
                              <p className="truncate text-xs text-slate-500">/{room.slug}</p>
                              <RoomHoverPreview room={room} />
                            </div>
                            <p className="truncate text-sm text-slate-600">{room.categoryName}</p>
                            <p className="text-sm text-slate-600">{room.occupancy} pessoas</p>
                            <p className="text-sm text-slate-600">{room.order}</p>
                            <div className="flex items-center">
                              <StatusBadge active={room.isActive} />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="h-9 gap-1 px-3 normal-case tracking-normal"
                                onClick={() => openEditRoom(room)}
                              >
                                <PencilLine className="h-3.5 w-3.5" />
                                Editar
                              </Button>
                              <form
                                action={deleteRoomAction}
                                onSubmit={(event) => confirmDeleteRoom(event, room.title)}
                              >
                                <Button
                                  type="submit"
                                  name="id"
                                  value={room.id}
                                  variant="outline"
                                  className="h-9 w-9 p-0 text-red-600 hover:bg-red-50"
                                  aria-label={`Excluir quarto ${room.title}`}
                                  title="Excluir quarto"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </form>
                            </div>
                          </div>
                          <div className="space-y-3 lg:hidden">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{room.title}</p>
                              <p className="text-xs text-slate-500">/{room.slug}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge active={room.isActive} />
                              <span className="text-xs text-slate-500">{room.categoryName}</span>
                              <span className="text-xs text-slate-500">Ordem {room.order}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="h-9 gap-1 px-3 normal-case tracking-normal"
                                onClick={() => openEditRoom(room)}
                              >
                                <PencilLine className="h-3.5 w-3.5" />
                                Editar
                              </Button>
                              <form
                                action={deleteRoomAction}
                                onSubmit={(event) => confirmDeleteRoom(event, room.title)}
                              >
                                <Button
                                  type="submit"
                                  name="id"
                                  value={room.id}
                                  variant="outline"
                                  className="h-9 w-9 p-0 text-red-600 hover:bg-red-50"
                                  aria-label={`Excluir quarto ${room.title}`}
                                  title="Excluir quarto"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </form>
                            </div>
                          </div>
                        </div>
                      ))}
                      {!filteredRooms.length ? (
                        <div className="px-4 py-10 text-sm text-slate-500">
                          Nenhum quarto encontrado para esse filtro.
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>

        <aside className="space-y-6">
          <AdminCard title="Dados dos quartos" description="Resumo para manter a hierarquia organizada.">
            <div className="grid gap-3">
              <div className="rounded-[1rem] border border-brand/10 bg-slate-50 p-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand/70">
                  Total de quartos
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{rooms.length}</p>
              </div>
              <div className="rounded-[1rem] border border-brand/10 bg-slate-50 p-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand/70">
                  Categorias
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{categories.length}</p>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Categorias" description="Gestao rapida de ordem e status.">
            <div className="space-y-3">
              <form
                action={saveCategoryAction}
                className="grid gap-3 rounded-[1rem] border border-brand/10 bg-slate-50 p-3"
              >
                <Input className="h-10" name="name" placeholder="Nova categoria" />
                <Input className="h-10" name="slug" placeholder="slug-da-categoria" />
                <Input className="h-10" name="order" type="number" defaultValue="0" placeholder="Ordem" />
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" name="isActive" defaultChecked />
                  Categoria ativa
                </label>
                <SubmitButton className="h-10 w-full normal-case tracking-normal">
                  Criar categoria
                </SubmitButton>
              </form>
              {categories.map((category) => (
                <form
                  key={category.id}
                  action={saveCategoryAction}
                  className="grid gap-2 rounded-[1rem] border border-brand/10 bg-white p-3"
                >
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="badge" value={category.badge ?? ""} />
                  <input type="hidden" name="description" value={category.description ?? ""} />
                  <input type="hidden" name="heroImage" value={category.heroImage ?? ""} />
                  <Input className="h-10" name="name" defaultValue={category.name} />
                  <Input className="h-10" name="slug" defaultValue={category.slug} />
                  <Input className="h-10" name="order" type="number" defaultValue={category.order} />
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" name="isActive" defaultChecked={category.isActive} />
                    Categoria ativa
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button type="submit" variant="outline" className="h-9 text-xs normal-case tracking-normal">
                      Salvar
                    </Button>
                    <Button
                      formAction={deleteCategoryAction}
                      name="id"
                      value={category.id}
                      type="submit"
                      variant="outline"
                      className="h-9 gap-1 text-xs text-red-600 normal-case tracking-normal hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </Button>
                  </div>
                </form>
              ))}
            </div>
          </AdminCard>
        </aside>
      </div>

      {isEditorOpen ? (
        <div
          className="fixed inset-0 z-50 bg-slate-950/45 px-3 py-4 backdrop-blur-[2px] md:px-6 md:py-8"
          onClick={closeEditor}
        >
          <div
            className="mx-auto max-h-[94vh] w-full max-w-[980px] overflow-y-auto rounded-[1.8rem] border border-brand/15 bg-slate-50 p-4 shadow-2xl md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <form action={saveRoomAction} className="space-y-6">
              <input type="hidden" name="id" value={roomDraft.id} />

              <AdminCard
                title={roomDraft.id ? "Editar quarto" : "Novo quarto"}
                description="Editor sob demanda para manter o fluxo limpo e objetivo."
              >
                <div className="space-y-5">
                  <div className="flex max-w-4xl flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-brand/10 bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge active={roomDraft.isActive} />
                      <span className="text-xs text-slate-500">
                        Hierarquia definida por categoria + ordem
                      </span>
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

                  <div className="grid gap-4 md:grid-cols-2 xl:justify-start">
                    <label className="grid w-full max-w-md gap-2 text-sm text-slate-600">
                      Categoria
                      <Select
                        name="categoryId"
                        value={roomDraft.categoryId}
                        onChange={(event) => updateRoomDraft("categoryId", event.target.value)}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Select>
                    </label>
                    <label className="grid w-full max-w-md gap-2 text-sm text-slate-600">
                      Titulo
                      <Input
                        name="title"
                        value={roomDraft.title}
                        onChange={(event) => updateRoomDraft("title", event.target.value)}
                      />
                    </label>
                    <label className="grid w-full max-w-md gap-2 text-sm text-slate-600">
                      Slug
                      <Input
                        name="slug"
                        value={roomDraft.slug}
                        onChange={(event) => updateRoomDraft("slug", event.target.value)}
                      />
                    </label>
                    <div className="grid w-full max-w-xs gap-2 text-sm text-slate-600">
                      <span className="opacity-0 select-none">acao</span>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 justify-self-start px-5 normal-case tracking-normal"
                        onClick={generateRoomSlug}
                      >
                        Gerar slug
                      </Button>
                    </div>
                    <label className="grid w-full max-w-[12rem] gap-2 text-sm text-slate-600">
                      Ocupacao
                      <Input
                        name="occupancy"
                        type="number"
                        min={1}
                        max={8}
                        value={roomDraft.occupancy}
                        onChange={(event) => updateRoomDraft("occupancy", event.target.value)}
                      />
                    </label>
                    <label className="grid w-full max-w-[12rem] gap-2 text-sm text-slate-600">
                      Ordem
                      <Input
                        name="order"
                        type="number"
                        min={0}
                        value={roomDraft.order}
                        onChange={(event) => updateRoomDraft("order", event.target.value)}
                      />
                    </label>
                  </div>

                  <label className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={roomDraft.isActive}
                      onChange={(event) => updateRoomDraft("isActive", event.target.checked)}
                    />
                    Quarto ativo
                  </label>

                  <div className="grid gap-4 xl:grid-cols-2 xl:justify-start">
                    <label className="grid w-full max-w-[28rem] gap-2 text-sm text-slate-600">
                      Descricao curta
                      <Textarea
                        className="min-h-28"
                        name="shortDescription"
                        value={roomDraft.shortDescription}
                        onChange={(event) => updateRoomDraft("shortDescription", event.target.value)}
                      />
                    </label>

                    <label className="grid w-full max-w-[28rem] gap-2 text-sm text-slate-600">
                      Descricao completa
                      <Textarea
                        className="min-h-36"
                        name="fullDescription"
                        value={roomDraft.fullDescription}
                        onChange={(event) => updateRoomDraft("fullDescription", event.target.value)}
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_320px] xl:items-start">
                    <RoomFeaturesField
                      name="features"
                      label="Comodidades"
                      value={roomDraft.features}
                      suggestions={roomFeatureSuggestions}
                      onValueChange={(value) => updateRoomDraft("features", value)}
                    />
                    <input type="hidden" name="gallery" value={roomDraft.gallery} readOnly />

                    <UploadField
                      name="coverImage"
                      label="Imagem de capa"
                      value={roomDraft.coverImage}
                      hideTextInput
                      className="rounded-[1.6rem] border border-slate-200/80 bg-white p-4 shadow-[0_18px_38px_rgba(15,23,42,0.05)] xl:sticky xl:top-4"
                      previewClassName="h-52 rounded-[1.2rem] border border-slate-200/80"
                      previewImageClassName="object-cover"
                      onValueChange={(value) => updateRoomDraft("coverImage", value)}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                    <SubmitButton className="h-10 px-5 normal-case tracking-normal">
                      Salvar quarto
                    </SubmitButton>
                    {roomDraft.id ? (
                      <Button
                        formAction={deleteRoomAction}
                        name="id"
                        value={roomDraft.id}
                        type="submit"
                        className="h-10 gap-2 px-5 text-red-600 normal-case tracking-normal hover:bg-red-50"
                        variant="outline"
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir quarto
                      </Button>
                    ) : null}
                  </div>
                </div>
              </AdminCard>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
