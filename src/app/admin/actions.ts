"use server";
import { db } from "@/db";
import { categories, products, banners, users, clickLogs } from "@/db/schema";
import { eq, gte, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// SECURITY: Verify admin session here if needed
async function checkAuth() { return true; }

// --- Categories ---
export async function upsertCategory(data: any) {
  await checkAuth();
  if (data.id) await db.update(categories).set(data).where(eq(categories.id, data.id));
  else await db.insert(categories).values(data);
  revalidatePath("/"); revalidatePath("/admin/categories");
}

export async function deleteCategory(id: number) {
  await checkAuth();
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
}

// --- Banners ---
export async function upsertBanner(data: any) {
  await checkAuth();
  if (data.id) await db.update(banners).set(data).where(eq(banners.id, data.id));
  else await db.insert(banners).values(data);
  revalidatePath("/"); revalidatePath("/admin/banners");
}

export async function deleteBanner(id: number) {
  await checkAuth();
  await db.delete(banners).where(eq(banners.id, id));
  revalidatePath("/admin/banners");
}

// --- Users ---
export async function deleteUser(id: number) {
  await checkAuth();
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/admin/users");
}

export async function clearAllUsers() {
  await checkAuth();
  await db.delete(users);
  revalidatePath("/admin/users");
}

// --- Analytics ---
export async function logAffiliateClick(productId: number) {
  await db.insert(clickLogs).values({ productId });
}

export async function clearAnalytics(period: string) {
  await checkAuth();
  if (period === 'all') await db.delete(clickLogs);
  else {
    const days = period === 'today' ? 0 : period === '7days' ? 7 : 30;
    const date = new Date(); date.setDate(date.getDate() - days);
    await db.delete(clickLogs).where(gte(clickLogs.clickedAt, date));
  }
  revalidatePath("/admin/analytics");
}
