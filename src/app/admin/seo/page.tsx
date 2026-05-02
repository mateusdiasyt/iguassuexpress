import { AdminShell } from "@/components/admin/admin-shell";
import { SeoWorkspace } from "@/components/admin/seo/seo-workspace";
import { getPageContents, getSiteSettings } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "SEO Admin",
  description: "Gestao de SEO global e por pagina.",
  path: "/admin/seo",
  noIndex: true,
});

export default async function AdminSeoPage() {
  const session = await requireAdmin();
  const [settings, pages] = await Promise.all([getSiteSettings(), getPageContents()]);

  return (
    <AdminShell title="SEO" pathname="/admin/seo" userName={session.user.name}>
      <SeoWorkspace settings={settings} pages={pages} />
    </AdminShell>
  );
}
