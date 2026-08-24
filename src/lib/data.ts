import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { db } from '@/db';
import { products, categories, banners, settings } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * Site-wide data shown on (almost) every page — categories, banners, footer
 * settings. Previously these were re-fetched over HTTP from client components
 * on every single page load (Header/Footer/HeroBanner each did their own
 * `fetch('/api/...')` in a `useEffect`), which meant:
 *   1. An extra client → server round trip per request, per widget.
 *   2. A visible flash while the dropdown / footer links / banner popped in.
 *   3. The same DB rows queried again and again with no caching at all.
 *
 * `unstable_cache` here caches the query result in Next's Data Cache for
 * `revalidate` seconds, so under real traffic these hit Postgres roughly
 * once per window instead of once per request.
 */

export const getCategories = unstable_cache(
  async () =>
    db.query.categories.findMany({
      orderBy: (c, { asc }) => [asc(c.order)],
    }),
  ['categories-list'],
  { revalidate: 300, tags: ['categories'] }
);

export const getActiveBanners = unstable_cache(
  async () =>
    db.query.banners.findMany({
      where: eq(banners.isActive, true),
    }),
  ['active-banners'],
  { revalidate: 300, tags: ['banners'] }
);

export const getSiteSettings = unstable_cache(
  async () => {
    const rows = await db.query.settings.findMany();
    return rows.reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  },
  ['site-settings'],
  { revalidate: 300, tags: ['settings'] }
);

export const getFlashSaleProducts = unstable_cache(
  async () =>
    db.query.products.findMany({
      where: eq(products.isFlashSale, true),
      limit: 8,
    }),
  ['flash-sale-products'],
  { revalidate: 60, tags: ['products'] }
);

// `ORDER BY random()` forces Postgres to sort the whole table on every call —
// fine occasionally, expensive under real traffic. Caching it means the
// "random" shuffle only actually re-runs once per revalidate window instead
// of on every homepage hit.
export const getFeaturedProducts = unstable_cache(
  async () =>
    db.query.products.findMany({
      orderBy: [sql`random()`],
      limit: 18,
    }),
  ['featured-products-random'],
  { revalidate: 60, tags: ['products'] }
);

const getProductByIdCached = unstable_cache(
  async (id: number) =>
    db.query.products.findFirst({
      where: eq(products.id, id),
      with: { category: true },
    }),
  ['product-by-id'],
  { revalidate: 120, tags: ['products'] }
);

// product/[id]/page.tsx calls this twice per request — once from
// generateMetadata, once from the page component itself. Wrapping the cached
// fetcher in React's `cache()` de-dupes those two calls within the same
// request so it's a single DB round trip (or cache hit) instead of two.
export const getProductById = cache(getProductByIdCached);

export const getCategoryBySlug = unstable_cache(
  async (slug: string) =>
    db.query.categories.findFirst({
      where: (c, { eq }) => eq(c.slug, slug),
    }),
  ['category-by-slug'],
  { revalidate: 300, tags: ['categories'] }
);

export const getProductsByCategoryId = unstable_cache(
  async (categoryId: number) =>
    db.query.products.findMany({
      where: eq(products.categoryId, categoryId),
      limit: 60,
    }),
  ['products-by-category'],
  { revalidate: 60, tags: ['products'] }
);
