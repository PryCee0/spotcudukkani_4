import { eq, desc, and, asc, sql, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, InsertProduct, Product, categories, InsertCategory, Category, blogPosts, InsertBlogPost, BlogPost } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== Category Queries (v5.0) ====================

export async function createCategory(category: InsertCategory): Promise<Category | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create category: database not available");
    return null;
  }

  try {
    await db.insert(categories).values(category);
    const result = await db.select().from(categories).orderBy(desc(categories.id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create category:", error);
    throw error;
  }
}

export async function getCategories(parentCategory?: "mobilya" | "beyaz_esya", activeOnly = true) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get categories: database not available");
    return [];
  }

  try {
    let conditions = [];
    if (activeOnly) {
      conditions.push(eq(categories.isActive, 1));
    }
    if (parentCategory) {
      conditions.push(eq(categories.parentCategory, parentCategory));
    }

    if (conditions.length > 0) {
      return await db.select().from(categories).where(and(...conditions)).orderBy(asc(categories.sortOrder), asc(categories.name));
    }
    return await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
  } catch (error) {
    console.error("[Database] Failed to get categories:", error);
    return [];
  }
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get category: database not available");
    return null;
  }

  try {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get category:", error);
    return null;
  }
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get category: database not available");
    return null;
  }

  try {
    const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get category:", error);
    return null;
  }
}

export async function updateCategory(id: number, data: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update category: database not available");
    return null;
  }

  try {
    await db.update(categories).set(data).where(eq(categories.id, id));
    return await getCategoryById(id);
  } catch (error) {
    console.error("[Database] Failed to update category:", error);
    throw error;
  }
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete category: database not available");
    return false;
  }

  try {
    await db.delete(categories).where(eq(categories.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete category:", error);
    throw error;
  }
}

// ==================== Product Queries ====================

export async function createProduct(product: InsertProduct): Promise<Product | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create product: database not available");
    return null;
  }

  try {
    await db.insert(products).values(product);
    const result = await db.select().from(products).orderBy(desc(products.id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create product:", error);
    throw error;
  }
}

export async function getProducts(category?: "mobilya" | "beyaz_esya", activeOnly = true, subCategory?: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get products: database not available");
    return [];
  }

  try {
    let conditions = [];
    if (activeOnly) {
      conditions.push(eq(products.isActive, 1));
    }
    if (category) {
      conditions.push(eq(products.category, category));
    }
    if (subCategory) {
      conditions.push(eq(products.subCategory, subCategory));
    }

    if (conditions.length > 0) {
      return await db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt));
    }
    return await db.select().from(products).orderBy(desc(products.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get products:", error);
    return [];
  }
}

export async function getFeaturedProducts(limit = 4) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get featured products: database not available");
    return [];
  }

  try {
    return await db.select().from(products)
      .where(and(eq(products.isActive, 1), eq(products.isFeatured, 1)))
      .orderBy(desc(products.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get featured products:", error);
    return [];
  }
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get product: database not available");
    return null;
  }

  try {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get product:", error);
    return null;
  }
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update product: database not available");
    return null;
  }

  try {
    await db.update(products).set(data).where(eq(products.id, id));
    return await getProductById(id);
  } catch (error) {
    console.error("[Database] Failed to update product:", error);
    throw error;
  }
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete product: database not available");
    return false;
  }

  try {
    await db.delete(products).where(eq(products.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete product:", error);
    throw error;
  }
}

export async function toggleProductFeatured(id: number) {
  const db = await getDb();
  if (!db) return null;

  const product = await getProductById(id);
  if (!product) return null;

  return await updateProduct(id, { isFeatured: product.isFeatured === 1 ? 0 : 1 });
}

export async function toggleProductActive(id: number) {
  const db = await getDb();
  if (!db) return null;

  const product = await getProductById(id);
  if (!product) return null;

  return await updateProduct(id, { isActive: product.isActive === 1 ? 0 : 1 });
}

// v6.0: Increment product view count
export async function incrementViewCount(id: number) {
  const db = await getDb();
  if (!db) return;

  try {
    await db.update(products)
      .set({ viewCount: sql`${products.viewCount} + 1` })
      .where(eq(products.id, id));
  } catch (error) {
    console.error("[Database] Failed to increment view count:", error);
  }
}

// v6.0: Get top viewed products
export async function getTopViewedProducts(limit = 5) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(products)
      .orderBy(desc(products.viewCount))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get top viewed products:", error);
    return [];
  }
}

// v6.0: Get total view count across all products
export async function getTotalViewCount() {
  const db = await getDb();
  if (!db) return 0;

  try {
    const result = await db.select({ total: sum(products.viewCount) }).from(products);
    return Number(result[0]?.total || 0);
  } catch (error) {
    console.error("[Database] Failed to get total view count:", error);
    return 0;
  }
}

// ==================== Blog Post Queries ====================

export async function createBlogPost(post: InsertBlogPost): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create blog post: database not available");
    return null;
  }

  try {
    await db.insert(blogPosts).values(post);
    const result = await db.select().from(blogPosts).orderBy(desc(blogPosts.id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create blog post:", error);
    throw error;
  }
}

export async function getBlogPosts(publishedOnly = true) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog posts: database not available");
    return [];
  }

  try {
    if (publishedOnly) {
      return await db.select().from(blogPosts)
        .where(eq(blogPosts.isPublished, 1))
        .orderBy(desc(blogPosts.createdAt));
    }
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog post: database not available");
    return null;
  }

  try {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get blog post:", error);
    return null;
  }
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog post: database not available");
    return null;
  }

  try {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get blog post:", error);
    return null;
  }
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update blog post: database not available");
    return null;
  }

  try {
    await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
    return await getBlogPostById(id);
  } catch (error) {
    console.error("[Database] Failed to update blog post:", error);
    throw error;
  }
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete blog post: database not available");
    return false;
  }

  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete blog post:", error);
    throw error;
  }
}
