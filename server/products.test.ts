import { describe, expect, it, vi, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as jose from "jose";

// Mock the localStorage module
vi.mock("./localStorage", () => ({
  localStoragePut: vi.fn().mockResolvedValue({ key: "products-test123.jpg", url: "/uploads/products-test123.jpg" }),
  localStorageDelete: vi.fn().mockResolvedValue(true),
  ensureUploadDir: vi.fn(),
}));

// Mock the db module
vi.mock("./db", () => ({
  createProduct: vi.fn().mockResolvedValue({
    id: 1,
    title: "Test Ürün",
    description: "Test açıklama",
    category: "mobilya",
    imageUrl: null,
    imageKey: null,
    isActive: 1,
    isFeatured: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getProducts: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Test Mobilya",
      description: "Mobilya açıklaması",
      category: "mobilya",
      imageUrl: null,
      imageKey: null,
      isActive: 1,
      isFeatured: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: "Test Beyaz Eşya",
      description: "Beyaz eşya açıklaması",
      category: "beyaz_esya",
      imageUrl: null,
      imageKey: null,
      isActive: 1,
      isFeatured: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getFeaturedProducts: vi.fn().mockResolvedValue([
    {
      id: 2,
      title: "Test Beyaz Eşya",
      description: "Beyaz eşya açıklaması",
      category: "beyaz_esya",
      imageUrl: null,
      imageKey: null,
      isActive: 1,
      isFeatured: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getProductById: vi.fn().mockResolvedValue({
    id: 1,
    title: "Test Ürün",
    description: "Test açıklama",
    category: "mobilya",
    imageUrl: null,
    imageKey: null,
    isActive: 1,
    isFeatured: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  updateProduct: vi.fn().mockResolvedValue({
    id: 1,
    title: "Güncellenmiş Ürün",
    description: "Güncellenmiş açıklama",
    category: "mobilya",
    imageUrl: null,
    imageKey: null,
    isActive: 1,
    isFeatured: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  deleteProduct: vi.fn().mockResolvedValue(true),
  toggleProductFeatured: vi.fn().mockResolvedValue({
    id: 1,
    title: "Test Ürün",
    description: "Test açıklama",
    category: "mobilya",
    imageUrl: null,
    imageKey: null,
    isActive: 1,
    isFeatured: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  toggleProductActive: vi.fn().mockResolvedValue({
    id: 1,
    title: "Test Ürün",
    description: "Test açıklama",
    category: "mobilya",
    imageUrl: null,
    imageKey: null,
    isActive: 0,
    isFeatured: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
}));

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

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: { cookie: "" } } as TrpcContext["req"],
    res: { clearCookie: vi.fn(), cookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

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

describe("products.list", () => {
  it("returns all active products for public users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.list();

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Test Mobilya");
  });

  it("filters products by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.list({ category: "mobilya" });

    expect(result).toBeDefined();
  });
});

describe("products.featured", () => {
  it("returns featured products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.featured();

    expect(result).toHaveLength(1);
    expect(result[0].isFeatured).toBe(1);
  });
});

describe("products.byId", () => {
  it("returns a product by id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.byId({ id: 1 });

    expect(result.id).toBe(1);
    expect(result.title).toBe("Test Ürün");
  });
});

describe("products.create (admin only)", () => {
  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.products.create({
        title: "New Product",
        category: "mobilya",
      })
    ).rejects.toThrow("Admin girişi gerekli");
  });

  it("creates a product for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.create({
      title: "Test Ürün",
      description: "Test açıklama",
      category: "mobilya",
    });

    expect(result).toBeDefined();
    expect(result?.title).toBe("Test Ürün");
  });
});

describe("products.delete (admin only)", () => {
  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.products.delete({ id: 1 })).rejects.toThrow("Admin girişi gerekli");
  });

  it("deletes a product for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.delete({ id: 1 });

    expect(result).toBe(true);
  });
});

describe("products.toggleFeatured (admin only)", () => {
  it("toggles featured status for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.toggleFeatured({ id: 1 });

    expect(result).toBeDefined();
    expect(result?.isFeatured).toBe(1);
  });
});

describe("products.toggleActive (admin only)", () => {
  it("toggles active status for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.toggleActive({ id: 1 });

    expect(result).toBeDefined();
    expect(result?.isActive).toBe(0);
  });
});
