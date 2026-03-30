"use client";

import { type KeyboardEvent, useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";
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

  const selectedFeatures = useMemo(() => dedupeFeatures(parseList(value)), [value]);
  const availableFeatures = useMemo(
    () => dedupeFeatures([...suggestions, ...selectedFeatures]),
    [selectedFeatures, suggestions],
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

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    addFeature();
  }

  return (
    <div className="grid gap-3 text-sm text-slate-600">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="font-medium text-slate-600">{label}</label>
        <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
          {selectedFeatures.length} selecionada{selectedFeatures.length === 1 ? "" : "s"}
        </span>
      </div>

      <input type="hidden" name={name} value={serializeFeatures(selectedFeatures)} readOnly />

      <div className="grid gap-4 rounded-[1.6rem] border border-brand/10 bg-white/90 p-4">
        <div className="flex flex-wrap gap-2">
          {availableFeatures.map((feature) => {
            const isSelected = selectedFeatures.some(
              (item) => item.toLowerCase() === feature.toLowerCase(),
            );

            return (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-left text-sm transition",
                  isSelected
                    ? "border-brand bg-brand/8 text-brand shadow-[0_10px_24px_rgba(9,77,122,0.08)]"
                    : "border-brand/10 bg-slate-50 text-slate-600 hover:border-brand/30 hover:bg-brand/5",
                )}
                aria-pressed={isSelected}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border transition",
                    isSelected
                      ? "border-brand bg-brand text-white"
                      : "border-brand/15 bg-white text-transparent",
                  )}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>{feature}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 border-t border-brand/10 pt-4 md:grid-cols-[minmax(0,1fr)_auto]">
          <Input
            value={newFeature}
            onChange={(event) => setNewFeature(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Adicionar nova comodidade"
          />
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2 normal-case tracking-normal"
            onClick={addFeature}
          >
            <Plus className="h-4 w-4" />
            Adicionar tag
          </Button>
        </div>

        <p className="text-xs leading-6 text-slate-500">
          Marque as comodidades que esse quarto possui e adicione novas tags quando precisar.
        </p>
      </div>
    </div>
  );
}
