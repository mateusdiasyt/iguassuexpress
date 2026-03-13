import { Camera, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";

type TourLocationSectionProps = {
  tourTitle: string;
  tourDescription: string;
  locationTitle: string;
  locationDescription: string;
};

export function TourLocationSection({
  tourTitle,
  tourDescription,
  locationTitle,
  locationDescription,
}: TourLocationSectionProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <article className="soft-card rounded-[1.8rem] p-7">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <Camera className="h-6 w-6" />
        </div>
        <h3 className="mt-6 text-4xl leading-none text-slate-950">{tourTitle}</h3>
        <p className="mt-4 text-sm leading-7 text-slate-600">{tourDescription}</p>
        <Button asChild className="mt-7">
          <a href="/tour-360">Abrir tour 360</a>
        </Button>
      </article>
      <article className="soft-card rounded-[1.8rem] p-7">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <MapPinned className="h-6 w-6" />
        </div>
        <h3 className="mt-6 text-4xl leading-none text-slate-950">{locationTitle}</h3>
        <p className="mt-4 text-sm leading-7 text-slate-600">{locationDescription}</p>
        <Button asChild variant="outline" className="mt-7">
          <a href="/localizacao">Ver localizacao</a>
        </Button>
      </article>
    </section>
  );
}
