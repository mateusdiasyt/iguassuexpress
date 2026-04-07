import {
  Facebook,
  Instagram,
  MessageCircle,
  Youtube,
} from "lucide-react";
import { saveSocialLinksAction } from "@/actions/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { getSiteSettings } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";
import { formatWhatsAppHref } from "@/lib/utils";
import { getSocialLinks } from "@/lib/social-links";

export const metadata = buildMetadata({
  title: "Redes Sociais Admin",
  description: "Links sociais usados no rodapé e nos atalhos flutuantes do site.",
  path: "/admin/redes-sociais",
  noIndex: true,
});

const socialFields = [
  {
    name: "whatsapp",
    label: "WhatsApp",
    description: "Canal principal do balão flutuante.",
    placeholder: "https://wa.me/5545999990000",
    icon: MessageCircle,
  },
  {
    name: "instagram",
    label: "Instagram",
    description: "Aparece no rodapé e no balão social.",
    placeholder: "https://www.instagram.com/iguassuexpresshotel/",
    icon: Instagram,
  },
  {
    name: "facebook",
    label: "Facebook",
    description: "Aparece no rodapé e no balão social.",
    placeholder: "https://www.facebook.com/iguassuexpresshotel",
    icon: Facebook,
  },
  {
    name: "youtube",
    label: "YouTube",
    description: "Aparece no rodapé do site.",
    placeholder: "https://www.youtube.com/@iguassuexpresshotel",
    icon: Youtube,
  },
] as const;

export default async function AdminSocialLinksPage() {
  const session = await requireAdmin();
  const settings = await getSiteSettings();
  const socialLinks = getSocialLinks(settings.socialLinks);
  const fallbackWhatsApp = socialLinks.whatsapp || formatWhatsAppHref(settings.whatsapp);

  return (
    <AdminShell
      title="Redes sociais"
      description="Gerencie os links públicos usados no rodapé e no botão flutuante do site."
      pathname="/admin/redes-sociais"
      userName={session.user.name}
    >
      <form action={saveSocialLinksAction} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-[2rem] border border-brand/10 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/55">
                Presença digital
              </p>
              <h2 className="mt-3 text-3xl leading-none text-slate-950">
                Links principais
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-500">
              Use URLs completas quando possível. No WhatsApp, também aceitamos apenas o número.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {socialFields.map((field) => {
              const Icon = field.icon;
              const value =
                field.name === "whatsapp"
                  ? fallbackWhatsApp
                  : socialLinks[field.name] ?? "";

              return (
                <label
                  key={field.name}
                  className="group grid gap-4 rounded-[1.6rem] border border-slate-200/80 bg-slate-50/70 p-4 transition hover:border-brand/20 hover:bg-white hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
                >
                  <span className="flex items-start gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand shadow-sm ring-1 ring-slate-200/80 transition group-hover:bg-brand group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-950">
                        {field.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {field.description}
                      </span>
                    </span>
                  </span>

                  <Input
                    name={field.name}
                    defaultValue={value}
                    placeholder={field.placeholder}
                    className="bg-white"
                  />
                </label>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end rounded-[1.4rem] border border-slate-200/80 bg-slate-50/70 p-3">
            <SubmitButton>Salvar redes sociais</SubmitButton>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-brand/10 bg-brand-deep p-6 text-white shadow-[0_30px_70px_rgba(6,45,71,0.22)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
            Preview
          </p>
          <h2 className="mt-3 text-3xl leading-none">Atalhos do site</h2>
          <p className="mt-4 text-sm leading-7 text-white/68">
            Esses links alimentam os ícones sociais do rodapé e o botão flutuante de contato.
          </p>

          <div className="mt-8 grid gap-3">
            {socialFields.map((field) => {
              const Icon = field.icon;
              const value =
                field.name === "whatsapp"
                  ? fallbackWhatsApp
                  : socialLinks[field.name] ?? "";

              return (
                <div
                  key={`preview-${field.name}`}
                  className="flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-white/7 px-4 py-3"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{field.label}</p>
                    <p className="truncate text-xs text-white/45">
                      {value || "Sem link cadastrado"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </form>
    </AdminShell>
  );
}
