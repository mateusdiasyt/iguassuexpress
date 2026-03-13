"use client";

import { useState } from "react";
import { CalendarDays, Users } from "lucide-react";
import { buildOmnibeesUrl, validateReservationData } from "@/lib/omnibees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type BookingSearchCardProps = {
  baseUrl: string;
  hotelId: string;
};

export function BookingSearchCard({
  baseUrl,
  hotelId,
}: BookingSearchCardProps) {
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    checkIn: "",
    checkOut: "",
    rooms: "1",
    adults: "2",
    children: "0",
  });

  function update(name: string, value: string) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel rounded-[2rem] border-white/20 p-6 text-white"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
            Reserva direta
          </p>
          <h3 className="text-[1.45rem] leading-tight font-extrabold md:text-[1.6rem]">
            Verifique disponibilidade
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
          Saida
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
          Criancas
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Users className="h-4 w-4" />
          Motor oficial de reserva Omnibees
        </div>
        <Button type="submit" className="h-12 bg-white text-brand hover:bg-slate-100">
          Buscar agora
        </Button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
    </form>
  );
}
