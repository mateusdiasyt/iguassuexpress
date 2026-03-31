"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
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
  const [error, setError] = useState("");

  const serializedValue = useMemo(
    () => JSON.stringify(normalizeScenes(scenes)),
    [scenes],
  );

  function updateScene(sceneId: string, patch: Partial<TourScene>) {
    setScenes((current) =>
      current.map((scene) => (scene.id === sceneId ? { ...scene, ...patch } : scene)),
    );
  }

  function removeScene(sceneId: string) {
    setScenes((current) => {
      const next = current.filter((scene) => scene.id !== sceneId);
      return next.length ? next : [createScene(0)];
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

      <div className="flex flex-col gap-3 rounded-[1.6rem] border border-brand/10 bg-slate-50/80 p-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
            Cenas do tour
          </p>
          <h3 className="text-2xl font-bold text-slate-950">Nomes, descricoes e fotos 360</h3>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Cada cena recebe um nome proprio. Essa mesma informacao aparece no modal, na Home e na pagina completa do tour.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setScenes((current) => [...current, createScene(current.length)])}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand/15 bg-white px-5 text-sm font-semibold text-brand transition hover:border-brand/30 hover:bg-brand/5"
        >
          <Plus className="h-4 w-4" />
          Adicionar cena
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {scenes.map((scene, index) => {
          const isUploading = uploadingId === scene.id;
          const isPrimary = index === 0;

          return (
            <article
              key={scene.id}
              className={cn(
                "overflow-hidden rounded-[1.7rem] border shadow-[0_18px_38px_rgba(15,23,42,0.06)] transition-all",
                isPrimary
                  ? "border-brand/20 bg-[linear-gradient(180deg,rgba(242,248,252,0.92)_0%,rgba(255,255,255,0.98)_100%)]"
                  : "border-brand/10 bg-white",
              )}
            >
              <div className="border-b border-brand/10 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-brand/10 bg-white px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand/70">
                      Cena {index + 1}
                    </span>
                    {isPrimary ? (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                        Capa da home
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveScene(scene.id, -1)}
                      disabled={index === 0}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand/10 bg-white text-slate-600 transition hover:border-brand/20 hover:text-brand disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveScene(scene.id, 1)}
                      disabled={index === scenes.length - 1}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand/10 bg-white text-slate-600 transition hover:border-brand/20 hover:text-brand disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeScene(scene.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-white text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-[minmax(220px,0.95fr)_minmax(0,1.05fr)]">
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-[1.4rem] border border-brand/10 bg-slate-100 aspect-[2/1]">
                    {scene.image ? (
                      <Image
                        src={scene.image}
                        alt={scene.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1280px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,rgba(248,250,252,0.96)_0%,rgba(241,245,249,0.96)_100%)] px-6 text-center">
                        <ImagePlus className="h-5 w-5 text-slate-400" />
                        <p className="text-sm leading-6 text-slate-500">
                          Envie a foto panoramica desta cena.
                        </p>
                      </div>
                    )}

                    <label className="absolute inset-x-4 bottom-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/65 bg-white/86 px-4 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-md transition hover:bg-white">
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

                  <p className="text-xs leading-6 text-slate-400">
                    Preferencia por imagem equiretangular 2:1 para um giro 360 mais fluido.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="grid gap-2 text-sm text-slate-600">
                    Nome da cena
                    <input
                      value={scene.title}
                      onChange={(event) => updateScene(scene.id, { title: event.target.value })}
                      className="h-11 w-full rounded-2xl border border-brand/10 bg-white/90 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand/50 focus:ring-4 focus:ring-brand/10"
                      placeholder="Ex.: Piscina panoramica"
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-slate-600">
                    Descricao da cena
                    <textarea
                      value={scene.description}
                      onChange={(event) => updateScene(scene.id, { description: event.target.value })}
                      className="min-h-28 w-full rounded-3xl border border-brand/10 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand/50 focus:ring-4 focus:ring-brand/10"
                      placeholder="Explique rapidamente o que aparece nesta foto 360."
                    />
                  </label>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
