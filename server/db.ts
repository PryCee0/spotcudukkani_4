import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, InsertProduct, Product } from "../drizzle/schema";
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

// Product queries
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


// Blog post queries
import { blogPosts, InsertBlogPost, BlogPost } from "../drizzle/schema";

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
