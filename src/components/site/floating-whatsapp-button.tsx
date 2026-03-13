import { formatWhatsAppHref } from "@/lib/utils";

type FloatingWhatsAppButtonProps = {
  phone: string;
};

export function FloatingWhatsAppButton({ phone }: FloatingWhatsAppButtonProps) {
  return (
    <a
      href={formatWhatsAppHref(phone, "Ola! Gostaria de fazer uma reserva.")}
      target="_blank"
      rel="noreferrer"
      className="fixed right-5 bottom-5 z-50 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-4 text-sm font-semibold text-white shadow-2xl shadow-[#25D366]/35 transition hover:bg-[#1ebe5d]"
    >
      <img src="/whatsapp.png" alt="WhatsApp" className="h-5 w-5 object-contain" />
      WhatsApp
    </a>
  );
}
