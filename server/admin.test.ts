import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type CookieCall = {
  name: string;
  value?: string;
  options: Record<string, unknown>;
};

function createMockContext(adminCookie?: string): { ctx: TrpcContext; cookies: CookieCall[] } {
  const cookies: CookieCall[] = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {
        cookie: adminCookie ? `admin_session=${adminCookie}` : "",
      },
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        cookies.push({ name, value, options });
      },
      clearCookie: (name: string, options: Record<string, unknown>) => {
        cookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, cookies };
}

describe("admin.login", () => {
  it("returns success and sets cookie with correct password", async () => {
    const { ctx, cookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Default password is "spotcu2024"
    const result = await caller.admin.login({ password: "spotcu2024" });

    expect(result).toEqual({ success: true });
    expect(cookies).toHaveLength(1);
    expect(cookies[0]?.name).toBe("admin_session");
    expect(cookies[0]?.value).toBeDefined();
    expect(cookies[0]?.options).toMatchObject({
      httpOnly: true,
      path: "/",
    });
  });

  it("throws error with incorrect password", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.login({ password: "wrongpassword" }))
      .rejects.toThrow("Yanlış şifre");
  });
});

describe("admin.checkSession", () => {
  it("returns isLoggedIn: false when no cookie", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.checkSession();

    expect(result).toEqual({ isLoggedIn: false });
  });

  it("returns isLoggedIn: false with invalid token", async () => {
    const { ctx } = createMockContext("invalid-token");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.checkSession();

    expect(result).toEqual({ isLoggedIn: false });
  });
});

describe("admin.logout", () => {
  it("clears the admin session cookie", async () => {
    const { ctx, cookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.logout();

    expect(result).toEqual({ success: true });
    expect(cookies).toHaveLength(1);
    expect(cookies[0]?.name).toBe("admin_session");
    expect(cookies[0]?.options).toMatchObject({
      maxAge: -1,
    });
  });
});

describe("admin protected routes", () => {
  it("products.adminList throws unauthorized without admin session", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.products.adminList())
      .rejects.toThrow("Admin girişi gerekli");
  });

  it("products.create throws unauthorized without admin session", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.products.create({
      title: "Test Ürün",
      category: "mobilya",
    })).rejects.toThrow("Admin girişi gerekli");
  });
});
