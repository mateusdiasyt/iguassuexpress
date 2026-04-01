"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, MoveHorizontal, X } from "lucide-react";
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
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[100] h-[min(880px,calc(100vh-1.5rem))] w-[min(1520px,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(145deg,rgba(12,19,31,0.96),rgba(18,31,47,0.94))] text-white shadow-[0_46px_140px_rgba(2,8,18,0.58)] md:h-[min(880px,calc(100vh-4rem))] md:w-[min(1520px,calc(100vw-4rem))]">
          <div className="grid h-full min-h-[80vh] lg:grid-cols-[500px_minmax(0,1fr)] xl:grid-cols-[470px_minmax(0,1fr)]">
            <aside className="relative flex min-h-0 flex-col border-b border-white/10 bg-white/[0.03] p-6 lg:border-r lg:border-b-0 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-sky-200/82">
                    Tour panoramico
                  </p>
                  <Dialog.Title className="mt-4 max-w-sm text-[2rem] leading-[0.92] font-extrabold tracking-[-0.05em] text-white">
                    {title}
                  </Dialog.Title>
                </div>
                <Dialog.Close className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/74 transition hover:bg-white/10 hover:text-white">
                  <X className="h-4 w-4" />
                </Dialog.Close>
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-300">{description}</p>

              <div className="mt-6 flex items-center justify-between gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">Cenas 360</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    {scenes.length} ambientes publicados
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  <MoveHorizontal className="h-3.5 w-3.5" />
                  Arraste
                </div>
              </div>

              <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1 soft-scrollbar">
                <div className="grid grid-cols-2 gap-3">
                  {scenes.map((scene, index) => {
                    const isActive = scene.id === activeScene.id;

                    return (
                      <button
                        key={scene.id}
                        type="button"
                        onClick={() => setSelectedSceneId(scene.id)}
                        className={cn(
                          "group rounded-[1.45rem] border p-2.5 text-left transition-all duration-300",
                          isActive
                            ? "border-sky-200/34 bg-sky-300/10 shadow-[0_18px_34px_rgba(15,36,58,0.22)]"
                            : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]",
                        )}
                      >
                        <div className="relative aspect-[1.45/1] overflow-hidden rounded-[1.15rem] border border-white/10">
                          <Image
                            src={scene.image}
                            alt={scene.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            sizes="280px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/58 via-slate-950/10 to-transparent" />
                          <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-3">
                            <span className="rounded-full bg-slate-950/55 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/82 backdrop-blur-md">
                              Cena {index + 1}
                            </span>
                            {isActive ? (
                              <span className="rounded-full border border-sky-200/30 bg-sky-200/16 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-sky-100">
                                Ativa
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-3 px-1 pb-1">
                          <p className="line-clamp-2 text-[1rem] font-semibold leading-tight text-white">
                            {scene.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <Link
                  href="/tour-360"
                  className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/[0.1]"
                >
                  Ver pagina completa
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>

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
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_46%)]" />
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#08111c] via-[#08111c]/35 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#08111c] via-[#08111c]/35 to-transparent" />

                <Panorama360Viewer
                  src={activeScene.image}
                  alt={activeScene.title}
                  className="absolute inset-0 rounded-none"
                  showHint
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,28,0.08),rgba(8,17,28,0.06)_36%,rgba(8,17,28,0.6))]" />

                <div className="pointer-events-none absolute inset-x-5 bottom-7 z-20 flex flex-col gap-4 rounded-[1.6rem] border border-white/12 bg-slate-950/32 p-4 backdrop-blur-xl md:inset-x-6 md:bottom-8 md:p-5">
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-sky-100/75">
                      Cena ativa
                    </p>
                    <h4 className="mt-2 text-[1.55rem] leading-tight font-extrabold tracking-[-0.04em] text-white md:text-[2.15rem]">
                      {activeScene.title}
                    </h4>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200/82 md:text-[0.95rem]">
                      {activeScene.description}
                    </p>
                  </div>

                  <div className="self-start rounded-full border border-white/12 bg-white/[0.05] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200/90">
                    <div className="flex items-center gap-3">
                      <Compass className="h-4 w-4 text-sky-100" />
                      Olhe em 360 na mesma cena
                    </div>
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
                  Cada cena pode receber um nome proprio no painel e aparece assim em toda a experiencia do tour.
                </p>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
