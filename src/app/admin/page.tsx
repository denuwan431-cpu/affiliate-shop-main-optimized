import { db } from "@/db";
import AdminUI from "./AdminUI";
import { getSettings, getClickStats } from "./actions";

// ✅ Important: prevent prerender at build time
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ✅ Ensure it runs on Node.js runtime (needed for DB drivers)
export const runtime = "nodejs";

export default async function AdminDashboard() {
  const [allProducts, allCategories, allBanners, settings, clickStats] =
    await Promise.all([
      db.query.products.findMany({
        with: { category: true },
        orderBy: (products, { desc }) => [desc(products.id)],
      }),
      db.query.categories.findMany(),
      db.query.banners.findMany(),
      getSettings(),
      getClickStats(),
    ]);

  return (
    <AdminUI
      products={allProducts}
      categories={allCategories}
      banners={allBanners}
      initialSettings={settings}
      clickStats={clickStats}
    />
  );
}