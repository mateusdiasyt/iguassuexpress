import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

type MetadataInput = {
  title?: string | null;
  description?: string | null;
  path?: string;
  image?: string | null;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: MetadataInput): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title: title ?? undefined,
    description: description ?? undefined,
    alternates: {
      canonical,
    },
    openGraph: {
      title: title ?? undefined,
      description: description ?? undefined,
      url: canonical,
      siteName: "Iguassu Express Hotel",
      locale: "pt_BR",
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? undefined,
      description: description ?? undefined,
      images: image ? [image] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
