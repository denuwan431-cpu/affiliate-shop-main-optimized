import { db } from "@/db";
import { banners, categories, products, settings } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// බැනර් ලබා ගැනීමේ logic එක නිවැරදි කරන ලදී (isActive -> isEnabled)
export const getActiveBanners = unstable_cache(
  async () =>
    db.query.banners.findMany({
      where: eq(banners.isEnabled, true),
      orderBy: [asc(banners.order)],
    }),
  ['active-banners'],
  { revalidate: 300, tags: ['banners'] }
);

export const getEnabledCategories = unstable_cache(
  async () =>
    db.query.categories.findMany({
      where: eq(categories.isEnabled, true),
      orderBy: [asc(categories.order)],
    }),
  ['enabled-categories'],
  { revalidate: 300, tags: ['categories'] }
);

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

export const getProductById = (id: number) =>
  db.query.products.findFirst({
    where: eq(products.id, id),
    with: { category: true },
  });
