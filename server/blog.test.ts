import { describe, expect, it, vi, beforeEach, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as jose from "jose";

// Mock db functions
vi.mock("./db", () => ({
  createBlogPost: vi.fn(),
  getBlogPosts: vi.fn(),
  getBlogPostBySlug: vi.fn(),
  getBlogPostById: vi.fn(),
  updateBlogPost: vi.fn(),
  deleteBlogPost: vi.fn(),
  // Keep other mocks from products
  createProduct: vi.fn(),
  getProducts: vi.fn(),
  getFeaturedProducts: vi.fn(),
  getProductById: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  toggleProductFeatured: vi.fn(),
  toggleProductActive: vi.fn(),
}));

import * as db from "./db";

// JWT secret for tests (same as in routers.ts default)
const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "spotcu-admin-secret-key-2024"
);

// Store a valid admin token
let validAdminToken: string;

beforeAll(async () => {
  // Create a valid admin token before tests run
  validAdminToken = await new jose.SignJWT({ isAdmin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(ADMIN_JWT_SECRET);
});

function createAdminContext(): TrpcContext {
  return {
    user: null,
    req: { 
      protocol: "https", 
      headers: { cookie: `admin_session=${validAdminToken}` } 
    } as TrpcContext["req"],
    res: { clearCookie: vi.fn(), cookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: { cookie: "" } } as TrpcContext["req"],
    res: { clearCookie: vi.fn(), cookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("blog.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns published blog posts for public users", async () => {
    const mockPosts = [
      {
        id: 1,
        title: "Test Blog Post",
        slug: "test-blog-post-abc123",
        content: "This is test content",
        excerpt: "Test excerpt",
        coverImage: null,
        isPublished: 1,
        productId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(db.getBlogPosts).mockResolvedValue(mockPosts);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.list();

    expect(result).toEqual(mockPosts);
    expect(db.getBlogPosts).toHaveBeenCalledWith(true);
  });
});

describe("blog.bySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a blog post by slug", async () => {
    const mockPost = {
      id: 1,
      title: "Test Blog Post",
      slug: "test-blog-post-abc123",
      content: "This is test content",
      excerpt: "Test excerpt",
      coverImage: null,
      isPublished: 1,
      productId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(db.getBlogPostBySlug).mockResolvedValue(mockPost);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.bySlug({ slug: "test-blog-post-abc123" });

    expect(result).toEqual(mockPost);
    expect(db.getBlogPostBySlug).toHaveBeenCalledWith("test-blog-post-abc123");
  });

  it("throws NOT_FOUND for non-existent slug", async () => {
    vi.mocked(db.getBlogPostBySlug).mockResolvedValue(null);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.blog.bySlug({ slug: "non-existent" })).rejects.toThrow();
  });
});

describe("blog.create (admin only)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a blog post for admin users", async () => {
    const mockPost = {
      id: 1,
      title: "New Blog Post",
      slug: "new-blog-post-abc123",
      content: "Blog content here",
      excerpt: null,
      coverImage: null,
      isPublished: 1,
      productId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(db.createBlogPost).mockResolvedValue(mockPost);

    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.create({
      title: "New Blog Post",
      content: "Blog content here",
    });

    expect(result).toEqual(mockPost);
    expect(db.createBlogPost).toHaveBeenCalled();
  });
});

describe("blog.createFromWebhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a blog post with valid API key", async () => {
    const mockPost = {
      id: 1,
      title: "Webhook Blog Post",
      slug: "webhook-blog-post-abc123",
      content: "Content from webhook",
      excerpt: null,
      coverImage: null,
      isPublished: 1,
      productId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(db.createBlogPost).mockResolvedValue(mockPost);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.createFromWebhook({
      title: "Webhook Blog Post",
      content: "Content from webhook",
      apiKey: "spotcu-blog-api-key-2024",
    });

    expect(result).toEqual(mockPost);
  });

  it("throws UNAUTHORIZED with invalid API key", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.blog.createFromWebhook({
        title: "Test",
        content: "Test content",
        apiKey: "invalid-key",
      })
    ).rejects.toThrow("Geçersiz API anahtarı");
  });
});
