import {
  deleteRoomAction,
  deleteRoomCategoryAction,
  saveRoomAction,
  saveRoomCategoryAction,
} from "@/actions/admin";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { UploadField } from "@/components/admin/upload-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { getRoomCategories } from "@/data/queries";
import { requireAdmin } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Quartos Admin",
  description: "Gestao de categorias e quartos do hotel.",
  path: "/admin/quartos",
  noIndex: true,
});

export default async function AdminRoomsPage() {
  const session = await requireAdmin();
  const categories = await getRoomCategories();

  return (
    <AdminShell
      title="Quartos"
      description="Gerencie categorias, ocupacao, descricoes, comodidades e imagens."
      pathname="/admin/quartos"
      userName={session.user.name}
    >
      <AdminCard title="Nova categoria">
        <form action={saveRoomCategoryAction} className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-600">
            Nome
            <Input name="name" placeholder="Apartamentos Standard" />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Slug
            <Input name="slug" placeholder="standard" />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Badge
            <Input name="badge" placeholder="Mais reservado" />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Ordem
            <Input name="order" type="number" defaultValue="0" />
          </label>
          <label className="grid gap-2 text-sm text-slate-600 md:col-span-2">
            Descricao
            <Textarea name="description" />
          </label>
          <div className="md:col-span-2">
            <UploadField name="heroImage" label="Imagem da categoria" />
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600 md:col-span-2">
            <input type="checkbox" name="isActive" defaultChecked />
            Categoria ativa
          </label>
          <div className="md:col-span-2">
            <SubmitButton>Adicionar categoria</SubmitButton>
          </div>
        </form>
      </AdminCard>

      <div className="grid gap-6">
        {categories.map((category) => (
          <AdminCard key={category.id} title={category.name} description="Edite a categoria e os quartos vinculados abaixo.">
            <form action={saveRoomCategoryAction} className="grid gap-4">
              <input type="hidden" name="id" value={category.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-600">
                  Nome
                  <Input name="name" defaultValue={category.name} />
                </label>
                <label className="grid gap-2 text-sm text-slate-600">
                  Slug
                  <Input name="slug" defaultValue={category.slug} />
                </label>
                <label className="grid gap-2 text-sm text-slate-600">
                  Badge
                  <Input name="badge" defaultValue={category.badge ?? ""} />
                </label>
                <label className="grid gap-2 text-sm text-slate-600">
                  Ordem
                  <Input name="order" type="number" defaultValue={category.order} />
                </label>
              </div>
              <label className="grid gap-2 text-sm text-slate-600">
                Descricao
                <Textarea name="description" defaultValue={category.description ?? ""} />
              </label>
              <UploadField name="heroImage" label="Imagem da categoria" defaultValue={category.heroImage} />
              <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <input type="checkbox" name="isActive" defaultChecked={category.isActive} />
                Categoria ativa
              </label>
              <div className="flex flex-wrap gap-3">
                <SubmitButton>Salvar categoria</SubmitButton>
              </div>
            </form>
            <form action={deleteRoomCategoryAction} className="mt-4">
              <input type="hidden" name="id" value={category.id} />
              <button type="submit" className="text-sm font-semibold text-red-500">
                Excluir categoria
              </button>
            </form>

            <div className="mt-8 grid gap-5">
              {category.rooms.map((room) => (
                <div key={room.id} className="rounded-[1.7rem] border border-brand/10 bg-slate-50 p-5">
                  <h3 className="text-2xl leading-none text-slate-900">{room.title}</h3>
                  <form action={saveRoomAction} className="mt-5 grid gap-4">
                    <input type="hidden" name="id" value={room.id} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2 text-sm text-slate-600">
                        Categoria
                        <Select name="categoryId" defaultValue={category.id}>
                          {categories.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </Select>
                      </label>
                      <label className="grid gap-2 text-sm text-slate-600">
                        Titulo
                        <Input name="title" defaultValue={room.title} />
                      </label>
                      <label className="grid gap-2 text-sm text-slate-600">
                        Slug
                        <Input name="slug" defaultValue={room.slug} />
                      </label>
                      <label className="grid gap-2 text-sm text-slate-600">
                        Ocupacao
                        <Input name="occupancy" type="number" defaultValue={room.occupancy} />
                      </label>
                      <label className="grid gap-2 text-sm text-slate-600">
                        Ordem
                        <Input name="order" type="number" defaultValue={room.order} />
                      </label>
                      <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-white px-4 py-3 text-sm text-slate-600">
                        <input type="checkbox" name="isActive" defaultChecked={room.isActive} />
                        Quarto ativo
                      </label>
                    </div>
                    <label className="grid gap-2 text-sm text-slate-600">
                      Descricao curta
                      <Textarea name="shortDescription" defaultValue={room.shortDescription} className="min-h-24" />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      Descricao completa
                      <Textarea name="fullDescription" defaultValue={room.fullDescription} />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      Comodidades
                      <Textarea name="features" className="min-h-28" defaultValue={room.features.join("\n")} />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-600">
                      Galeria
                      <Textarea name="gallery" className="min-h-24" defaultValue={room.gallery.join("\n")} />
                    </label>
                    <UploadField name="coverImage" label="Imagem de capa" defaultValue={room.coverImage} />
                    <div className="flex flex-wrap gap-3">
                      <SubmitButton>Salvar quarto</SubmitButton>
                    </div>
                  </form>
                  <form action={deleteRoomAction} className="mt-4">
                    <input type="hidden" name="id" value={room.id} />
                    <button type="submit" className="text-sm font-semibold text-red-500">
                      Excluir quarto
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard title="Novo quarto">
        <form action={saveRoomAction} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-600">
              Categoria
              <Select name="categoryId" defaultValue={categories[0]?.id}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Titulo
              <Input name="title" placeholder="Duplo Superior" />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Slug
              <Input name="slug" placeholder="duplo-superior" />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Ocupacao
              <Input name="occupancy" type="number" defaultValue="2" />
            </label>
            <label className="grid gap-2 text-sm text-slate-600">
              Ordem
              <Input name="order" type="number" defaultValue="0" />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <input type="checkbox" name="isActive" defaultChecked />
              Quarto ativo
            </label>
          </div>
          <label className="grid gap-2 text-sm text-slate-600">
            Descricao curta
            <Textarea name="shortDescription" className="min-h-24" />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Descricao completa
            <Textarea name="fullDescription" />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Comodidades
            <Textarea name="features" className="min-h-28" />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Galeria
            <Textarea name="gallery" className="min-h-24" />
          </label>
          <UploadField name="coverImage" label="Imagem de capa" />
          <div>
            <SubmitButton>Adicionar quarto</SubmitButton>
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  );
}
