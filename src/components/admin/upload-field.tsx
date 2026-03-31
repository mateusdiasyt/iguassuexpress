"use client";

import { useEffect, useId, useState } from "react";
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
  form?: string;
  className?: string;
  inputClassName?: string;
  previewClassName?: string;
  previewImageClassName?: string;
  hideTextInput?: boolean;
  hidePreview?: boolean;
  hideTriggerButton?: boolean;
  hideLabel?: boolean;
  previewActionLabel?: string;
  previewFallbackSrc?: string | null;
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
  form,
  className,
  inputClassName,
  previewClassName,
  previewImageClassName,
  hideTextInput = false,
  hidePreview = false,
  hideTriggerButton = false,
  hideLabel = false,
  previewActionLabel,
  previewFallbackSrc,
}: UploadFieldProps) {
  const inputId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const previewValue = value || previewFallbackSrc || "";

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
      {!hideLabel ? <label className="text-sm font-medium text-slate-600">{label}</label> : null}
      {hideTextInput ? (
        <input type="hidden" name={name} form={form} value={value} readOnly />
      ) : (
        <Input
          className={inputClassName}
          name={name}
          form={form}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      )}
      <input
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          void handleChange(file);
        }}
      />
      {!hideTriggerButton ? (
        <label
          htmlFor={inputId}
          className="flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-brand/20 bg-white px-4 py-3 text-sm text-slate-600 transition hover:border-brand/40 hover:bg-brand/5"
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Enviar arquivo
        </label>
      ) : null}
      {kind === "image" && !hidePreview && (previewValue || hideTriggerButton) ? (
        <div
          className={cn(
            "group/upload relative h-32 overflow-hidden rounded-2xl border border-brand/10 bg-slate-100",
            previewClassName,
          )}
        >
          {previewValue ? (
            <Image
              src={previewValue}
              alt={label}
              fill
              className={cn("object-cover", previewImageClassName)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Sem imagem
            </div>
          )}
          {previewActionLabel ? (
            <label
              htmlFor={inputId}
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-slate-950/0 opacity-0 transition duration-200 group-hover/upload:bg-slate-950/30 group-hover/upload:opacity-100 group-focus-within/upload:bg-slate-950/30 group-focus-within/upload:opacity-100"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg backdrop-blur-sm">
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {loading ? "Enviando..." : previewActionLabel}
              </span>
            </label>
          ) : null}
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
