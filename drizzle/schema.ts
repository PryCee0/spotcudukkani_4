import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * v5.0: Dynamic categories table for admin-managed subcategories
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  parentCategory: mysqlEnum("parentCategory", ["mobilya", "beyaz_esya"]).notNull(),
  isActive: int("isActive").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Image type for product gallery
 */
export interface ProductImage {
  url: string;
  key: string;
}

/**
 * Products table for furniture and appliances
 * v4.0: Added images field for multiple product photos (up to 5)
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["mobilya", "beyaz_esya"]).notNull(),
  subCategory: varchar("subCategory", { length: 100 }),
  // Legacy single image fields (kept for backward compatibility)
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 512 }),
  // v4.0: Multiple images support (JSON array of {url, key} objects)
  images: json("images").$type<ProductImage[]>(),
  // v8.0: Video support
  videoUrl: text("videoUrl"),
  videoKey: varchar("videoKey", { length: 512 }),
  // v6.0: View count for product statistics
  viewCount: int("viewCount").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  isFeatured: int("isFeatured").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Blog posts table for AI-generated content
 * v5.0: Added isManual field to distinguish manual posts from n8n automation
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("coverImage"),
  coverImageKey: varchar("coverImageKey", { length: 512 }),
  isPublished: int("isPublished").default(1).notNull(),
  isManual: int("isManual").default(0).notNull(), // v5.0: 1 for manual, 0 for n8n
  productId: int("productId"), // İlişkili ürün (opsiyonel)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * v10.0: Site ziyaret istatistikleri
 * Günlük sayfa görüntüleme ve benzersiz ziyaretçi sayacı
 */
export const siteVisits = mysqlTable("site_visits", {
  id: int("id").autoincrement().primaryKey(),
  visitDate: varchar("visitDate", { length: 10 }).notNull().unique(), // YYYY-MM-DD format
  pageViews: int("pageViews").default(0).notNull(),
  uniqueVisitors: int("uniqueVisitors").default(0).notNull(),
});

export type SiteVisit = typeof siteVisits.$inferSelect;
export type InsertSiteVisit = typeof siteVisits.$inferInsert;

/**
 * v10.0: Ziyaretçi parmak izi (günlük tekil ziyaretçi takibi)
 * IP hash + User-Agent hash — GDPR uyumlu, kişisel veri saklanmaz
 */
export const visitorFingerprints = mysqlTable("visitor_fingerprints", {
  id: int("id").autoincrement().primaryKey(),
  fingerprint: varchar("fingerprint", { length: 64 }).notNull(),
  visitDate: varchar("visitDate", { length: 10 }).notNull(), // YYYY-MM-DD
});

export type VisitorFingerprint = typeof visitorFingerprints.$inferSelect;
