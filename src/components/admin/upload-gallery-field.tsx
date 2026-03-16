"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { LoaderCircle, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [draftUrl, setDraftUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const serializedValue = useMemo(() => items.join("\n"), [items]);

  function addItem(url: string) {
    const normalized = url.trim();

    if (!normalized) {
      return;
    }

    setItems((current) => normalizeItems([...current, normalized]));
    setDraftUrl("");
  }

  function removeItem(url: string) {
    setItems((current) => current.filter((item) => item !== url));
  }

  async function handleChange(file?: File) {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const url = await uploadAssetFromClient(file, "image");
      addItem(url);
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
          Adicione quantas cenas quiser para alimentar a experiencia 360 da Home e da pagina publica.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-[1.6rem] border border-brand/10 bg-slate-50/80 p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            value={draftUrl}
            onChange={(event) => setDraftUrl(event.target.value)}
            placeholder="Cole a URL de uma imagem panoramica"
          />
          <Button
            type="button"
            variant="outline"
            className="gap-2 px-4 tracking-[0.08em]"
            onClick={() => addItem(draftUrl)}
          >
            <Plus className="h-4 w-4" />
            Adicionar URL
          </Button>
        </div>

        <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-brand/20 px-4 py-3 text-sm text-slate-600 transition hover:border-brand/40 hover:bg-brand/5">
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Enviar imagem para a galeria
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => void handleChange(event.target.files?.[0])}
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
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 px-4 tracking-[0.08em]"
                  onClick={() => removeItem(item)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remover
                </Button>
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
