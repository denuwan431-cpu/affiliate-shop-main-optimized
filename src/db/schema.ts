import { pgTable, serial, text, varchar, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: varchar("site_name", { length: 255 }).default("AffiliateShop.lk"),
  facebookUrl: text("facebook_url"),
  youtubeUrl: text("youtube_url"),
  instagramUrl: text("instagram_url"),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  order: integer("order").default(0),
  isEnabled: boolean("is_enabled").default(true),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: varchar("short_name", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  discountLabel: varchar("discount_label", { length: 50 }),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: 'cascade' }),
  affiliateLink: text("affiliate_link").notNull(),
  imageUrl: text("image_url").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isHot: boolean("is_hot").default(false),
  clicks: integer("clicks").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: varchar("title", { length: 255 }),
  subtitle: text("subtitle"),
  order: integer("order").default(0),
  isEnabled: boolean("is_enabled").default(true),
});
