"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LoaderCircle, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { uploadAssetFromClient } from "@/lib/client-upload";

type UploadFieldProps = {
  name: string;
  label: string;
  defaultValue?: string | null;
  accept?: string;
  kind?: "image" | "document";
  value?: string;
  onValueChange?: (value: string) => void;
};

export function UploadField({
  name,
  label,
  defaultValue,
  accept = "image/*",
  kind = "image",
  value: controlledValue,
  onValueChange,
}: UploadFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(defaultValue ?? "");
    }
  }, [defaultValue, isControlled]);

  function setValue(nextValue: string) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  async function handleChange(file?: File) {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const url = await uploadAssetFromClient(file, kind);
      setValue(url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Falha no upload.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <Input name={name} value={value} onChange={(event) => setValue(event.target.value)} />
      <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-brand/20 px-4 py-3 text-sm text-slate-600 transition hover:border-brand/40 hover:bg-brand/5">
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        Enviar arquivo
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => void handleChange(event.target.files?.[0])}
        />
      </label>
      {kind === "image" && value ? (
        <div className="relative h-32 overflow-hidden rounded-2xl border border-brand/10 bg-slate-100">
          <Image src={value} alt={label} fill className="object-cover" />
        </div>
      ) : null}
      {kind === "document" && value ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand">
          Abrir arquivo atual
        </a>
      ) : null}
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
