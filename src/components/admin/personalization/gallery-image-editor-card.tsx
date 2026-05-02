"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import {
  Building2,
  Coffee,
  ImageIcon,
  LoaderCircle,
  Plus,
  Trash2,
  type LucideIcon,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { deleteGalleryImageAction, saveGalleryImageAction } from "@/actions/admin";
import { UploadField } from "@/components/admin/upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type GalleryImageRecord = {
  id: string;
  category: string;
  imageUrl?: string | null;
  altText: string;
  order: number | string;
  isActive: boolean;
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

function SaveFeedback({ saveState }: { saveState: SaveState }) {
  return (
    <p aria-live="polite" className="inline-flex min-h-5 items-center gap-2 text-sm text-slate-500">
      {saveState === "saving" ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin text-slate-400" />
          Salvando...
        </>
      ) : null}
      {saveState === "saved" ? "Salvo" : null}
      {saveState === "error" ? "Falha ao salvar" : null}
    </p>
  );
}

function GalleryTile({
  title,
  eyebrow,
  order,
  imageUrl,
  icon: Icon,
  actionLabel,
  className,
}: {
  title: string;
  eyebrow: string;
  order?: string;
  imageUrl?: string | null;
  icon: LucideIcon;
  actionLabel: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-[1.8rem] border border-white/70 bg-white shadow-[0_22px_48px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.12)]",
        className,
      )}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={title} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" />
      ) : (
        <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-400">
          Sem imagem
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/12 to-slate-950/8" />

      <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-sm">
          <Icon className="h-3.5 w-3.5" />
          {eyebrow}
        </span>

        {order ? (
          <span className="rounded-full bg-slate-950/50 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/88 backdrop-blur-sm">
            Ordem {order}
          </span>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="line-clamp-2 text-[1.05rem] leading-[1.02] font-semibold tracking-[-0.03em] text-white">
          {title}
        </p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition duration-200 group-hover:bg-slate-950/28 group-hover:opacity-100">
        <span className="rounded-full bg-white/94 px-4 py-2 text-sm font-medium text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.16)] backdrop-blur-sm">
          {actionLabel}
        </span>
      </div>
    </div>
  );
}

function GalleryImageDialog({
  open,
  onOpenChange,
  title,
  eyebrow,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-slate-950/52 backdrop-blur-md" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[130] max-h-[88vh] w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[2rem] border border-white/70 bg-white/95 p-5 shadow-[0_38px_120px_rgba(15,23,42,0.18)] backdrop-blur-xl md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {eyebrow}
              </p>
              <Dialog.Title className="mt-2 text-[1.8rem] leading-[0.94] font-semibold tracking-[-0.04em] text-slate-950 md:text-[2.2rem]">
                {title}
              </Dialog.Title>
            </div>

            <Dialog.Close className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="mt-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function GalleryImageEditorCard({ image }: { image: GalleryImageRecord }) {
  const router = useRouter();
  const slotMeta = getSlotMeta(image.category);
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(image.imageUrl ?? "");
  const [altText, setAltText] = useState(image.altText);
  const [order, setOrder] = useState(String(image.order));
  const [saveState, setSaveState] = useState<SaveState>("idle");

  async function handleSave() {
    setSaveState("saving");

    try {
      const formData = new FormData();
      formData.set("id", image.id);
      formData.set("category", image.category);
      formData.set("imageUrl", imageUrl);
      formData.set("altText", altText);
      formData.set("order", order);
      formData.set("isActive", "true");

      await saveGalleryImageAction(formData);
      setSaveState("saved");
      router.refresh();
    } catch (error) {
      console.error("Falha ao salvar imagem da galeria.", error);
      setSaveState("error");
    }
  }

  async function handleDelete() {
    const shouldDelete = window.confirm("Deseja remover esta foto da galeria?");

    if (!shouldDelete) {
      return;
    }

    setSaveState("saving");

    try {
      const formData = new FormData();
      formData.set("id", image.id);
      await deleteGalleryImageAction(formData);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Falha ao excluir imagem da galeria.", error);
      setSaveState("error");
    }
  }

  const canSave = Boolean(imageUrl.trim() && altText.trim().length >= 2);

  return (
    <GalleryImageDialog open={open} onOpenChange={setOpen} title={altText || "Editar foto"} eyebrow="Galeria publica">
      <Dialog.Trigger asChild>
        <button type="button" className="text-left">
          <GalleryTile
            title={altText || "Sem descricao"}
            eyebrow={slotMeta.eyebrow}
            order={String(order)}
            imageUrl={imageUrl}
            icon={slotMeta.icon}
            actionLabel="Editar foto"
          />
        </button>
      </Dialog.Trigger>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.78fr)]">
        <div className="space-y-4">
          <UploadField
            name="imageUrl"
            label="Imagem"
            value={imageUrl}
            onValueChange={setImageUrl}
            hideTextInput
            hideTriggerButton
            previewActionLabel="Alterar imagem"
            previewClassName="aspect-[4/3] h-auto w-full rounded-[1.5rem] border border-slate-200/80 bg-slate-100 shadow-[0_20px_48px_rgba(15,23,42,0.10)]"
            previewImageClassName="object-cover transition duration-300 ease-out group-hover/upload:scale-[1.03] group-focus-within/upload:scale-[1.03]"
          />

          <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm text-slate-500">
            Essa imagem aparece na grade publica de <span className="font-medium text-slate-950">/galeria-de-fotos</span>.
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_7.5rem]">
            <FieldBlock label="Descricao da imagem">
              <Input value={altText} onChange={(event) => setAltText(event.target.value)} />
            </FieldBlock>

            <FieldBlock label="Ordem">
              <Input type="number" value={order} onChange={(event) => setOrder(event.target.value)} />
            </FieldBlock>
          </div>

          <div className="rounded-[1.35rem] border border-slate-200/80 bg-white/80 p-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Visual atual
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                {slotMeta.eyebrow}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                Ordem {order || "0"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-slate-200/80 bg-slate-50/70 p-4">
            <SaveFeedback saveState={saveState} />

            <div className="flex items-center gap-2">
              <Button variant="outline" type="button" className="h-11 w-11 px-0" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button type="button" disabled={!canSave || saveState === "saving"} onClick={() => void handleSave()}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GalleryImageDialog>
  );
}

