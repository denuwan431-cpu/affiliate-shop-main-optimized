"use server";
import { db } from "@/db";
import { categories, products, banners, users, clickLogs, settings } from "@/db/schema";
import { eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// --- SECURITY ---
async function generateToken(secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode("authenticated"));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function login(password: string) {
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";
  if (password === adminPass) {
    const token = await generateToken(process.env.ADMIN_SESSION_SECRET || adminPass);
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, { httpOnly: true, secure: true, path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 });
    return { success: true };
  }
  return { success: false };
}

export async function logout() { (await cookies()).delete("admin_session"); }

// --- PRODUCTS (Fixed: updateProduct added) ---
export async function addProduct(data: any) { 
  await db.insert(products).values(data); 
  revalidatePath("/"); 
  revalidatePath("/admin");
}

export async function updateProduct(id: number, data: any) { 
  await db.update(products).set(data).where(eq(products.id, id)); 
  revalidatePath("/"); 
  revalidatePath("/admin");
}

export async function deleteProduct(id: number) { 
  await db.delete(products).where(eq(products.id, id)); 
  revalidatePath("/"); 
  revalidatePath("/admin");
}

// --- CATEGORIES ---
export async function upsertCategory(data: any) { 
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (data.id) await db.update(categories).set({ ...data, slug }).where(eq(categories.id, data.id));
  else await db.insert(categories).values({ ...data, slug });
  revalidatePath("/"); 
}

export async function deleteCategory(id: number) { 
  await db.delete(categories).where(eq(categories.id, id)); 
  revalidatePath("/"); 
}

// --- BANNERS ---
export async function upsertBanner(data: any) { 
  if (data.id) await db.update(banners).set(data).where(eq(banners.id, data.id));
  else await db.insert(banners).values(data);
  revalidatePath("/"); 
}

export async function deleteBanner(id: number) { 
  await db.delete(banners).where(eq(banners.id, id)); 
  revalidatePath("/"); 
}

// --- USERS & ANALYTICS ---
export async function deleteUser(id: number) { await db.delete(users).where(eq(users.id, id)); revalidatePath("/admin"); }
export async function clearAllUsers() { await db.delete(users); revalidatePath("/admin"); }

export async function clearAnalytics(period: string) {
  if (period === 'all') await db.delete(clickLogs);
  else {
    const days = period === 'today' ? 0 : period === '7days' ? 7 : 30;
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
    await db.delete(clickLogs).where(gte(clickLogs.clickedAt, cutoff));
  }
  revalidatePath("/admin");
}

export async function updateSetting(key: string, value: string) { 
  await db.insert(settings).values({ key, value }).onConflictDoUpdate({ target: settings.key, set: { value } }); 
}

export async function logAffiliateClick(productId: number) { await db.insert(clickLogs).values({ productId }); }
