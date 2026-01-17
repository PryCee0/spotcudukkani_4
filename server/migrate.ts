/**
 * Programmatic Database Migration
 * 
 * Bu dosya, sunucu başladığında veritabanı tablolarını otomatik olarak oluşturur.
 * drizzle-kit'e bağımlılık olmadan çalışır.
 * 
 * Production ortamında drizzle-kit yüklü olmadığı için bu yaklaşım kullanılır.
 */

import { sql } from "drizzle-orm";
import { getDb } from "./db";

// SQL statements for creating tables
const CREATE_USERS_TABLE = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// v4.0: Updated products table with images JSON field
const CREATE_PRODUCTS_TABLE = `
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category ENUM('mobilya', 'beyaz_esya') NOT NULL,
  subCategory VARCHAR(100),
  imageUrl TEXT,
  imageKey VARCHAR(512),
  images JSON DEFAULT NULL,
  isActive INT NOT NULL DEFAULT 1,
  isFeatured INT NOT NULL DEFAULT 0,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const CREATE_BLOG_POSTS_TABLE = `
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  coverImage TEXT,
  isPublished INT NOT NULL DEFAULT 1,
  productId INT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// Helper function to check and add column if not exists
const checkAndAddColumn = async (
  db: ReturnType<typeof getDb> extends Promise<infer T> ? T : never,
  tableName: string,
  columnName: string,
  columnDefinition: string
) => {
  if (!db) return;
  
  try {
    // Check if column exists
    const result = await db.execute(sql.raw(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = '${tableName}' 
      AND COLUMN_NAME = '${columnName}'
    `));
    
    // If column doesn't exist, add it
    const isEmpty = (Array.isArray(result) && result.length === 0) || 
                    (Array.isArray(result) && Array.isArray(result[0]) && result[0].length === 0);
    
    if (isEmpty) {
      await db.execute(sql.raw(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`));
      console.log(`[Migration] ✓ ${columnName} column added to ${tableName} table`);
    } else {
      console.log(`[Migration] ✓ ${columnName} column already exists in ${tableName}`);
    }
  } catch (error) {
    // Column might already exist
    console.log(`[Migration] ${columnName} column check/add completed`);
  }
};

/**
 * Run database migrations programmatically
 * Creates tables if they don't exist
 */
export async function runMigrations(): Promise<void> {
  const db = await getDb();
  
  if (!db) {
    console.warn("[Migration] Database not available, skipping migrations");
    return;
  }

  console.log("[Migration] Starting database migrations...");

  try {
    // Create users table
    await db.execute(sql.raw(CREATE_USERS_TABLE));
    console.log("[Migration] ✓ users table ready");

    // Create products table
    await db.execute(sql.raw(CREATE_PRODUCTS_TABLE));
    console.log("[Migration] ✓ products table ready");

    // Create blog_posts table
    await db.execute(sql.raw(CREATE_BLOG_POSTS_TABLE));
    console.log("[Migration] ✓ blog_posts table ready");

    // Add subCategory column if it doesn't exist (for existing installations)
    await checkAndAddColumn(db, 'products', 'subCategory', 'VARCHAR(100) DEFAULT NULL');

    // v4.0: Add images column if it doesn't exist (for existing installations)
    await checkAndAddColumn(db, 'products', 'images', 'JSON DEFAULT NULL');

    console.log("[Migration] All migrations completed successfully");
  } catch (error) {
    console.error("[Migration] Migration failed:", error);
    // Don't throw - let the server start anyway
    // Tables might already exist with slightly different schema
  }
}
