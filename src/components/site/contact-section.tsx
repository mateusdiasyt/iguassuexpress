import { MessageCircle, PhoneCall } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatPhoneHref, formatWhatsAppHref } from "@/lib/utils";

type ContactSectionProps = {
  whatsapp: string;
  phone: string;
  mapEmbed?: string | null;
};

export function ContactSection({
  whatsapp,
  phone,
  mapEmbed,
}: ContactSectionProps) {
  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <SectionHeading
          eyebrow="Contato"
          title="Fale com nossa equipe"
          description="Atendimento direto e rápido para tirar dúvidas e iniciar sua reserva."
          layout="stacked"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "WhatsApp oficial",
              value: whatsapp,
              href: formatWhatsAppHref(whatsapp, "Gostaria de saber mais sobre o hotel."),
              icon: MessageCircle,
              highlight: true,
            },
            {
              title: "Telefone",
              value: phone,
              href: formatPhoneHref(phone),
              icon: PhoneCall,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className={
                  item.highlight
                    ? "rounded-[1.7rem] border border-emerald-200/70 bg-emerald-50/80 p-5 shadow-[0_16px_30px_rgba(16,185,129,0.15)] transition-transform duration-300 hover:-translate-y-0.5"
                    : "soft-card rounded-[1.7rem] p-5 transition-transform duration-300 hover:-translate-y-0.5"
                }
              >
                <span
                  className={
                    item.highlight
                      ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"
                      : "flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand"
                  }
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {item.title}
                  </p>
                  <p className="mt-2 text-base leading-7 text-slate-800">{item.value}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {mapEmbed ? (
        <div
          className="map-embed soft-card h-[300px] overflow-hidden rounded-[1.8rem]"
          dangerouslySetInnerHTML={{ __html: mapEmbed }}
        />
      ) : null}
    </section>
  );
}
