'use server';

import { db } from '@/db';
import { products, categories, banners, settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createAdminToken, COOKIE_NAME } from '@/lib/auth';

// Product Actions
export async function addProduct(data: any) {
  await db.insert(products).values({
    ...data,
    price: data.price.toString(),
    originalPrice: data.originalPrice?.toString(),
    rating: data.rating?.toString() || '0.0',
  });
  revalidatePath('/');
  revalidatePath('/search');
}

export async function updateProduct(id: number, data: any) {
  await db.update(products).set({
    ...data,
    price: data.price.toString(),
    originalPrice: data.originalPrice?.toString(),
    rating: data.rating?.toString() || '0.0',
    updatedAt: new Date(),
  }).where(eq(products.id, id));
  revalidatePath('/');
  revalidatePath(`/product/${id}`);
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id));
  revalidatePath('/');
}

// Banner Actions
export async function addBanner(data: any) {
  await db.insert(banners).values(data);
  revalidatePath('/');
}

export async function deleteBanner(id: number) {
  await db.delete(banners).where(eq(banners.id, id));
  revalidatePath('/');
}

export async function login(password: string) {
  if (password === (process.env.ADMIN_PASSWORD || '')) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, createAdminToken(), {
      path: '/',
      maxAge: 3600,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { success: true };
  }
  return { success: false };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  revalidatePath('/');
}

// Category Actions
export async function addCategory(data: any) {
  await db.insert(categories).values({
    ...data,
    slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  });
  revalidatePath('/');
}

export async function deleteCategory(id: number) {
  // First, set categoryId to null for all products in this category
  await db.update(products).set({ categoryId: null }).where(eq(products.categoryId, id));
  // Then delete the category
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath('/');
}

// Settings Actions
export async function updateSetting(key: string, value: string) {
  const existing = await db.query.settings.findFirst({
    where: eq(settings.key, key),
  });

  if (existing) {
    await db.update(settings).set({ value }).where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value });
  }
  revalidatePath('/');
}

export async function getSettings() {
  const allSettings = await db.query.settings.findMany();
  return allSettings.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
}

export async function getClickStats() {
  const logs = await db.query.clickLogs.findMany({
    with: {
      product: true,
    },
    orderBy: (clickLogs, { desc }) => [desc(clickLogs.clickedAt)],
    limit: 50,
  });
  return logs;
}

