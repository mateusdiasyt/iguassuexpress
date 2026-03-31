"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, LoaderCircle, Star, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadAssetFromClient } from "@/lib/client-upload";

type UploadGalleryFieldProps = {
  name: string;
  label: string;
  defaultValue?: string[] | null;
};

function normalizeItems(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

export function UploadGalleryField({
  name,
  label,
  defaultValue,
}: UploadGalleryFieldProps) {
  const [items, setItems] = useState(() => normalizeItems(defaultValue ?? []));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const serializedValue = useMemo(() => items.join("\n"), [items]);

  function removeItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function moveItem(fromIndex: number, toIndex: number) {
    setItems((current) => {
      if (toIndex < 0 || toIndex >= current.length || fromIndex === toIndex) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  function moveToTop(index: number) {
    moveItem(index, 0);
  }

  async function handleChange(fileList?: FileList | null) {
    const files = Array.from(fileList ?? []);

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

      setItems((current) => normalizeItems([...current, ...uploaded]));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Falha no upload.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serializedValue} />

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-600">{label}</label>
        <p className="text-sm leading-6 text-slate-500">
          Envie fotos panoramicas 360 e organize a ordem das cenas para definir o que aparece primeiro.
        </p>
        <p className="text-xs leading-6 text-slate-400">
          O ideal e usar imagens equiretangulares em formato 2:1. Para imagens publicas do site, a Blob Store vinculada ao projeto precisa estar em modo public.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-[1.6rem] border border-brand/10 bg-slate-50/80 p-4">
        <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-brand/20 px-4 py-3 text-sm text-slate-600 transition hover:border-brand/40 hover:bg-brand/5">
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Enviar nova cena 360
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => void handleChange(event.target.files)}
          />
        </label>
      </div>

      {items.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="overflow-hidden rounded-[1.4rem] border border-brand/10 bg-white shadow-[0_14px_28px_rgba(15,23,42,0.06)]"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <Image
                  src={item}
                  alt={`Cena 360 ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand/70">
                    Cena {index + 1}
                  </p>
                  <p className="mt-2 line-clamp-2 break-all text-sm leading-6 text-slate-500">
                    {item}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 gap-2 px-3 text-xs tracking-[0.06em]"
                    disabled={index === 0}
                    onClick={() => moveItem(index, index - 1)}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                    Subir
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 gap-2 px-3 text-xs tracking-[0.06em]"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, index + 1)}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                    Descer
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 gap-2 px-3 text-xs tracking-[0.06em]"
                    disabled={index === 0}
                    onClick={() => moveToTop(index)}
                  >
                    <Star className="h-3.5 w-3.5" />
                    Priorizar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 gap-2 px-3 text-xs tracking-[0.06em] text-red-600 hover:bg-red-50"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remover
                  </Button>
                </div>
                {index === 0 ? (
                  <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                    Cena principal da Home
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.6rem] border border-dashed border-brand/15 bg-slate-50 px-5 py-8 text-sm leading-7 text-slate-500">
          Nenhuma cena adicionada ainda. Envie imagens panoramicas para montar a galeria 360.
        </div>
      )}

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
