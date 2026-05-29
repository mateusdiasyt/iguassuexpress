const FALLBACK_MAP_QUERY = "Iguassu Express Hotel, Foz do Iguacu - PR";

type HotelMapInput = {
  hotelName?: string | null;
  address?: string | null;
};

function hasCityContext(value: string) {
  return /foz\s+do\s+igua(?:cu|\u00e7u)/i.test(value);
}

export function buildHotelMapQuery({ hotelName, address }: HotelMapInput) {
  const normalizedHotelName = hotelName?.trim();
  const normalizedAddress = address?.trim();
  const parts = [normalizedHotelName, normalizedAddress].filter(Boolean);

  if (!parts.length) {
    return FALLBACK_MAP_QUERY;
  }

  if (normalizedAddress && !hasCityContext(normalizedAddress)) {
    parts.push("Foz do Iguacu - PR");
  }

  return parts.join(", ");
}

export function buildGoogleMapsEmbedUrl(query: string) {
  const normalizedQuery = query.trim() || FALLBACK_MAP_QUERY;

  return `https://www.google.com/maps?q=${encodeURIComponent(normalizedQuery)}&z=17&output=embed`;
}

export function buildGoogleMapsSearchUrl(query: string) {
  const normalizedQuery = query.trim() || FALLBACK_MAP_QUERY;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalizedQuery)}`;
}
