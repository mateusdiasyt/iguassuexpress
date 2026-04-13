"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type RoomModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: {
    title: string;
    category: {
      name: string;
    };
    occupancy: number;
    fullDescription: string;
    features: string[];
    coverImage?: string | null;
  } | null;
};

export function RoomModal({ open, onOpenChange, room }: RoomModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-slate-950/72 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 z-[80] max-h-[90vh] -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-white/10 bg-white md:left-1/2 md:w-full md:max-w-4xl md:-translate-x-1/2">
          {room ? (
            <div className="grid md:grid-cols-[1.05fr_1fr]">
              <div className="relative min-h-72">
                {room.coverImage ? (
                  <Image src={room.coverImage} alt={room.title} fill className="object-cover" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand/70">
                      {room.category.name}
                    </p>
                    <Dialog.Title className="mt-3 text-[2rem] leading-[0.94] font-extrabold text-slate-950 md:text-[2.5rem]">
                      {room.title}
                    </Dialog.Title>
                    <p className="mt-3 text-sm text-slate-500">
                      Capacidade para {room.occupancy} pessoa{room.occupancy > 1 ? "s" : ""}
                    </p>
                  </div>
                  <Dialog.Close className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50">
                    <X className="h-4 w-4" />
                  </Dialog.Close>
                </div>

                <p className="mt-6 text-sm leading-8 text-slate-600">
                  {room.fullDescription}
                </p>

                <div className="mt-8">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Comodidades
                  </h4>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {room.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 rounded-2xl bg-slate-950/4 px-4 py-3 text-sm text-slate-700"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                          <Check className="h-4 w-4" />
                        </span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
