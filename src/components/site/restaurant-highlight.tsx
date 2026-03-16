import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Coffee, UtensilsCrossed } from "lucide-react";
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
    <section className="soft-card relative overflow-hidden rounded-[2.2rem] p-4 md:p-5">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
      <div className="absolute -top-16 right-10 h-36 w-36 rounded-full bg-brand/10 blur-3xl" />

      <div className="grid gap-6 md:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)] md:items-center">
        <div className="relative min-h-[320px] overflow-hidden rounded-[1.8rem] bg-slate-100">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(145deg,#dfe9f2,#c8d7e4_48%,#aac0d3)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/10 to-transparent" />
          <div className="absolute left-4 bottom-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/14 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
              <Coffee className="h-3.5 w-3.5" />
              Cafe da manha
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/14 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
              <UtensilsCrossed className="h-3.5 w-3.5" />
              A la carte
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center px-2 py-2 md:px-6">
          <SectionHeading
            eyebrow="Restaurante"
            title={title}
            description={description}
            layout="stacked"
            className="max-w-none [&_h2]:max-w-none [&_h2]:text-[2.4rem] [&_h2]:leading-[0.96] md:[&_h2]:text-[3.1rem] [&_p]:max-w-[34rem] [&_p]:text-slate-600"
          />

          <div className="mt-7 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-950/5 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Hospedagem completa
            </span>
            <span className="rounded-full bg-brand/8 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand">
              Experiencia gastronomica
            </span>
          </div>

          <div className="mt-8">
            <Link
              href="/restaurante"
              className="inline-flex h-12 items-center gap-3 rounded-full bg-brand px-6 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(9,77,122,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-deep"
            >
              Explorar restaurante
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
