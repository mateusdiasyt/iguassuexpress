import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";
import type { SocialLinks } from "@/lib/social-links";
import { normalizeExternalUrl } from "@/lib/social-links";
import { formatPhoneHref, formatWhatsAppHref } from "@/lib/utils";

type FooterProps = {
  hotelName: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  socialLinks?: SocialLinks;
};

export function Footer({
  hotelName,
  whatsapp,
  phone,
  email,
  address,
  socialLinks,
}: FooterProps) {
  const socialItems = [
    {
      label: "Instagram",
      href: normalizeExternalUrl(socialLinks?.instagram),
      icon: Instagram,
    },
    {
      label: "Facebook",
      href: normalizeExternalUrl(socialLinks?.facebook),
      icon: Facebook,
    },
    {
      label: "YouTube",
      href: normalizeExternalUrl(socialLinks?.youtube),
      icon: Youtube,
    },
  ].filter((item) => item.href);

  return (
    <footer className="mt-24 rounded-[2rem] bg-brand-deep px-6 py-10 text-white shadow-[0_35px_90px_rgba(6,45,71,0.28)] md:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            {hotelName}
          </p>
          <p className="mt-5 text-sm leading-7 text-white/72">
            Hotel institucional com foco em reserva direta, hospitalidade contemporânea e SEO local em Foz do Iguaçu.
          </p>
          {socialItems.length ? (
            <div className="mt-6 flex items-center gap-2">
              {socialItems.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white/72 transition hover:-translate-y-0.5 hover:border-white/22 hover:bg-white hover:text-brand-deep"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65">
            Navegação
          </p>
          <div className="mt-4 grid gap-3 text-sm text-white/75">
            <Link href="/apartamentos">Apartamentos</Link>
            <Link href="/restaurante">Restaurante</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/trabalhe-conosco">Carreiras</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65">
            Contatos
          </p>
          <div className="mt-4 grid gap-3 text-sm text-white/75">
            <a href={formatWhatsAppHref(whatsapp)}>{whatsapp}</a>
            <a href={formatPhoneHref(phone)}>{phone}</a>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65">
            Localização
          </p>
          <p className="mt-4 text-sm leading-7 text-white/75">{address}</p>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Hotel Iguassu Express. Todos os direitos reservados.</p>
        <p className="text-white/75">
          Desenvolvido por{" "}
          <a
            href="https://www.instagram.com/devmateusmendoza/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-white transition-colors hover:text-[#d8c6a2]"
          >
            Mateus Mendoza
          </a>
        </p>
      </div>
    </footer>
  );
}