export function GalleryImageCreateCard({ nextOrder }: { nextOrder: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [order, setOrder] = useState(String(nextOrder));
  const [saveState, setSaveState] = useState<SaveState>("idle");

  function resetDraft() {
    setImageUrl("");
    setAltText("");
    setOrder(String(nextOrder));
    setSaveState("idle");
  }

  async function handleCreate() {
    setSaveState("saving");

    try {
      const formData = new FormData();
      formData.set("category", "Galeria");
      formData.set("imageUrl", imageUrl);
      formData.set("altText", altText);
      formData.set("order", order);
      formData.set("isActive", "true");

      await saveGalleryImageAction(formData);
      setSaveState("saved");
      resetDraft();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Falha ao criar imagem da galeria.", error);
      setSaveState("error");
    }
  }

  const canSave = Boolean(imageUrl.trim() && altText.trim().length >= 2);

  return (
    <GalleryImageDialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          resetDraft();
        }
      }}
      title="Adicionar nova foto"
      eyebrow="Galeria publica"
    >
      <Dialog.Trigger asChild>
        <button type="button" className="text-left">
          <div className="group flex aspect-[4/3] flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-slate-300 bg-white/72 p-6 text-center shadow-[0_18px_36px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:bg-white hover:shadow-[0_24px_48px_rgba(15,23,42,0.10)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/8 text-brand transition duration-300 group-hover:scale-105 group-hover:bg-brand/12">
              <Plus className="h-6 w-6" />
            </span>
            <p className="mt-4 text-lg font-semibold tracking-[-0.03em] text-slate-950">Adicionar foto</p>
            <p className="mt-1 text-sm text-slate-500">Nova imagem para a galeria publica</p>
          </div>
        </button>
      </Dialog.Trigger>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.78fr)]">
        <div className="space-y-4">
          <UploadField
            name="imageUrl"
            label="Imagem"
            value={imageUrl}
            onValueChange={setImageUrl}
            hideTextInput
            hideTriggerButton
            previewActionLabel={imageUrl ? "Alterar imagem" : "Enviar imagem"}
            previewClassName="aspect-[4/3] h-auto w-full rounded-[1.5rem] border border-slate-200/80 bg-slate-100 shadow-[0_20px_48px_rgba(15,23,42,0.10)]"
            previewImageClassName="object-cover transition duration-300 ease-out group-hover/upload:scale-[1.03] group-focus-within/upload:scale-[1.03]"
          />
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_7.5rem]">
            <FieldBlock label="Descricao da imagem">
              <Input value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Ex.: Fachada do hotel" />
            </FieldBlock>

            <FieldBlock label="Ordem">
              <Input type="number" value={order} onChange={(event) => setOrder(event.target.value)} />
            </FieldBlock>
          </div>

          <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/70 px-4 py-3 text-sm text-slate-500">
            A nova foto sera publicada na grade de <span className="font-medium text-slate-950">/galeria-de-fotos</span>.
          </div>

          <div className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-slate-200/80 bg-slate-50/70 p-4">
            <SaveFeedback saveState={saveState} />

            <Button type="button" disabled={!canSave || saveState === "saving"} onClick={() => void handleCreate()}>
              Adicionar
            </Button>
          </div>
        </div>
      </div>
    </GalleryImageDialog>
  );
}
