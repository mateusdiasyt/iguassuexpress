import { saveRestaurantAction } from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadField } from "@/components/admin/upload-field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getRestaurantContent } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Restaurante Admin",
  description: "Edicao de textos, imagens e blocos do restaurante.",
  path: "/admin/restaurante",
  noIndex: true,
});

export default async function AdminRestaurantPage() {
  const session = await requireAdmin();
  const restaurant = await getRestaurantContent();

  return (
    <AdminShell
      title="Restaurante"
      description="Atualize o teaser da home, cafe da manha, a la carte e imagens."
      pathname="/admin/restaurante"
      userName={session.user.name}
    >
      <AdminCard title="Conteudo do restaurante">
        <form action={saveRestaurantAction} className="grid gap-6">
          <UploadField name="heroImage" label="Imagem principal" defaultValue={restaurant.heroImage} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              Titulo teaser
              <Input name="teaserTitle" defaultValue={restaurant.teaserTitle ?? ""} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Imagens da galeria
              <Textarea name="images" className="min-h-24" defaultValue={restaurant.images.join("\n")} />
            </label>
          </div>
          <label className="grid gap-2 text-sm text-slate-600">
            Descricao teaser
            <Textarea name="teaserDescription" defaultValue={restaurant.teaserDescription ?? ""} />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              Titulo do cafe da manha
              <Input name="breakfastTitle" defaultValue={restaurant.breakfastTitle} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Titulo do a la carte
              <Input name="aLaCarteTitle" defaultValue={restaurant.aLaCarteTitle} />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              Descricao do cafe da manha
              <Textarea name="breakfastDescription" defaultValue={restaurant.breakfastDescription} />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Descricao do a la carte
              <Textarea name="aLaCarteDescription" defaultValue={restaurant.aLaCarteDescription} />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <input type="checkbox" name="isBreakfastActive" defaultChecked={restaurant.isBreakfastActive} />
              Bloco de cafe da manha ativo
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <input type="checkbox" name="isALaCarteActive" defaultChecked={restaurant.isALaCarteActive} />
              Bloco a la carte ativo
            </label>
          </div>
          <div>
            <SubmitButton>Salvar restaurante</SubmitButton>
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
