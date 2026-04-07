"use client";

import Image from "next/image";
import { Facebook, Instagram, MessageCircle } from "lucide-react";
import type { SocialLinks } from "@/lib/social-links";
import {
  normalizeExternalUrl,
  resolveWhatsAppSocialHref,
} from "@/lib/social-links";
import { cn } from "@/lib/utils";

type FloatingWhatsAppButtonProps = {
  phone: string;
  socialLinks?: SocialLinks;
};

export function FloatingWhatsAppButton({
  phone,
  socialLinks,
}: FloatingWhatsAppButtonProps) {
  const whatsappHref = resolveWhatsAppSocialHref(socialLinks?.whatsapp, phone);
  const actions = [
    {
      label: "WhatsApp",
      href: whatsappHref,
      tone: "bg-emerald-500 text-white hover:bg-emerald-600",
      icon: (
        <Image
          src="/whatsapp.png"
          alt=""
          width={18}
          height={18}
          aria-hidden="true"
          className="h-[18px] w-[18px] object-contain"
        />
      ),
    },
    {
      label: "Instagram",
      href: normalizeExternalUrl(socialLinks?.instagram),
      tone: "bg-[#d9467a] text-white hover:bg-[#c23369]",
      icon: <Instagram className="h-4 w-4" />,
    },
    {
      label: "Facebook",
      href: normalizeExternalUrl(socialLinks?.facebook),
      tone: "bg-[#2f6fd6] text-white hover:bg-[#245bb3]",
      icon: <Facebook className="h-4 w-4" />,
    },
  ].filter((action) => action.href);

  return (
    <div className="group fixed right-5 bottom-5 z-50 flex items-end justify-end">
      <div className="pointer-events-none absolute right-0 bottom-16 flex flex-col items-end gap-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        {actions.map((action, index) => (
          <a
            key={action.label}
            href={action.href}
            target="_blank"
            rel="noreferrer"
            aria-label={action.label}
            className={cn(
              "flex h-11 w-11 translate-y-3 scale-90 items-center justify-center rounded-full shadow-[0_16px_34px_rgba(15,23,42,0.22)] ring-1 ring-white/30 backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:scale-100 group-focus-within:translate-y-0 group-focus-within:scale-100",
              action.tone,
            )}
            style={{ transitionDelay: `${index * 45}ms` }}
          >
            {action.icon}
          </a>
        ))}
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir canais de contato"
        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/18 bg-brand-deep text-white shadow-[0_22px_46px_rgba(6,45,71,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-brand focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/25"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
