import { Mail, MapPinned, MessageCircle, PhoneCall } from "lucide-react";
import { ContactForm } from "@/components/site/contact-form";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatPhoneHref, formatWhatsAppHref } from "@/lib/utils";

type ContactSectionProps = {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  mapEmbed?: string | null;
};

export function ContactSection({
  whatsapp,
  phone,
  email,
  address,
  mapEmbed,
}: ContactSectionProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Contato"
          title="Fale com nossa equipe"
          description="Escolha o melhor canal para falar com a recepcao, solicitar informacoes ou iniciar sua reserva."
        />
        <div className="grid gap-4">
          {[
            {
              title: "WhatsApp oficial",
              value: whatsapp,
              href: formatWhatsAppHref(whatsapp, "Gostaria de saber mais sobre o hotel."),
              icon: MessageCircle,
            },
            {
              title: "Telefone",
              value: phone,
              href: formatPhoneHref(phone),
              icon: PhoneCall,
            },
            {
              title: "E-mail",
              value: email,
              href: `mailto:${email}`,
              icon: Mail,
            },
            {
              title: "Endereco",
              value: address,
              href: "https://maps.google.com",
              icon: MapPinned,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="soft-card flex items-start gap-4 rounded-[1.7rem] p-5 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {item.title}
                  </p>
                  <p className="mt-2 text-base leading-7 text-slate-700">{item.value}</p>
                </div>
              </a>
            );
          })}
        </div>
        <Button asChild variant="outline">
          <a href={formatPhoneHref(phone)}>Ligar agora</a>
        </Button>
      </div>

      <div className="space-y-6">
        <ContactForm />
        {mapEmbed ? (
          <div
            className="map-embed soft-card h-[340px] overflow-hidden rounded-[1.8rem]"
            dangerouslySetInnerHTML={{ __html: mapEmbed }}
          />
        ) : null}
      </div>
    </section>
  );
}
