"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ImagePlus,
  LoaderCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { TourScene } from "@/components/site/tour-360-types";
import { uploadAssetFromClient } from "@/lib/client-upload";
import { cn } from "@/lib/utils";

type TourScenesFieldProps = {
  name: string;
  defaultValue?: TourScene[] | null;
};

function createScene(index: number): TourScene {
  return {
    id: `tour-scene-${Date.now()}-${index + 1}`,
    title: `Cena 360 ${index + 1}`,
    description: "",
    image: "",
  };
}

function normalizeScenes(scenes: TourScene[]) {
  return scenes.map((scene, index) => ({
    ...scene,
    id: scene.id || `tour-scene-${index + 1}`,
    title: scene.title?.trim() || `Cena 360 ${index + 1}`,
    description: scene.description?.trim() || "",
    image: scene.image?.trim() || "",
  }));
}

export function TourScenesField({ name, defaultValue }: TourScenesFieldProps) {
  const [scenes, setScenes] = useState<TourScene[]>(
    defaultValue?.length ? normalizeScenes(defaultValue) : [createScene(0)],
  );
  const [uploadingId, setUploadingId] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string>(() => defaultValue?.[0]?.id ?? "");
  const [error, setError] = useState("");

  const serializedValue = useMemo(
    () => JSON.stringify(normalizeScenes(scenes)),
    [scenes],
  );

  useEffect(() => {
    if (!scenes.length) {
      return;
    }

    const stillExists = scenes.some((scene) => scene.id === expandedId);
    if (!stillExists) {
      setExpandedId(scenes[0]?.id ?? "");
    }
  }, [expandedId, scenes]);

  function updateScene(sceneId: string, patch: Partial<TourScene>) {
    setScenes((current) =>
      current.map((scene) => (scene.id === sceneId ? { ...scene, ...patch } : scene)),
    );
  }

  function addScene() {
    setScenes((current) => {
      const nextScene = createScene(current.length);
      setExpandedId(nextScene.id);
      return [...current, nextScene];
    });
  }

  function removeScene(sceneId: string) {
    setScenes((current) => {
      const next = current.filter((scene) => scene.id !== sceneId);

      if (next.length) {
        return next;
      }

      const fallback = createScene(0);
      setExpandedId(fallback.id);
      return [fallback];
    });
  }

  function moveScene(sceneId: string, direction: -1 | 1) {
    setScenes((current) => {
      const index = current.findIndex((scene) => scene.id === sceneId);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      return next;
    });
  }

  async function handleUpload(sceneId: string, files?: FileList | null) {
    const file = files?.[0];

    if (!file) {
      return;
    }

    setUploadingId(sceneId);
    setError("");

    try {
      const imageUrl = await uploadAssetFromClient(file, "image");
      updateScene(sceneId, { image: imageUrl });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Falha no upload da cena.");
    } finally {
      setUploadingId("");
    }
  }

  return (
    <div className="space-y-5">
      <input type="hidden" name={name} value={serializedValue} />

      <div className="flex flex-col gap-3 rounded-[1.55rem] border border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Cenas do tour
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
            Nome, imagem e descricao por cena
          </h3>
        </div>

        <button
          type="button"
          onClick={addScene}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-medium text-slate-950 transition hover:border-slate-300 hover:bg-slate-50/90"
        >
          <Plus className="h-4 w-4" />
          Adicionar cena
        </button>
      </div>

      <div className="space-y-4">
        {scenes.map((scene, index) => {
          const isUploading = uploadingId === scene.id;
          const isPrimary = index === 0;
          const isExpanded = scene.id === expandedId;

          return (
            <article
              key={scene.id}
              className={cn(
                "overflow-hidden rounded-[1.7rem] border transition-all duration-300",
                isExpanded
                  ? "border-brand/20 bg-[linear-gradient(180deg,rgba(243,248,252,0.96)_0%,rgba(255,255,255,0.98)_100%)] shadow-[0_22px_54px_rgba(15,23,42,0.08)]"
                  : "border-slate-200/80 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)]",
              )}
            >
              <div
                className={cn(
                  "grid gap-4 px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center",
                  isExpanded ? "border-b border-brand/10" : "",
                )}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId((current) => (current === scene.id ? "" : scene.id))}
                  className="flex min-w-0 items-center gap-4 text-left"
                >
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[1.1rem] border border-slate-200 bg-slate-100">
                    {scene.image ? (
                      <Image
                        src={scene.image}
                        alt={scene.title}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                        <ImagePlus className="h-4.5 w-4.5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Cena {index + 1}
                      </span>
                      {isPrimary ? (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          Capa da home
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 text-lg font-semibold leading-tight text-slate-950">
                      {scene.title || `Cena 360 ${index + 1}`}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {scene.description?.trim()
                        ? scene.description
                        : "Sem descricao cadastrada para esta cena."}
                    </p>
                  </div>
                </button>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => moveScene(scene.id, -1)}
                    disabled={index === 0}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Mover ${scene.title} para cima`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveScene(scene.id, 1)}
                    disabled={index === scenes.length - 1}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Mover ${scene.title} para baixo`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeScene(scene.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-white text-red-500 transition hover:bg-red-50"
                    aria-label={`Excluir ${scene.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId((current) => (current === scene.id ? "" : scene.id))}
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white transition",
                      isExpanded
                        ? "border-brand/20 text-brand"
                        : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-950",
                    )}
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? `Fechar ${scene.title}` : `Abrir ${scene.title}`}
                  >
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isExpanded ? "rotate-180" : "",
                      )}
                    />
                  </button>
                </div>
              </div>

              {isExpanded ? (
                <div className="grid gap-5 p-5 xl:grid-cols-[320px_minmax(0,1fr)]">
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-[1.45rem] border border-brand/10 bg-slate-100 aspect-[16/10]">
                      {scene.image ? (
                        <Image
                          src={scene.image}
                          alt={scene.title}
                          fill
                          className="object-cover"
                          sizes="320px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,rgba(248,250,252,0.96)_0%,rgba(241,245,249,0.96)_100%)] px-6 text-center">
                          <ImagePlus className="h-5 w-5 text-slate-400" />
                          <p className="text-sm leading-6 text-slate-500">
                            Envie a foto panoramica desta cena.
                          </p>
                        </div>
                      )}

                      <label className="absolute inset-x-4 bottom-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/65 bg-white/88 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:bg-white">
                        {isUploading ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <ImagePlus className="h-4 w-4" />
                        )}
                        {scene.image ? "Alterar panorama" : "Enviar panorama"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => void handleUpload(scene.id, event.target.files)}
                        />
                      </label>
                    </div>

                    <div className="rounded-[1.2rem] border border-slate-200 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-500">
                      Prefira imagem equiretangular 2:1 para manter o giro fluido no viewer.
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
                      <label className="grid gap-2 text-sm text-slate-600">
                        <span className="font-medium text-slate-950">Nome da cena</span>
                        <input
                          value={scene.title}
                          onChange={(event) => updateScene(scene.id, { title: event.target.value })}
                          className="h-11 w-full rounded-2xl border border-brand/10 bg-white/90 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand/50 focus:ring-4 focus:ring-brand/10"
                          placeholder="Ex.: Piscina panoramica"
                        />
                      </label>

                      <div className="grid gap-2 text-sm text-slate-600">
                        <span className="font-medium text-slate-950">Funcao da cena</span>
                        <div className="flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-500">
                          {isPrimary ? "Capa da Home" : "Cena interna"}
                        </div>
                      </div>
                    </div>

                    <label className="grid gap-2 text-sm text-slate-600">
                      <span className="font-medium text-slate-950">Descricao da cena</span>
                      <textarea
                        value={scene.description}
                        onChange={(event) => updateScene(scene.id, { description: event.target.value })}
                        className="min-h-36 w-full rounded-[1.6rem] border border-brand/10 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand/50 focus:ring-4 focus:ring-brand/10"
                        placeholder="Explique rapidamente o que aparece nesta foto 360."
                      />
                    </label>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
