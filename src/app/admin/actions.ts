"use server";
import { db } from "@/db";
import { categories, products, banners, users, clickLogs, settings } from "@/db/schema";
import { eq, gte, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// SECURITY Check
async function checkAuth() { return true; }

// --- Login / Logout ---
export async function login(password: string) {
  // මෙහි ඔබගේ මුරපදය පරීක්ෂා කිරීමේ logic එක එක් කරන්න
  if (password === process.env.ADMIN_PASSWORD || "admin123") {
    cookies().set("admin_session", "true", { httpOnly: true });
    return { success: true };
  }
  return { success: false };
}

export async function logout() {
  cookies().delete("admin_session");
}

// --- Products ---
export async function addProduct(data: any) {
  await checkAuth();
  await db.insert(products).values(data);
  revalidatePath("/"); revalidatePath("/admin");
}

export async function updateProduct(id: number, data: any) {
  await checkAuth();
  await db.update(products).set(data).where(eq(products.id, id));
  revalidatePath("/"); revalidatePath("/admin");
}

export async function deleteProduct(id: number) {
  await checkAuth();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/"); revalidatePath("/admin");
}

// --- Categories (Renamed to 'upsertCategory' to match UI) ---
export async function upsertCategory(data: any) {
  await checkAuth();
  const slug = data.name.toLowerCase().replace(/ /g, '-');
  if (data.id) {
    await db.update(categories).set({ ...data, slug }).where(eq(categories.id, data.id));
  } else {
    await db.insert(categories).values({ ...data, slug });
  }
  revalidatePath("/"); revalidatePath("/admin");
}

export async function addCategory(data: any) {
  return upsertCategory(data);
}

export async function deleteCategory(id: number) {
  await checkAuth();
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/"); revalidatePath("/admin");
}

// --- Banners (Renamed to 'upsertBanner' to match UI) ---
export async function upsertBanner(data: any) {
  await checkAuth();
  if (data.id) {
    await db.update(banners).set(data).where(eq(banners.id, data.id));
  } else {
    await db.insert(banners).values(data);
  }
  revalidatePath("/"); revalidatePath("/admin");
}

export async function addBanner(data: any) {
  return upsertBanner(data);
}

export async function deleteBanner(id: number) {
  await checkAuth();
  await db.delete(banners).where(eq(banners.id, id));
  revalidatePath("/"); revalidatePath("/admin");
}

// --- Users Admin ---
export async function deleteUser(id: number) {
  await checkAuth();
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/admin");
}

export async function clearAllUsers() {
  await checkAuth();
  await db.delete(users);
  revalidatePath("/admin");
}

// --- Analytics ---
export async function logAffiliateClick(productId: number) {
  await db.insert(clickLogs).values({ productId });
}

export async function clearAnalytics(period: string) {
  await checkAuth();
  if (period === 'all') {
    await db.delete(clickLogs);
  } else {
    const days = period === 'today' ? 0 : period === '7days' ? 7 : 30;
    const date = new Date(); date.setDate(date.getDate() - days);
    await db.delete(clickLogs).where(gte(clickLogs.clickedAt, date));
  }
  revalidatePath("/admin");
}

// --- Settings ---
export async function updateSetting(key: string, value: string) {
  await checkAuth();
  await db.insert(settings).values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}
