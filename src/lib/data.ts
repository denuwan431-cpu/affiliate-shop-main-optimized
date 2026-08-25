import { db } from "@/db";
import { banners, categories, products, settings } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// 1. වෙබ් අඩවියේ ඇති Categories ලබා ගැනීම (Fixes layout.tsx error)
export const getCategories = unstable_cache(
  async () =>
    db.query.categories.findMany({
      where: eq(categories.isEnabled, true),
      orderBy: [asc(categories.order)],
    }),
  ['categories-list'],
  { revalidate: 300, tags: ['categories'] }
);

// getEnabledCategories ලෙසද මෙය භාවිතා කළ හැක
export const getEnabledCategories = getCategories;

// 2. Active Banners ලබා ගැනීම
export const getActiveBanners = unstable_cache(
  async () =>
    db.query.banners.findMany({
      where: eq(banners.isEnabled, true),
      orderBy: [asc(banners.order)],
    }),
  ['active-banners'],
  { revalidate: 300, tags: ['banners'] }
);

// 3. Social Media සහ වෙනත් Settings ලබා ගැනීම
export const getSiteSettings = unstable_cache(
  async () => {
    const allSettings = await db.select().from(settings);
    return allSettings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
  },
  ['site-settings'],
  { revalidate: 300, tags: ['settings'] }
);

// 4. භාණ්ඩයක ID එක අනුව විස්තර ලබා ගැනීම
export const getProductById = (id: number) =>
  db.query.products.findFirst({
    where: eq(products.id, id),
    with: { category: true },
  });

// 5. Slug එක අනුව Category එක ලබා ගැනීම (Fixes category page error)
export const getCategoryBySlug = (slug: string) =>
  db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

// 6. Category ID එක අනුව භාණ්ඩ ලැයිස්තුව ලබා ගැනීම (Fixes category page error)
export const getProductsByCategoryId = (categoryId: number) =>
  db.query.products.findMany({
    where: eq(products.categoryId, categoryId),
    orderBy: [desc(products.createdAt)],
  });
