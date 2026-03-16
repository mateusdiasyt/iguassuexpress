import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

type RestaurantHighlightProps = {
  title: string;
  description: string;
  image?: string | null;
};

export function RestaurantHighlight({
  title,
  description,
  image,
}: RestaurantHighlightProps) {
  return (
    <section className="grid gap-10 md:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)] md:items-center">
      <div className="relative mx-auto w-full max-w-[520px]">
        <div
          className="relative aspect-[0.96] overflow-hidden bg-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70"
          style={{ clipPath: "polygon(0 12%, 14% 0, 100% 0, 100% 88%, 86% 100%, 0 100%)" }}
        >
          {image ? (
            <Image src={image} alt={title} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(145deg,#dfe9f2,#c8d7e4_48%,#aac0d3)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/34 via-slate-950/8 to-white/10" />
        </div>

        <div className="absolute -right-2 bottom-6 rounded-full border border-slate-200/80 bg-white/92 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-md">
          Cafe da manha + a la carte
        </div>
        <div className="absolute -left-3 top-8 h-16 w-16 rounded-full border border-white/70 bg-white/80 blur-[1px]" />
      </div>

      <div className="flex flex-col justify-center">
          <SectionHeading
            eyebrow="Restaurante"
            title={title}
            description={description}
            layout="stacked"
            className="max-w-none [&_h2]:max-w-none [&_h2]:text-[2.5rem] [&_h2]:leading-[0.94] md:[&_h2]:text-[3.2rem] [&_p]:max-w-[34rem] [&_p]:text-slate-600"
          />

        <div className="mt-8">
            <Link
              href="/restaurante"
              className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-brand transition-all duration-300 hover:gap-4 hover:text-brand-deep"
            >
              Explorar restaurante
              <ArrowUpRight className="h-4 w-4" />
            </Link>
        </div>
      </div>
    </section>
  );
}
