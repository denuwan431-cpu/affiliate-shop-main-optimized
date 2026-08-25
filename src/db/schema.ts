import { pgTable, serial, text, varchar, timestamp, decimal, boolean, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  icon: text('icon'),
  order: integer('order').default(0),
  isEnabled: boolean('is_enabled').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  shortName: varchar('short_name', { length: 100 }),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }),
  discountPercent: integer('discount_percent'),
  imageUrls: jsonb('image_urls').$type<string[]>().notNull(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  brand: varchar('brand', { length: 100 }),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0.0'),
  affiliateUrl: text('affiliate_url').notNull(),
  isFlashSale: boolean('is_flash_sale').default(false),
  isFeatured: boolean('is_featured').default(false), 
  isHot: boolean('is_hot').default(false),           
  isNew: boolean('is_new').default(false),           
  stockStatus: varchar('stock_status', { length: 50 }).default('in_stock'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_products_category_id').on(table.categoryId),
  index('idx_products_created_at').on(table.createdAt),
]);

export const banners = pgTable('banners', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  title: varchar('title', { length: 255 }),
  subtitle: text('subtitle'),
  buttonText: varchar('button_text', { length: 50 }).default('Explore Deals'),
  buttonUrl: text('button_url').default('/'),
  order: integer('order').default(0),
  isEnabled: boolean('is_enabled').default(true),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const clickLogs = pgTable('click_logs', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }),
  clickedAt: timestamp('clicked_at').defaultNow(),
  userAgent: text('user_agent'),
  ip: varchar('ip', { length: 45 }),
}, (table) => [
  index('idx_click_logs_product_id').on(table.productId),
]);

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  clicks: many(clickLogs),
}));

export const clickLogsRelations = relations(clickLogs, ({ one }) => ({
  product: one(products, { fields: [clickLogs.productId], references: [products.id] }),
}));
