"use client";

import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from "react";
import {
  Building2,
  Coffee,
  ImageIcon,
  LoaderCircle,
  type LucideIcon,
  UtensilsCrossed,
} from "lucide-react";
import { saveGalleryImageAction } from "@/actions/admin";
import { UploadField } from "@/components/admin/upload-field";
import { Input } from "@/components/ui/input";

type GalleryImageEditorCardProps = {
  image: {
    id: string;
    category: string;
    imageUrl?: string | null;
    altText: string;
    order: number | string;
    isActive: boolean;
  };
};

type SaveState = "idle" | "saving" | "saved" | "error";

function getSlotMeta(category: string): {
  eyebrow: string;
  icon: LucideIcon;
} {
  const normalized = category.toLowerCase();

  if (normalized.includes("rest")) {
    return {
      eyebrow: "Restaurante",
      icon: UtensilsCrossed,
    };
  }

  if (normalized.includes("cafe")) {
    return {
      eyebrow: "Cafe da manha",
      icon: Coffee,
    };
  }

  if (normalized.includes("hotel")) {
    return {
      eyebrow: "Hotel",
      icon: Building2,
    };
  }

  return {
    eyebrow: "Galeria",
    icon: ImageIcon,
  };
}

function serializeForm(form: HTMLFormElement) {
  return Array.from(new FormData(form).entries())
    .map(([key, value]) => [key, typeof value === "string" ? value : value.name] as const)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");
}

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm text-slate-600">
      <span className="font-medium text-slate-950">{label}</span>
      {children}
    </label>
  );
}

export function GalleryImageEditorCard({ image }: GalleryImageEditorCardProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  const saveInFlightRef = useRef(false);
  const saveQueuedRef = useRef(false);
  const lastSavedSnapshotRef = useRef("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [displayTitle, setDisplayTitle] = useState(image.altText);
  const [displayOrder, setDisplayOrder] = useState(String(image.order));
  const slotMeta = getSlotMeta(image.category);
  const SlotIcon = slotMeta.icon;

  useEffect(() => {
    setDisplayTitle(image.altText);
    setDisplayOrder(String(image.order));
    setSaveState("idle");
  }, [image.altText, image.id, image.order]);

  useEffect(() => {
    if (!formRef.current) {
      return;
    }

    lastSavedSnapshotRef.current = serializeForm(formRef.current);
  }, [image.altText, image.category, image.id, image.order, image.imageUrl, image.isActive]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (saveState !== "saved") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSaveState("idle");
    }, 1400);

    return () => window.clearTimeout(timeout);
  }, [saveState]);

  async function saveCurrentForm() {
    const form = formRef.current;

    if (!form) {
      return;
    }

    const snapshot = serializeForm(form);

    if (snapshot === lastSavedSnapshotRef.current) {
      return;
    }

    if (saveInFlightRef.current) {
      saveQueuedRef.current = true;
      return;
    }

    saveInFlightRef.current = true;
    setSaveState("saving");

    try {
      await saveGalleryImageAction(new FormData(form));
      lastSavedSnapshotRef.current = snapshot;
      setSaveState("saved");
    } catch (error) {
      console.error("Falha ao salvar imagem da personalizacao.", error);
      setSaveState("error");
    } finally {
      saveInFlightRef.current = false;

      if (saveQueuedRef.current) {
        saveQueuedRef.current = false;
        void saveCurrentForm();
      }
    }
  }

  function scheduleSave(delay = 120) {
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      void saveCurrentForm();
    }, delay);
  }

  function handleBlurCapture(event: FocusEvent<HTMLFormElement>) {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (target.type === "checkbox" || target.type === "hidden" || target.type === "file") {
      return;
    }

    scheduleSave();
  }

  return (
    <article className="rounded-[1.75rem] border border-white/70 bg-white/90 p-4 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm">
      <form ref={formRef} className="space-y-4" onBlurCapture={handleBlurCapture}>
        <input type="hidden" name="id" value={image.id} />
        <input type="hidden" name="category" value={image.category} readOnly />
        <input type="hidden" name="isActive" value="true" readOnly />

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <SlotIcon className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {slotMeta.eyebrow}
              </p>
              <h3 className="truncate text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {displayTitle || "Sem descricao"}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Ordem {displayOrder || "0"}
            </span>
          </div>
        </div>

        <UploadField
          name="imageUrl"
          label="Imagem"
          defaultValue={image.imageUrl}
          hideTextInput
          hideLabel
          hideTriggerButton
          previewActionLabel="Alterar imagem"
          onValueChange={() => scheduleSave(80)}
          className="space-y-0"
          previewClassName="aspect-[4/3] w-full rounded-[1.35rem] border border-slate-200/80 bg-slate-100 shadow-[0_18px_36px_rgba(15,23,42,0.12)]"
          previewImageClassName="object-cover transition duration-300 ease-out group-hover/upload:scale-[1.03] group-focus-within/upload:scale-[1.03]"
        />

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_7rem] sm:items-end">
          <FieldBlock label="Descricao da imagem">
            <Input
              name="altText"
              defaultValue={image.altText}
              onChange={(event) => setDisplayTitle(event.target.value)}
            />
          </FieldBlock>

          <FieldBlock label="Ordem">
            <Input
              name="order"
              type="number"
              defaultValue={image.order}
              onChange={(event) => setDisplayOrder(event.target.value)}
            />
          </FieldBlock>
        </div>

        <div className="flex min-h-5 items-center justify-end">
          <p aria-live="polite" className="inline-flex items-center gap-2 text-sm text-slate-500">
            {saveState === "saving" ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin text-slate-400" />
                Salvando...
              </>
            ) : null}
            {saveState === "saved" ? "Salvo" : null}
            {saveState === "error" ? "Falha ao salvar" : null}
          </p>
        </div>
      </form>
    </article>
  );
}
