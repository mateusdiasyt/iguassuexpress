"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronUp, Search } from "lucide-react";
import { buildOmnibeesUrl, validateReservationData } from "@/lib/omnibees";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type BookingSearchCardProps = {
  baseUrl: string;
  hotelId: string;
};

type BookingCardMode = "inline" | "floating";

function formatReservationHint(value: string) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${day}/${month}`;
}

export function BookingSearchCard({
  baseUrl,
  hotelId,
}: BookingSearchCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [values, setValues] = useState({
    checkIn: "",
    checkOut: "",
    rooms: "1",
    adults: "2",
    children: "0",
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsMounted(true));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    function syncFloatingState() {
      const rect = cardRef.current?.getBoundingClientRect();
      const enoughScroll = window.scrollY > Math.min(260, window.innerHeight * 0.32);
      const inlineCardIsGone = rect ? rect.bottom <= 0 : enoughScroll;
      const shouldFloat = enoughScroll && inlineCardIsGone;

      setIsFloatingVisible(shouldFloat);

      if (!shouldFloat) {
        setIsFloatingOpen(false);
      }
    }

    syncFloatingState();
    window.addEventListener("scroll", syncFloatingState, { passive: true });
    window.addEventListener("resize", syncFloatingState);

    return () => {
      window.removeEventListener("scroll", syncFloatingState);
      window.removeEventListener("resize", syncFloatingState);
    };
  }, []);

  useEffect(() => {
    if (!isFloatingOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!floatingRef.current?.contains(event.target as Node)) {
        setIsFloatingOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFloatingOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFloatingOpen]);

  function update(name: string, value: string) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      rooms: Number(values.rooms),
      adults: Number(values.adults),
      children: Number(values.children),
      childAges: [],
    };

    const parsed = validateReservationData(payload);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Confira os dados da reserva.");
      return;
    }

    const url = buildOmnibeesUrl(payload, { baseUrl, hotelId });
    window.location.assign(url);
  }

  const floatingSummary =
    values.checkIn && values.checkOut
      ? `${formatReservationHint(values.checkIn)} → ${formatReservationHint(values.checkOut)}`
      : "Abrir busca";

  function renderCard(mode: BookingCardMode) {
    const isFloating = mode === "floating";

    return (
      <form
        onSubmit={handleSubmit}
        className={cn(
          "rounded-[2rem] border p-6 backdrop-blur-xl transition-all",
          isFloating
            ? "w-[min(calc(100vw-2rem),24rem)] border-white/12 bg-slate-950/78 text-white shadow-[0_28px_90px_rgba(6,18,31,0.45)]"
            : "glass-panel border-white/20 text-white",
        )}
      >
        <div className={cn("flex items-center gap-3", isFloating ? "mb-5" : "mb-6")}>
          <div
            className={cn(
              "flex items-center justify-center rounded-2xl",
              isFloating ? "h-11 w-11 bg-white/12" : "h-12 w-12 bg-white/10",
            )}
          >
            <CalendarDays
              className={cn(isFloating ? "h-[1.125rem] w-[1.125rem]" : "h-5 w-5")}
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/58">
              Reserva direta
            </p>
            <h3
              className={cn(
                "leading-tight font-extrabold",
                isFloating ? "text-[1.25rem]" : "text-[1.45rem] md:text-[1.6rem]",
              )}
            >
              {isFloating ? "Continue sua reserva" : "Verifique disponibilidade"}
            </h3>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-white/72">
            Entrada
            <Input
              type="date"
              value={values.checkIn}
              onChange={(event) => update("checkIn", event.target.value)}
              className="border-white/15 bg-white/12 text-white [color-scheme:dark]"
            />
          </label>
          <label className="grid gap-2 text-sm text-white/72">
            Saída
            <Input
              type="date"
              value={values.checkOut}
              onChange={(event) => update("checkOut", event.target.value)}
              className="border-white/15 bg-white/12 text-white [color-scheme:dark]"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2 text-sm text-white/72">
            Quartos
            <Select
              value={values.rooms}
              onChange={(event) => update("rooms", event.target.value)}
              className="border-white/15 bg-white/12 text-white"
            >
              {[1, 2, 3, 4].map((item) => (
                <option key={item} value={item} className="text-slate-900">
                  {item}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-2 text-sm text-white/72">
            Adultos
            <Select
              value={values.adults}
              onChange={(event) => update("adults", event.target.value)}
              className="border-white/15 bg-white/12 text-white"
            >
              {[1, 2, 3, 4].map((item) => (
                <option key={item} value={item} className="text-slate-900">
                  {item}
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-2 text-sm text-white/72">
            Crianças
            <Select
              value={values.children}
              onChange={(event) => update("children", event.target.value)}
              className="border-white/15 bg-white/12 text-white"
            >
              {[0, 1, 2, 3, 4].map((item) => (
                <option key={item} value={item} className="text-slate-900">
                  {item}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className={cn("mt-6 flex", isFloating ? "justify-stretch" : "justify-end")}>
          <Button
            type="submit"
            className={cn(
              "rounded-full border border-white/40 bg-white/14 text-white shadow-[0_12px_30px_rgba(4,24,39,0.2)] backdrop-blur-md hover:bg-white/22",
              isFloating ? "w-full justify-center" : "px-5",
            )}
          >
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>

        {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
      </form>
    );
  }

  const floatingBubble = (
    <div
      className={cn(
        "pointer-events-none fixed right-[5.35rem] bottom-5 z-40 transition-all duration-300 max-[520px]:right-5 max-[520px]:bottom-[5.35rem]",
        isFloatingVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
    >
      <div ref={floatingRef} className="flex flex-col items-end gap-3">
        <div
          className={cn(
            "origin-bottom-right transition-all duration-300",
            isFloatingOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-2 scale-95 opacity-0",
          )}
        >
          {renderCard("floating")}
        </div>

        <button
          type="button"
          onClick={() => setIsFloatingOpen((current) => !current)}
          className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/82 px-3 py-3 text-left text-white shadow-[0_20px_70px_rgba(6,18,31,0.45)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900/88"
          aria-expanded={isFloatingOpen}
          aria-label={isFloatingOpen ? "Fechar reserva direta" : "Abrir reserva direta"}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <CalendarDays className="h-[1.125rem] w-[1.125rem]" />
          </div>

          <div className="min-w-[7.5rem]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/45">
              Reserva direta
            </p>
            <p className="text-sm font-semibold text-white">{floatingSummary}</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6">
            <ChevronUp
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                isFloatingOpen ? "rotate-0" : "rotate-180",
              )}
            />
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div ref={cardRef}>{renderCard("inline")}</div>
      {isMounted ? createPortal(floatingBubble, document.body) : null}
    </>
  );
}
