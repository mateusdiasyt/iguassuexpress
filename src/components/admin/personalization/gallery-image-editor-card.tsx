"use client";

import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { deleteGalleryImageAction, saveGalleryImageAction } from "@/actions/admin";
import { UploadField } from "@/components/admin/upload-field";
import { Button } from "@/components/ui/button";
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

function serializeForm(form: HTMLFormElement) {
  return Array.from(new FormData(form).entries())
    .map(([key, value]) => [key, typeof value === "string" ? value : value.name] as const)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");
}

function InlineVisibilityToggle({
  name,
  defaultChecked = true,
}: {
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label
      aria-label="Exibir na galeria publica"
      title="Exibir na galeria publica"
      className="relative inline-flex h-8 w-[3.3rem] shrink-0 cursor-pointer items-center"
    >
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="absolute inset-0 rounded-full border border-slate-200 bg-slate-200/90 transition peer-checked:border-slate-900 peer-checked:bg-slate-900" />
      <span
        aria-hidden="true"
        className="absolute left-1 top-1 h-6 w-6 rounded-full border border-white/90 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.16)] transition-transform duration-200 ease-out peer-checked:translate-x-[1.35rem]"
      />
    </label>
  );
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
  const deleteFormId = `delete-gallery-image-${image.id}`;
  const formRef = useRef<HTMLFormElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);
  const saveInFlightRef = useRef(false);
  const saveQueuedRef = useRef(false);
  const lastSavedSnapshotRef = useRef("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [displayTitle, setDisplayTitle] = useState(image.altText);
  const [displayCategory, setDisplayCategory] = useState(image.category);
  const [displayOrder, setDisplayOrder] = useState(String(image.order));

  useEffect(() => {
    setDisplayTitle(image.altText);
    setDisplayCategory(image.category);
    setDisplayOrder(String(image.order));
    setSaveState("idle");
  }, [image.altText, image.category, image.id, image.order]);

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
    <article className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_28px_70px_rgba(15,23,42,0.08)]">
      <div className="grid gap-0 xl:grid-cols-[240px_minmax(0,1fr)] xl:items-start">
        <form
          ref={formRef}
          className="contents"
          onBlurCapture={handleBlurCapture}
          onChangeCapture={(event) => {
            const target = event.target;

            if (!(target instanceof HTMLInputElement)) {
              return;
            }

            if (target.type === "checkbox") {
              scheduleSave(80);
            }
          }}
        >
          <input type="hidden" name="id" value={image.id} />

          <div className="self-start border-b border-slate-200/80 bg-slate-50/70 p-4 xl:rounded-br-[1.6rem] xl:border-b-0 xl:border-r">
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
              previewClassName="aspect-[1/1] w-full rounded-[1.35rem] border border-slate-200/80 bg-slate-100 shadow-[0_18px_36px_rgba(15,23,42,0.12)]"
              previewImageClassName="object-cover transition duration-300 ease-out group-hover/upload:scale-[1.03] group-focus-within/upload:scale-[1.03]"
            />
          </div>

          <div className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {displayCategory || "Sem categoria"}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Ordem {displayOrder || "0"}
                  </span>
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-slate-950">
                  {displayTitle || "Sem descricao"}
                </h3>
              </div>

              <InlineVisibilityToggle name="isActive" defaultChecked={image.isActive} />
            </div>

            <div className="mt-6 grid gap-5">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_8rem]">
                <FieldBlock label="Categoria">
                  <Input
                    name="category"
                    defaultValue={image.category}
                    onChange={(event) => setDisplayCategory(event.target.value)}
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

              <FieldBlock label="Descricao da imagem">
                <Input
                  name="altText"
                  defaultValue={image.altText}
                  onChange={(event) => setDisplayTitle(event.target.value)}
                />
              </FieldBlock>

              <div className="flex items-center justify-between gap-3">
                <p
                  aria-live="polite"
                  className="inline-flex min-h-5 items-center gap-2 text-sm text-slate-500"
                >
                  {saveState === "saving" ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin text-slate-400" />
                      Salvando...
                    </>
                  ) : null}
                  {saveState === "saved" ? "Salvo automaticamente" : null}
                  {saveState === "error" ? "Falha ao salvar" : null}
                  {saveState === "idle" ? "Salva ao sair do campo" : null}
                </p>

                <Button
                  type="submit"
                  form={deleteFormId}
                  variant="outline"
                  className="h-10 w-10 border-slate-200 p-0 text-red-600 normal-case tracking-normal hover:bg-red-50 hover:text-red-700"
                  aria-label={`Remover foto ${image.altText}`}
                  title="Remover foto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <form id={deleteFormId} action={deleteGalleryImageAction}>
        <input type="hidden" name="id" value={image.id} />
      </form>
    </article>
  );
}
