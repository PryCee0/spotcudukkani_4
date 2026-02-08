import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { 
  createProduct, 
  getProducts, 
  getFeaturedProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct,
  toggleProductFeatured,
  toggleProductActive,
  // v6.0: View count functions
  incrementViewCount,
  getTopViewedProducts,
  getTotalViewCount,
  createBlogPost,
  getBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  // v5.0: Category functions
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "./db";
import { localStoragePut, localStorageDelete } from "./localStorage";
import { nanoid } from "nanoid";
import axios from "axios";
import * as jose from "jose";
import { ProductImage } from "../drizzle/schema";

// Admin cookie name
const ADMIN_COOKIE_NAME = "admin_session";

// Admin password from environment
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "spotcu2024";

// JWT secret for admin sessions
const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "spotcu-admin-secret-key-2024"
);

// Verify admin session from cookie
async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  
  try {
    const { payload } = await jose.jwtVerify(token, ADMIN_JWT_SECRET);
    return payload.isAdmin === true;
  } catch {
    return false;
  }
}

// Create admin session token
async function createAdminToken(): Promise<string> {
  return await new jose.SignJWT({ isAdmin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7 gün geçerli
    .sign(ADMIN_JWT_SECRET);
}

// Admin procedure - checks for admin session cookie
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const cookies = ctx.req.headers.cookie || "";
  const adminCookie = cookies
    .split(";")
    .find((c: string) => c.trim().startsWith(`${ADMIN_COOKIE_NAME}=`));
  
  const token = adminCookie?.split("=")[1]?.trim();
  const isAdmin = await verifyAdminSession(token);
  
  if (!isAdmin) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED', 
      message: 'Admin girişi gerekli. Lütfen /admin sayfasından giriş yapın.' 
    });
  }
  
  return next({ ctx });
});

// Webhook URL (environment variable'dan alınır)
const WEBHOOK_URL = process.env.WEBHOOK_URL || null;

// Blog API Key for external webhook access
const BLOG_API_KEY = process.env.BLOG_API_KEY || "spotcu-blog-api-key-2024";

// Webhook gönderme fonksiyonu
async function sendWebhook(event: string, data: Record<string, unknown>) {
  if (!WEBHOOK_URL) {
    console.log("[Webhook] No WEBHOOK_URL configured, skipping webhook");
    return;
  }

  try {
    await axios.post(WEBHOOK_URL, {
      event,
      timestamp: new Date().toISOString(),
      data,
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });
    console.log(`[Webhook] Successfully sent ${event} event`);
  } catch (error) {
    console.error(`[Webhook] Failed to send ${event} event:`, error);
  }
}

// Slug oluşturma fonksiyonu
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + nanoid(6);
}

// Image upload schema for multiple images
const imageUploadSchema = z.object({
  base64: z.string(),
  mimeType: z.string(),
});

