"use server";
import { db } from "@/db";
import { categories, products, banners, users, clickLogs, settings } from "@/db/schema";
import { eq, gte, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// SECURITY Check - මෙයට අමතර ආරක්ෂාවක් අවශ්‍ය නම් පසුව එක් කළ හැක
async function checkAuth() { return true; }

// --- Login / Logout ---
export async function login(password: string) {
  // මුරපදය පරීක්ෂා කිරීම (Vercel Variables වල නැත්නම් "admin123" භාවිතා වේ)
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";
  
  if (password === adminPass) {
    const cookieStore = await cookies();
    // Cookie එක සැකසීම - path: "/" යන්න අනිවාර්යයෙන්ම තිබිය යුතුය
    cookieStore.set("admin_session", "true", { 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/", 
      sameSite: "lax",
      maxAge: 60 * 60 * 24 // දින 1ක් සඳහා වලංගු වේ
    });
    return { success: true };
  }
  return { success: false };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

// --- Products ---
export async function addProduct(data: any) {
  await checkAuth();
  await db.insert(products).values(data);
  revalidatePath("/"); 
  revalidatePath("/admin");
}

export async function updateProduct(id: number, data: any) {
  await checkAuth();
  await db.update(products).set(data).where(eq(products.id, id));
  revalidatePath("/"); 
  revalidatePath("/admin");
}

export async function deleteProduct(id: number) {
  await checkAuth();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/"); 
  revalidatePath("/admin");
}

// --- Categories ---
export async function upsertCategory(data: any) {
  await checkAuth();
  // Name එකෙන් slug එකක් සාදා ගැනීම (උදා: Mobile Phone -> mobile-phone)
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  if (data.id) {
    await db.update(categories).set({ ...data, slug }).where(eq(categories.id, data.id));
  } else {
    await db.insert(categories).values({ ...data, slug });
  }
  revalidatePath("/"); 
  revalidatePath("/admin");
}

export async function addCategory(data: any) {
  return upsertCategory(data);
}

export async function deleteCategory(id: number) {
  await checkAuth();
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/"); 
  revalidatePath("/admin");
}

// --- Banners ---
export async function upsertBanner(data: any) {
  await checkAuth();
  if (data.id) {
    await db.update(banners).set(data).where(eq(banners.id, data.id));
  } else {
    await db.insert(banners).values(data);
  }
  revalidatePath("/"); 
  revalidatePath("/admin");
}

export async function addBanner(data: any) {
  return upsertBanner(data);
}

export async function deleteBanner(id: number) {
  await checkAuth();
  await db.delete(banners).where(eq(banners.id, id));
  revalidatePath("/"); 
  revalidatePath("/admin");
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
    const date = new Date(); 
    date.setDate(date.getDate() - days);
    await db.delete(clickLogs).where(gte(clickLogs.clickedAt, date));
  }
  revalidatePath("/admin");
}

// --- Settings ---
export async function updateSetting(key: string, value: string) {
  await checkAuth();
  await db.insert(settings).values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
  revalidatePath("/admin");
}
