"use server";
import { db } from "@/db";
import { categories, products, banners, users, clickLogs, settings } from "@/db/schema";
import { eq, gte, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// --- SECURITY UTILITIES ---

// Middleware එකේ ඇති HMAC SHA-256 logic එකම මෙහි භාවිතා වේ
async function generateAuthToken(secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode("authenticated"));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session) return false;
  return true;
}

// --- AUTHENTICATION ACTIONS ---

export async function login(password: string) {
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || adminPass;
  
  if (password === adminPass) {
    const token = await generateAuthToken(sessionSecret);
    const cookieStore = await cookies();
    
    cookieStore.set("admin_session", token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/", 
      sameSite: "lax",
      maxAge: 60 * 60 * 24 // දින 1ක් සඳහා
    });
    return { success: true };
  }
  return { success: false };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

// --- PRODUCT ACTIONS ---

export async function addProduct(data: any) {
  if (!await checkAuth()) return;
  await db.insert(products).values(data);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateProduct(id: number, data: any) {
  if (!await checkAuth()) return;
  await db.update(products).set(data).where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProduct(id: number) {
  if (!await checkAuth()) return;
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}

// --- CATEGORY ACTIONS ---

export async function upsertCategory(data: any) {
  if (!await checkAuth()) return;
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
  if (!await checkAuth()) return;
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin");
}

// --- BANNER ACTIONS ---

export async function upsertBanner(data: any) {
  if (!await checkAuth()) return;
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
  if (!await checkAuth()) return;
  await db.delete(banners).where(eq(banners.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}

// --- USER ACTIONS ---

export async function deleteUser(id: number) {
  if (!await checkAuth()) return;
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/admin");
}

export async function clearAllUsers() {
  if (!await checkAuth()) return;
  await db.delete(users);
  revalidatePath("/admin");
}

// --- ANALYTICS ACTIONS ---

export async function logAffiliateClick(productId: number) {
  await db.insert(clickLogs).values({ productId });
}

export async function clearAnalytics(period: string) {
  if (!await checkAuth()) return;
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

// --- SETTINGS ACTIONS ---

export async function updateSetting(key: string, value: string) {
  if (!await checkAuth()) return;
  await db.insert(settings).values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
  revalidatePath("/admin");
}
