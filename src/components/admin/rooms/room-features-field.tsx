"use client";

import { type KeyboardEvent, useMemo, useState } from "react";
import { Check, ListChecks, PencilLine, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, parseList } from "@/lib/utils";

type RoomFeaturesFieldProps = {
  name: string;
  label: string;
  value: string;
  suggestions: string[];
  onValueChange: (value: string) => void;
};

function normalizeFeatureLabel(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function serializeFeatures(features: string[]) {
  return features.join("\n");
}

function dedupeFeatures(items: string[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const normalized = normalizeFeatureLabel(item);

    if (!normalized) {
      return false;
    }

    const key = normalized.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function RoomFeaturesField({
  name,
  label,
  value,
  suggestions,
  onValueChange,
}: RoomFeaturesFieldProps) {
  const [newFeature, setNewFeature] = useState("");
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const selectedFeatures = useMemo(() => dedupeFeatures(parseList(value)), [value]);
  const availableFeatures = useMemo(
    () => dedupeFeatures([...suggestions, ...selectedFeatures]),
    [selectedFeatures, suggestions],
  );
  const orderedFeatures = useMemo(
    () =>
      [...availableFeatures].sort((left, right) => {
        const leftSelected = selectedFeatures.some(
          (item) => item.toLowerCase() === left.toLowerCase(),
        );
        const rightSelected = selectedFeatures.some(
          (item) => item.toLowerCase() === right.toLowerCase(),
        );

        if (leftSelected !== rightSelected) {
          return leftSelected ? -1 : 1;
        }

        return left.localeCompare(right, "pt-BR");
      }),
    [availableFeatures, selectedFeatures],
  );

  function updateFeatures(nextFeatures: string[]) {
    onValueChange(serializeFeatures(dedupeFeatures(nextFeatures)));
  }

  function toggleFeature(feature: string) {
    const featureKey = feature.toLowerCase();
    const exists = selectedFeatures.some((item) => item.toLowerCase() === featureKey);

    if (exists) {
      updateFeatures(selectedFeatures.filter((item) => item.toLowerCase() !== featureKey));
      return;
    }

    updateFeatures([...selectedFeatures, feature]);
  }

  function addFeature() {
    const normalized = normalizeFeatureLabel(newFeature);

    if (!normalized) {
      return;
    }

    const alreadyExists = selectedFeatures.some(
      (item) => item.toLowerCase() === normalized.toLowerCase(),
    );

    if (!alreadyExists) {
      updateFeatures([...selectedFeatures, normalized]);
    }

    setNewFeature("");
  }

  function startEditing(feature: string) {
    setEditingFeature(feature);
    setEditingValue(feature);
  }

  function cancelEditing() {
    setEditingFeature(null);
    setEditingValue("");
  }

  function removeFeature(feature: string) {
    updateFeatures(selectedFeatures.filter((item) => item.toLowerCase() !== feature.toLowerCase()));

    if (editingFeature?.toLowerCase() === feature.toLowerCase()) {
      cancelEditing();
    }
  }

  function saveEditedFeature() {
    if (!editingFeature) {
      return;
    }

    const normalized = normalizeFeatureLabel(editingValue);

    if (!normalized) {
      removeFeature(editingFeature);
      return;
    }

    const nextFeatures = selectedFeatures.map((feature) =>
      feature.toLowerCase() === editingFeature.toLowerCase() ? normalized : feature,
    );

    updateFeatures(nextFeatures);
    cancelEditing();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    addFeature();
  }

  function handleEditKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEditedFeature();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelEditing();
    }
  }

  return (
    <div className="grid gap-3 text-sm text-slate-600">
      <input type="hidden" name={name} value={serializeFeatures(selectedFeatures)} readOnly />

      <div className="overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white shadow-[0_18px_38px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/8 text-brand">
              <ListChecks className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand/70">
                Selecao visual
              </p>
              <label className="text-base font-semibold text-slate-900">{label}</label>
            </div>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {selectedFeatures.length} selecionada{selectedFeatures.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="space-y-4 px-4 py-4">
          {orderedFeatures.length ? (
            <div className="grid gap-2.5 md:grid-cols-2">
              {orderedFeatures.map((feature) => {
                const isSelected = selectedFeatures.some(
                  (item) => item.toLowerCase() === feature.toLowerCase(),
                );

                if (editingFeature?.toLowerCase() === feature.toLowerCase()) {
                  return (
                    <div
                      key={`${feature}-editing`}
                      className="flex flex-wrap items-center gap-2 rounded-[1rem] border border-brand/15 bg-white px-3 py-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] md:col-span-2"
                    >
                      <Input
                        value={editingValue}
                        onChange={(event) => setEditingValue(event.target.value)}
                        onKeyDown={handleEditKeyDown}
                        className="h-10 min-w-[12rem] flex-1 border-slate-200"
                        autoFocus
                      />
                      <Button
                        type="button"
                        className="h-10 gap-2 px-3 text-xs normal-case tracking-normal"
                        onClick={saveEditedFeature}
                      >
                        <Check className="h-4 w-4" />
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 gap-2 border-slate-200 px-3 text-xs text-slate-600 normal-case tracking-normal"
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  );
                }

                return (
                  <div
                    key={feature}
                    className={cn(
                      "group/feature flex min-h-11 items-center gap-2 rounded-[1rem] border px-3.5 py-2.5 transition",
                      isSelected
                        ? "border-brand/20 bg-[linear-gradient(180deg,#f8fbfe_0%,#f1f7fc_100%)] text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
                        : "border-slate-200/80 bg-white text-slate-600 hover:border-brand/20 hover:bg-slate-50",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      aria-pressed={isSelected}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
                          isSelected
                            ? "border-brand bg-brand text-white"
                            : "border-slate-200 bg-white text-transparent",
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-5">{feature}</span>
                    </button>

                    {isSelected ? (
                      <div className="pointer-events-none flex items-center gap-1 opacity-0 transition group-hover/feature:pointer-events-auto group-hover/feature:opacity-100 group-focus-within/feature:pointer-events-auto group-focus-within/feature:opacity-100">
                        <button
                          type="button"
                          onClick={() => startEditing(feature)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-brand"
                          aria-label={`Editar tag ${feature}`}
                          title="Editar tag"
                        >
                          <PencilLine className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remover tag ${feature}`}
                          title="Remover tag"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[1rem] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-5 text-sm leading-7 text-slate-500">
              Nenhuma comodidade disponivel ainda. Adicione a primeira tag abaixo.
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 bg-slate-50/75 px-4 py-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              value={newFeature}
              onChange={(event) => setNewFeature(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Adicionar nova comodidade"
              className="bg-white"
            />
            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2 border-slate-200 bg-white px-4 text-slate-700 normal-case tracking-normal hover:border-brand/20 hover:bg-white"
              onClick={addFeature}
            >
              <Plus className="h-4 w-4" />
              Adicionar tag
            </Button>
          </div>

          <p className="mt-3 text-xs leading-6 text-slate-500">
            Marque o que esse quarto possui e crie novas comodidades quando precisar.
          </p>
        </div>
      </div>
    </div>
  );
}
