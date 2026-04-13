"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ImagePlus, LoaderCircle, Pin, Trash2, Upload } from "lucide-react";
import { uploadAssetFromClient } from "@/lib/client-upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RoomImagesFieldProps = {
  name: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onPrimaryImageSelect?: (value: string) => void;
  maxItems?: number;
  className?: string;
};

function normalizeRoomImages(items: string[], maxItems: number) {
  const seen = new Set<string>();

  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .slice(0, maxItems);
}

function serializeRoomImages(items: string[]) {
  return items.join("\n");
}

export function RoomImagesField({
  name,
  label,
  value,
  onValueChange,
  onPrimaryImageSelect,
  maxItems = 3,
  className,
}: RoomImagesFieldProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const items = useMemo(
    () => normalizeRoomImages(value.split("\n"), maxItems),
    [maxItems, value],
  );

  const remainingSlots = maxItems - items.length;

  function updateItems(nextItems: string[]) {
    onValueChange(serializeRoomImages(normalizeRoomImages(nextItems, maxItems)));
  }

  function removeItem(index: number) {
    updateItems(items.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveToFirst(index: number) {
    if (index === 0) {
      return;
    }

    const nextItems = [...items];
    const [selected] = nextItems.splice(index, 1);
    nextItems.unshift(selected);
    const serialized = serializeRoomImages(normalizeRoomImages(nextItems, maxItems));
    onValueChange(serialized);
    onPrimaryImageSelect?.(serialized);
  }

  async function handleUpload(fileList?: FileList | null) {
    const files = Array.from(fileList ?? []).slice(0, remainingSlots);

    if (!files.length) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const uploaded: string[] = [];

      for (const file of files) {
        const url = await uploadAssetFromClient(file, "image");
        uploaded.push(url);
      }

      updateItems([...items, ...uploaded]);

      if ((fileList?.length ?? 0) > remainingSlots) {
        setError(`Foram mantidas apenas ${maxItems} fotos por quarto.`);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Falha no upload.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-[1.6rem] border border-slate-200/80 bg-white p-4 shadow-[0_18px_38px_rgba(15,23,42,0.05)]",
        className,
      )}
    >
      <input type="hidden" name={name} value={serializeRoomImages(items)} readOnly />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <p className="text-sm leading-6 text-slate-500">
            Ate 3 fotos. A primeira vira a capa do card e a ordem abaixo define o slider.
          </p>
        </div>
        <span className="rounded-full border border-brand/10 bg-slate-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {items.length}/{maxItems}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        <div className="relative overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-slate-100">
          <div className="relative h-52">
            {items[0] ? (
              <Image
                src={items[0]}
                alt="Foto principal do quarto"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#dbe7f3,#edf3f8_65%,#f8fafc)] text-slate-400">
                <div className="flex flex-col items-center gap-3 text-center">
                  <ImagePlus className="h-7 w-7" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Nenhuma foto ainda</p>
                    <p className="text-xs text-slate-400">A primeira imagem sera a principal.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {items[0] ? (
            <div
              className="absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/72 text-white backdrop-blur-md"
              aria-label="Imagem principal"
              title="Imagem principal"
            >
              <Pin className="h-4 w-4" />
            </div>
          ) : null}
        </div>

        <label
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-brand/20 px-4 py-3 text-sm text-slate-600 transition hover:border-brand/40 hover:bg-brand/5",
            remainingSlots <= 0 && "cursor-not-allowed opacity-55 hover:border-brand/20 hover:bg-transparent",
          )}
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {remainingSlots > 0 ? "Enviar fotos do quarto" : "Limite de fotos atingido"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={remainingSlots <= 0 || loading}
            onChange={(event) => {
              void handleUpload(event.target.files);
              event.target.value = "";
            }}
          />
        </label>

        {items.length ? (
          <div className="grid grid-cols-3 gap-3">
            {items.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className={cn(
                  "group/thumb relative overflow-hidden rounded-[1rem] border border-slate-200/80 bg-slate-100",
                  index === 0 && "ring-2 ring-brand/25",
                )}
              >
                <div
                  className="relative block h-24 w-full"
                  aria-label={index === 0 ? "Foto principal do quarto" : `Foto ${index + 1} do quarto`}
                >
                  <Image
                    src={item}
                    alt={`Foto ${index + 1} do quarto`}
                    fill
                    className="object-cover transition duration-300 group-hover/thumb:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
                </div>

                <button
                  type="button"
                  className={cn(
                    "absolute left-2 top-2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/92 p-0 text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.12)] backdrop-blur-md transition hover:scale-[1.03] hover:bg-white",
                    index === 0 && "border-brand/20 bg-brand text-white hover:bg-brand",
                  )}
                  onClick={() => moveToFirst(index)}
                  aria-label={
                    index === 0
                      ? "Imagem em destaque"
                      : `Definir foto ${index + 1} como destaque`
                  }
                  title={
                    index === 0
                      ? "Imagem em destaque"
                      : "Fixar como imagem principal"
                  }
                >
                  <Pin className="h-3.5 w-3.5" />
                </button>

                <div className="absolute right-2 bottom-2 z-20 flex items-center justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-7 w-7 rounded-full border-white/40 bg-white/88 p-0 text-red-500 hover:bg-white"
                    onClick={() => removeItem(index)}
                    aria-label={`Remover foto ${index + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {items.length > 1 ? (
          <p className="text-xs leading-6 text-slate-400">
            Use o pin para definir qual foto fica em destaque no card.
          </p>
        ) : null}

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    </div>
  );
}
