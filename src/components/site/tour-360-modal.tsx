"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, MoveHorizontal, Orbit, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Panorama360Viewer } from "@/components/site/panorama-360-viewer";
import type { TourScene } from "@/components/site/tour-360-types";
import { cn } from "@/lib/utils";

type Tour360ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  scenes: TourScene[];
};

export function Tour360Modal({
  open,
  onOpenChange,
  title,
  description,
  scenes,
}: Tour360ModalProps) {
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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-slate-950/76 backdrop-blur-xl" />
        <Dialog.Content className="fixed inset-3 z-[100] overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(145deg,rgba(12,19,31,0.96),rgba(18,31,47,0.94))] text-white shadow-[0_40px_120px_rgba(2,8,18,0.5)] md:inset-6">
          <div className="grid h-full min-h-[80vh] lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="relative flex h-full flex-col border-b border-white/10 bg-white/[0.03] p-6 lg:border-r lg:border-b-0 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-sky-200/82">
                    Tour panoramico
                  </p>
                  <Dialog.Title className="mt-4 max-w-xs text-[2rem] leading-[0.92] font-extrabold tracking-[-0.05em] text-white">
                    {title}
                  </Dialog.Title>
                </div>
                <Dialog.Close className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/74 transition hover:bg-white/10 hover:text-white">
                  <X className="h-4 w-4" />
                </Dialog.Close>
              </div>

              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-300">{description}</p>

              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-400/14 text-sky-100">
                    <Orbit className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Fotos 360</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      {scenes.length} cenas disponiveis
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300/90">
                  Arraste cada cena para olhar aos lados como em um Street View estatico, sem modo de caminhada.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {scenes.slice(0, 3).map((scene, index) => (
                    <button
                      key={`${scene.id}-preview`}
                      type="button"
                      onClick={() => setSelectedSceneId(scene.id)}
                      className={cn(
                        "group relative overflow-hidden rounded-[1rem] border transition-all duration-300",
                        scene.id === activeScene.id
                          ? "border-sky-200/45"
                          : "border-white/10 hover:border-white/20",
                      )}
                    >
                      <div className="relative h-20">
                        <Image
                          src={scene.image}
                          alt={scene.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="120px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                        <span className="absolute left-2 top-2 rounded-full bg-slate-950/45 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-white/82 backdrop-blur-md">
                          {index + 1}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                {scenes.map((scene, index) => {
                  const isActive = scene.id === activeScene.id;

                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => setSelectedSceneId(scene.id)}
                      className={cn(
                        "group rounded-[1.35rem] border p-3 text-left transition-all duration-300",
                        isActive
                          ? "border-sky-200/34 bg-sky-300/10 shadow-[0_18px_34px_rgba(15,36,58,0.22)]"
                          : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-20 overflow-hidden rounded-[1rem]">
                          <Image
                            src={scene.image}
                            alt={scene.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="160px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-sky-100/70">
                            Cena {index + 1}
                          </p>
                          <p className="mt-1 text-base font-semibold leading-tight text-white">
                            {scene.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-300">
                            {scene.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto pt-8">
                <Link
                  href="/tour-360"
                  className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/[0.1]"
                >
                  Ver pagina completa
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative flex min-h-[50vh] flex-col p-4 md:p-6 lg:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_34%)]" />

              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sky-100/90">
                    {activeScene.title}
                  </span>
                  <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-300 md:inline-flex">
                    <MoveHorizontal className="h-3.5 w-3.5" />
                    Arraste para olhar
                  </span>
                </div>

                <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-300">
                  Panorama 360 real
                </div>
              </div>

              <div className="relative z-10 mt-6 flex-1 overflow-hidden rounded-[2rem] border border-white/12 bg-[#08111c] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_30px_80px_rgba(0,0,0,0.34)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_46%)]" />
                <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#08111c] via-[#08111c]/35 to-transparent" />
                <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#08111c] via-[#08111c]/35 to-transparent" />

                <Panorama360Viewer
                  src={activeScene.image}
                  alt={activeScene.title}
                  className="absolute inset-0 rounded-none"
                  showHint
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,28,0.08),rgba(8,17,28,0.06)_36%,rgba(8,17,28,0.6))]" />

                <div className="absolute inset-x-6 bottom-6 z-20 flex flex-col gap-4 rounded-[1.6rem] border border-white/12 bg-slate-950/30 p-5 backdrop-blur-xl md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-sky-100/75">
                      Cena ativa
                    </p>
                    <h4 className="mt-2 text-[1.85rem] leading-[0.94] font-extrabold tracking-[-0.04em] text-white">
                      {activeScene.title}
                    </h4>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200/82">
                      {activeScene.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.05] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200/90">
                    <Compass className="h-4 w-4 text-sky-100" />
                    Olhe em 360 na mesma cena
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
                        scene.id === activeScene.id
                          ? "w-10 bg-sky-200"
                          : "w-2.5 bg-white/24 hover:bg-white/42",
                      )}
                      aria-label={`Selecionar cena ${scene.title}`}
                    />
                  ))}
                </div>

                <p className="text-sm leading-7 text-slate-300">
                  Viewer pronto para cenas panoramicas reais, com o mesmo movimento suave no preview e na pagina completa.
                </p>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