export const appRouter = router({
  system: systemRouter,
  
  // Admin authentication
  admin: router({
    // Check if user is logged in as admin
    checkSession: publicProcedure.query(async ({ ctx }) => {
      const cookies = ctx.req.headers.cookie || "";
      const adminCookie = cookies
        .split(";")
        .find((c: string) => c.trim().startsWith(`${ADMIN_COOKIE_NAME}=`));
      
      const token = adminCookie?.split("=")[1]?.trim();
      const isAdmin = await verifyAdminSession(token);
      
      return { isLoggedIn: isAdmin };
    }),

    // Login with password
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (input.password !== ADMIN_PASSWORD) {
          throw new TRPCError({ 
            code: 'UNAUTHORIZED', 
            message: 'Yanlış şifre' 
          });
        }

        const token = await createAdminToken();
        const cookieOptions = getSessionCookieOptions(ctx.req);
        
        ctx.res.cookie(ADMIN_COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
        });

        return { success: true };
      }),

    // Logout
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(ADMIN_COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),
  }),

  // Keep old auth for compatibility (but not used for admin)
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // v5.0: Category Management
  categories: router({
    // Public: Get all active categories
    list: publicProcedure
      .input(z.object({
        parentCategory: z.enum(["mobilya", "beyaz_esya"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        return await getCategories(input?.parentCategory, true);
      }),

    // Admin: Get all categories (including inactive)
    adminList: adminProcedure
      .input(z.object({
        parentCategory: z.enum(["mobilya", "beyaz_esya"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        return await getCategories(input?.parentCategory, false);
      }),

    // Admin: Create category
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1, "Kategori adı gerekli"),
        parentCategory: z.enum(["mobilya", "beyaz_esya"]),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const slug = input.name
          .toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');

        return await createCategory({
          name: input.name,
          slug,
          parentCategory: input.parentCategory,
          sortOrder: input.sortOrder || 0,
        });
      }),

    // Admin: Update category
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, isActive, ...data } = input;
        
        const updateData: Record<string, unknown> = { ...data };
        if (isActive !== undefined) {
          updateData.isActive = isActive ? 1 : 0;
        }
        
        // Update slug if name changed
        if (data.name) {
          updateData.slug = data.name
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');
        }

        return await updateCategory(id, updateData);
      }),

    // Admin: Delete category
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteCategory(input.id);
      }),
  }),

  products: router({
    // Public: Get all active products
    list: publicProcedure
      .input(z.object({
        category: z.enum(["mobilya", "beyaz_esya"]).optional(),
        subCategory: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await getProducts(input?.category, true, input?.subCategory);
      }),

    // Public: Get featured products for homepage
    featured: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await getFeaturedProducts(input?.limit ?? 4);
      }),

    // Public: Get single product
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.id);
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Ürün bulunamadı' });
        }
        return product;
      }),

    // v6.0: Increment view count when product detail is opened
    incrementView: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await incrementViewCount(input.id);
        return { success: true };
      }),

    // v6.0: Admin - Get top viewed products
    topViewed: adminProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await getTopViewedProducts(input?.limit ?? 5);
      }),

    // v6.0: Admin - Get total view count
    totalViews: adminProcedure.query(async () => {
      return { total: await getTotalViewCount() };
    }),

    // Admin: Get all products (including inactive)
    adminList: adminProcedure.query(async () => {
      return await getProducts(undefined, false);
    }),

    // Admin: Create product with multiple image support (v4.0)
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1, "Başlık gerekli"),
        description: z.string().optional(),
        category: z.enum(["mobilya", "beyaz_esya"]),
        subCategory: z.string().optional(),
        // Legacy single image support
        imageBase64: z.string().optional(),
        imageMimeType: z.string().optional(),
        // v4.0: Multiple images support (up to 5)
        images: z.array(imageUploadSchema).max(5).optional(),
        isFeatured: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        let imageUrl: string | undefined;
        let imageKey: string | undefined;
        let productImages: ProductImage[] = [];

        // Handle multiple images (v4.0)
        if (input.images && input.images.length > 0) {
          for (const img of input.images) {
            const buffer = Buffer.from(img.base64, 'base64');
            const result = await localStoragePut(buffer, img.mimeType, "products");
            productImages.push({ url: result.url, key: result.key });
          }
          // Set first image as main image for backward compatibility
          if (productImages.length > 0) {
            imageUrl = productImages[0].url;
            imageKey = productImages[0].key;
          }
        }
        // Handle legacy single image upload
        else if (input.imageBase64 && input.imageMimeType) {
          const buffer = Buffer.from(input.imageBase64, 'base64');
          const result = await localStoragePut(buffer, input.imageMimeType, "products");
          imageUrl = result.url;
          imageKey = result.key;
          productImages = [{ url: result.url, key: result.key }];
        }

        const product = await createProduct({
          title: input.title,
          description: input.description || null,
          category: input.category,
          subCategory: input.subCategory || null,
          imageUrl: imageUrl || null,
          imageKey: imageKey || null,
          images: productImages.length > 0 ? productImages : null,
          isFeatured: input.isFeatured ? 1 : 0,
        });

        // Webhook gönder - n8n veya otomasyon için
        if (product) {
          await sendWebhook('product.created', {
            id: product.id,
            title: product.title,
            description: product.description,
            category: product.category,
            imageUrl: product.imageUrl,
            images: product.images,
          });
        }

        return product;
      }),

    // Admin: Update product with multiple image support (v4.0)
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        category: z.enum(["mobilya", "beyaz_esya"]).optional(),
        subCategory: z.string().optional(),
        // Legacy single image support
        imageBase64: z.string().optional(),
        imageMimeType: z.string().optional(),
        // v4.0: Multiple images support
        images: z.array(imageUploadSchema).max(5).optional(),
        // v4.0: Keep existing images (URLs only)
        existingImages: z.array(z.object({
          url: z.string(),
          key: z.string(),
        })).optional(),
        // v5.0: Allow clearing description
        clearDescription: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, imageBase64, imageMimeType, images, existingImages, clearDescription, ...data } = input;
        
        let updateData: Record<string, unknown> = { ...data };
        let productImages: ProductImage[] = existingImages || [];

        // v5.0: Handle description clearing
        if (clearDescription) {
          updateData.description = null;
        }

        // Handle new multiple images upload (v4.0)
        if (images && images.length > 0) {
          for (const img of images) {
            const buffer = Buffer.from(img.base64, 'base64');
            const result = await localStoragePut(buffer, img.mimeType, "products");
            productImages.push({ url: result.url, key: result.key });
          }
        }

        // Handle legacy single image upload
        if (imageBase64 && imageMimeType) {
          // Delete old image if exists
          const existingProduct = await getProductById(id);
          if (existingProduct?.imageKey) {
            await localStorageDelete(existingProduct.imageKey);
          }

          const buffer = Buffer.from(imageBase64, 'base64');
          const result = await localStoragePut(buffer, imageMimeType, "products");
          updateData.imageUrl = result.url;
          updateData.imageKey = result.key;
          
          // Add to images array if not already there
          if (!productImages.some(img => img.key === result.key)) {
            productImages.unshift({ url: result.url, key: result.key });
          }
        }

        // Update images array (limit to 5)
        if (productImages.length > 0) {
          productImages = productImages.slice(0, 5);
          updateData.images = productImages;
          // Update main image to first in array
          updateData.imageUrl = productImages[0].url;
          updateData.imageKey = productImages[0].key;
        }

        return await updateProduct(id, updateData);
      }),

    // Admin: Delete product
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        // Delete all image files
        const product = await getProductById(input.id);
        if (product) {
          // Delete images from v4.0 images array
          if (product.images && Array.isArray(product.images)) {
            for (const img of product.images as ProductImage[]) {
              if (img.key) {
                await localStorageDelete(img.key);
              }
            }
          }
          // Delete legacy single image
          else if (product.imageKey) {
            await localStorageDelete(product.imageKey);
          }
        }
        return await deleteProduct(input.id);
      }),

    // Admin: Delete single image from product (v4.0)
    deleteImage: adminProcedure
      .input(z.object({ 
        productId: z.number(),
        imageKey: z.string(),
      }))
      .mutation(async ({ input }) => {
        const product = await getProductById(input.productId);
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Ürün bulunamadı' });
        }

        // Delete file from storage
        await localStorageDelete(input.imageKey);

        // Update product images array
        let productImages = (product.images as ProductImage[]) || [];
        productImages = productImages.filter(img => img.key !== input.imageKey);

        // Update product
        const updateData: Record<string, unknown> = {
          images: productImages.length > 0 ? productImages : null,
        };

        // Update main image
        if (productImages.length > 0) {
          updateData.imageUrl = productImages[0].url;
          updateData.imageKey = productImages[0].key;
        } else {
          updateData.imageUrl = null;
          updateData.imageKey = null;
        }

        return await updateProduct(input.productId, updateData);
      }),

    // Admin: Toggle featured status
    toggleFeatured: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await toggleProductFeatured(input.id);
      }),

    // Admin: Toggle active status
    toggleActive: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await toggleProductActive(input.id);
      }),
  }),

  // Blog API
  blog: router({
    // Public: Get all published blog posts
    list: publicProcedure.query(async () => {
      return await getBlogPosts(true);
    }),

    // Public: Get single blog post by slug
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getBlogPostBySlug(input.slug);
        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog yazısı bulunamadı' });
        }
        return post;
      }),

    // Admin: Get all blog posts (including unpublished)
    adminList: adminProcedure.query(async () => {
      return await getBlogPosts(false);
    }),

    // Admin: Create blog post (v5.0: supports manual creation with image upload)
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1, "Başlık gerekli"),
        content: z.string().min(1, "İçerik gerekli"),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(), // URL
        coverImageBase64: z.string().optional(), // v5.0: Base64 image upload
        coverImageMimeType: z.string().optional(),
        isPublished: z.boolean().optional(),
        productId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const slug = createSlug(input.title);
        
        let coverImage = input.coverImage || null;
        let coverImageKey: string | null = null;

        // v5.0: Handle image upload for manual blog posts
        if (input.coverImageBase64 && input.coverImageMimeType) {
          const buffer = Buffer.from(input.coverImageBase64, 'base64');
          const result = await localStoragePut(buffer, input.coverImageMimeType, "blog");
          coverImage = result.url;
          coverImageKey = result.key;
        }
        
        return await createBlogPost({
          title: input.title,
          slug,
          content: input.content,
          excerpt: input.excerpt || null,
          coverImage,
          coverImageKey,
          isPublished: input.isPublished !== false ? 1 : 0,
          isManual: 1, // v5.0: Mark as manual post
          productId: input.productId || null,
        });
      }),

    // Public: Create blog post from webhook (n8n integration)
    // This endpoint is public but requires an API key
    // v4.5: Supports both coverImage and imageUrl for backward compatibility
    createFromWebhook: publicProcedure
      .input(z.object({
        title: z.string().min(1, "Başlık gerekli"),
        content: z.string().min(1, "İçerik gerekli"),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        imageUrl: z.string().optional(), // v4.5: n8n backward compatibility
        productId: z.number().optional(),
        apiKey: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Verify API key
        if (input.apiKey !== BLOG_API_KEY) {
          throw new TRPCError({ 
            code: 'UNAUTHORIZED', 
            message: 'Geçersiz API anahtarı' 
          });
        }

        const slug = createSlug(input.title);
        
        // v4.5: Use coverImage if provided, otherwise fall back to imageUrl
        const finalCoverImage = input.coverImage || input.imageUrl || null;
        
        return await createBlogPost({
          title: input.title,
          slug,
          content: input.content,
          excerpt: input.excerpt || null,
          coverImage: finalCoverImage,
          isPublished: 1, // Auto-publish from webhook
          isManual: 0, // v5.0: Mark as n8n automated post
          productId: input.productId || null,
        });
      }),

    // Admin: Update blog post (v5.0: supports image upload)
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        coverImageBase64: z.string().optional(), // v5.0: Base64 image upload
        coverImageMimeType: z.string().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, isPublished, coverImageBase64, coverImageMimeType, ...data } = input;
        
        const updateData: Record<string, unknown> = { ...data };
        if (isPublished !== undefined) {
          updateData.isPublished = isPublished ? 1 : 0;
        }

        // v5.0: Handle image upload
        if (coverImageBase64 && coverImageMimeType) {
          // Delete old image if exists
          const existingPost = await getBlogPostById(id);
          if (existingPost?.coverImageKey) {
            await localStorageDelete(existingPost.coverImageKey);
          }

          const buffer = Buffer.from(coverImageBase64, 'base64');
          const result = await localStoragePut(buffer, coverImageMimeType, "blog");
          updateData.coverImage = result.url;
          updateData.coverImageKey = result.key;
        }

        return await updateBlogPost(id, updateData);
      }),

    // Admin: Delete blog post
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        // v5.0: Delete cover image if exists
        const post = await getBlogPostById(input.id);
        if (post?.coverImageKey) {
          await localStorageDelete(post.coverImageKey);
        }
        return await deleteBlogPost(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
