"use client";

import Image from "next/image";
import { Compass, MoveHorizontal, Orbit } from "lucide-react";
import { useMemo, useState } from "react";
import { Panorama360Viewer } from "@/components/site/panorama-360-viewer";
import type { TourScene } from "@/components/site/tour-360-types";
import { cn } from "@/lib/utils";

type Tour360ShowcaseProps = {
  title: string;
  description: string;
  scenes: TourScene[];
};

export function Tour360Showcase({
  title,
  description,
  scenes,
}: Tour360ShowcaseProps) {
  const [selectedSceneId, setSelectedSceneId] = useState(scenes[0]?.id ?? "");
  const activeSceneId = scenes.some((scene) => scene.id === selectedSceneId)
    ? selectedSceneId
    : scenes[0]?.id ?? "";

  const activeScene = useMemo(
    () => scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0] ?? null,
    [activeSceneId, scenes],
  );

  if (!scenes.length || !activeScene) {
    return null;
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-[1.8rem] border border-brand/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(247,249,251,0.86)_100%)] p-6 shadow-[0_20px_48px_rgba(15,23,42,0.06)]">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-brand/75">
          Navegação panorâmica
        </p>
        <h3 className="mt-3 text-[2rem] leading-[0.94] font-extrabold tracking-[-0.04em] text-slate-950">
          {title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>

        <div className="mt-6 rounded-[1.45rem] border border-brand/10 bg-white/76 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Orbit className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">Modo 360</p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {scenes.length} cenas
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            Arraste a cena para observar o ambiente em todas as direções, no ritmo de uma visita mais livre e contemplativa.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {scenes.map((scene, index) => {
            const isActive = scene.id === activeScene.id;

            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => setSelectedSceneId(scene.id)}
                className={cn(
                  "group w-full rounded-[1.35rem] border p-3 text-left transition-all duration-300",
                  isActive
                    ? "border-brand/20 bg-[linear-gradient(180deg,rgba(238,246,252,0.96)_0%,rgba(228,240,248,0.92)_100%)] shadow-[0_16px_34px_rgba(15,23,42,0.08)]"
                    : "border-slate-200 bg-white/84 hover:border-brand/10 hover:bg-slate-50/90",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-20 overflow-hidden rounded-[1rem] border border-slate-200">
                    <Image
                      src={scene.image}
                      alt={scene.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="160px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
                      Cena {index + 1}
                    </p>
                    <p className="mt-1 truncate text-base font-semibold text-slate-950">{scene.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                      {scene.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="relative overflow-hidden rounded-[2rem] border border-brand/10 bg-[linear-gradient(160deg,rgba(8,17,28,0.96),rgba(12,26,42,0.94))] p-4 shadow-[0_28px_80px_rgba(8,15,26,0.22)] md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_28%)]" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sky-100/90">
              {activeScene.title}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-300">
              <MoveHorizontal className="h-3.5 w-3.5" />
              Arraste para girar
            </span>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-300">
            Panorama 360
          </span>
        </div>

        <div className="relative z-10 mt-5 overflow-hidden rounded-[1.8rem] border border-white/10">
          <Panorama360Viewer
            src={activeScene.image}
            alt={activeScene.title}
            className="h-[520px] md:h-[620px]"
            showHint
          />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,28,0.05),rgba(8,17,28,0.06)_34%,rgba(8,17,28,0.52))]" />

          <div className="pointer-events-none absolute inset-x-6 bottom-6 z-20 flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/30 p-5 backdrop-blur-xl md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-sky-100/72">
                Cena ativa
              </p>
              <h4 className="mt-2 text-[1.8rem] leading-[0.94] font-extrabold tracking-[-0.04em] text-white">
                {activeScene.title}
              </h4>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200/82">
                {activeScene.description}
              </p>
            </div>

            <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.06] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200/88">
              <Compass className="h-4 w-4 text-sky-100" />
              Olhe em 360 sem sair da cena
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {scenes.map((scene) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => setSelectedSceneId(scene.id)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  scene.id === activeScene.id ? "w-10 bg-sky-200" : "w-2.5 bg-white/24 hover:bg-white/42",
                )}
                aria-label={`Selecionar cena ${scene.title}`}
              />
            ))}
          </div>

          <p className="text-sm leading-7 text-slate-300">
            A experiência gira dentro da mesma cena, no estilo Street View, sem modo de caminhada.
          </p>
        </div>
      </div>
    </section>
  );
}
