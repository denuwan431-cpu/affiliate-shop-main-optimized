import { db } from "@/db";
import { products, categories, banners, settings, clickLogs, users } from "@/db/schema";
import AdminUI from "./AdminUI";
import { desc } from "drizzle-orm";

export default async function AdminPage() {
  // Fetching all data for Admin UI
  const [allProducts, allCats, allBanners, allSettings, allClicks, allUsers] = await Promise.all([
    db.query.products.findMany({ with: { category: true }, orderBy: [desc(products.createdAt)] }),
    db.query.categories.findMany(),
    db.query.banners.findMany(),
    db.query.settings.findMany(),
    db.query.clickLogs.findMany({ with: { product: true }, orderBy: [desc(clickLogs.clickedAt)], limit: 50 }),
    db.query.users.findMany()
  ]);

  // Convert settings array to object
  const settingsObj = allSettings.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return (
    <AdminUI 
      products={allProducts} 
      categories={allCats} 
      banners={allBanners} 
      initialSettings={settingsObj} 
      clickStats={allClicks}
      users={allUsers} // Requirement 7
    />
  );
}
