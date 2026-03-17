"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LoaderCircle, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { uploadAssetFromClient } from "@/lib/client-upload";
import { cn } from "@/lib/utils";

type UploadStrategy = "auto" | "server" | "direct";

type UploadFieldProps = {
  name: string;
  label: string;
  defaultValue?: string | null;
  accept?: string;
  kind?: "image" | "document";
  uploadStrategy?: UploadStrategy;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  previewClassName?: string;
  previewImageClassName?: string;
};

export function UploadField({
  name,
  label,
  defaultValue,
  accept = "image/*",
  kind = "image",
  uploadStrategy = "auto",
  value: controlledValue,
  onValueChange,
  className,
  inputClassName,
  previewClassName,
  previewImageClassName,
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
      const url = await uploadAssetFromClient(file, kind, uploadStrategy);
      setValue(url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Falha no upload.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <Input
        className={inputClassName}
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-brand/20 px-4 py-3 text-sm text-slate-600 transition hover:border-brand/40 hover:bg-brand/5">
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        Enviar arquivo
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            void handleChange(file);
          }}
        />
      </label>
      {kind === "image" && value ? (
        <div
          className={cn(
            "relative h-32 overflow-hidden rounded-2xl border border-brand/10 bg-slate-100",
            previewClassName,
          )}
        >
          <Image
            src={value}
            alt={label}
            fill
            className={cn("object-cover", previewImageClassName)}
          />
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
