import { redirect } from "next/navigation";
import { reservationSearchSchema } from "@/schemas/public";

export const DEFAULT_OMNIBEES_CONFIG = {
  baseUrl: "https://book.omnibees.com/hotelresults",
  hotelId: "2458",
};

export type ReservationSearchInput = {
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  childAges?: number[];
};

export function formatDateToOmnibees(date: string) {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    throw new Error("Data invalida para a Omnibees.");
  }

  return `${day}${month}${year}`;
}

export function validateReservationData(input: ReservationSearchInput) {
  return reservationSearchSchema.safeParse({
    ...input,
    childAges: input.childAges ?? [],
  });
}

export function buildOmnibeesUrl(
  input: ReservationSearchInput,
  config = DEFAULT_OMNIBEES_CONFIG,
) {
  const parsed = reservationSearchSchema.parse({
    ...input,
    childAges: input.childAges ?? [],
  });

  const url = new URL(config.baseUrl);
  url.searchParams.set("q", config.hotelId);
  url.searchParams.set("NRooms", String(parsed.rooms));
  url.searchParams.set("ad", String(parsed.adults));
  url.searchParams.set("ch", String(parsed.children));
  url.searchParams.set("ag", parsed.childAges.length ? parsed.childAges.join(",") : "");
  url.searchParams.set("CheckIn", formatDateToOmnibees(parsed.checkIn));
  url.searchParams.set("CheckOut", formatDateToOmnibees(parsed.checkOut));

  return url.toString();
}

export function redirectToOmnibees(
  input: ReservationSearchInput,
  config = DEFAULT_OMNIBEES_CONFIG,
) {
  redirect(buildOmnibeesUrl(input, config));
}
