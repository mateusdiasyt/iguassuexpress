import Link from "next/link";
import { formatPhoneHref, formatWhatsAppHref } from "@/lib/utils";

type FooterProps = {
  hotelName: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
};

export function Footer({
  hotelName,
  whatsapp,
  phone,
  email,
  address,
}: FooterProps) {
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
    </footer>
  );
}
