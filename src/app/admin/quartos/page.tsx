import {
  deleteRoomAction,
  deleteRoomCategoryAction,
  saveRoomAction,
  saveRoomCategoryAction,
} from "@/actions/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import { RoomsWorkspace } from "@/components/admin/rooms/rooms-workspace";
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
  const categories = await getRoomCategories(true);

  const categoryItems = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    badge: category.badge ?? null,
    description: category.description ?? null,
    heroImage: category.heroImage ?? null,
    order: category.order,
    isActive: category.isActive,
    roomCount: category.rooms.length,
  }));

  const roomItems = categories.flatMap((category) =>
    category.rooms.map((room) => ({
      id: room.id,
      categoryId: "categoryId" in room ? room.categoryId : category.id,
      categoryName: category.name,
      categoryOrder: category.order,
      title: room.title,
      slug: room.slug,
      occupancy: room.occupancy,
      shortDescription: room.shortDescription,
      fullDescription: room.fullDescription,
      features: room.features,
      coverImage: room.coverImage,
      gallery: room.gallery,
      isActive: room.isActive,
      order: room.order,
    })),
  );

  return (
    <AdminShell
      title="Quartos"
      description="Gerencie categorias, ocupacao, descricoes, comodidades e imagens."
      pathname="/admin/quartos"
      userName={session.user.name}
    >
      <RoomsWorkspace
        categories={categoryItems}
        rooms={roomItems}
        saveRoomAction={saveRoomAction}
        deleteRoomAction={deleteRoomAction}
        saveCategoryAction={saveRoomCategoryAction}
        deleteCategoryAction={deleteRoomCategoryAction}
      />
    </AdminShell>
  );
}
