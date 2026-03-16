import Image from "next/image";
import { Button } from "@/components/ui/button";
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
    <section className="grid gap-8 rounded-[2rem] bg-brand-deep px-6 py-8 text-white shadow-[0_35px_90px_rgba(6,45,71,0.24)] md:grid-cols-[1fr_1.05fr] md:px-8">
      <div className="relative min-h-80 overflow-hidden rounded-[1.7rem]">
        {image ? <Image src={image} alt={title} fill className="object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />
      </div>
      <div className="flex flex-col justify-center">
        <SectionHeading
          eyebrow="Restaurante"
          title={title}
          description={description}
          layout="stacked"
          className="text-white [&_h2]:text-white [&_p]:text-white/72"
        />
        <div className="mt-8">
          <Button asChild className="bg-white text-brand hover:bg-slate-100">
            <a href="/restaurante">Explorar restaurante</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
