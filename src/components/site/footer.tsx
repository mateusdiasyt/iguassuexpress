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
    <footer className="mt-24 rounded-[2rem] bg-brand-deep px-5 py-8 pb-28 text-white shadow-[0_35px_90px_rgba(6,45,71,0.28)] sm:px-6 sm:py-10 sm:pb-28 md:px-8 md:pb-10">
      <div className="mx-auto max-w-6xl space-y-8 xl:grid xl:grid-cols-[1.15fr_1.85fr] xl:gap-8 xl:space-y-0">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/60">
            {hotelName}
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
            Hotel institucional com foco em reserva direta, hospitalidade contemporânea e
            SEO local em Foz do Iguaçu.
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

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 xl:grid-cols-3 xl:gap-x-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65">
              Navegação
            </p>
            <div className="mt-4 grid gap-3 text-sm text-white/75">
              <Link className="transition-colors hover:text-white" href="/apartamentos">
                Apartamentos
              </Link>
              <Link className="transition-colors hover:text-white" href="/restaurante">
                Restaurante
              </Link>
              <Link className="transition-colors hover:text-white" href="/blog">
                Blog
              </Link>
              <Link className="transition-colors hover:text-white" href="/trabalhe-conosco">
                Carreiras
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65">
              Contatos
            </p>
            <div className="mt-4 grid gap-3 text-sm text-white/75">
              <a className="transition-colors hover:text-white" href={formatWhatsAppHref(whatsapp)}>
                {whatsapp}
              </a>
              <a className="transition-colors hover:text-white" href={formatPhoneHref(phone)}>
                {phone}
              </a>
              <a
                className="break-all transition-colors hover:text-white sm:break-normal"
                href={`mailto:${email}`}
              >
                {email}
              </a>
            </div>
          </div>

          <div className="col-span-2 xl:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65">
              Localização
            </p>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/75">{address}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-3 border-t border-white/10 pt-6 text-[0.95rem] leading-6 text-white/65 md:mt-10 md:flex-row md:items-center md:justify-between">
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
