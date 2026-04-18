import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { ensureUploadDir, getUploadDirPath } from "../localStorage";
import { runMigrations } from "../migrate";
import { getDb } from "../db";

/**
 * v7.1: Try to listen on a port, returns true if successful.
 * Uses try-listen-catch pattern instead of test-server to avoid race conditions.
 */
function tryListen(server: ReturnType<typeof createServer>, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const onError = (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.log(`[Port] Port ${port} is busy`);
        resolve(false);
      } else {
        console.error(`[Port] Port ${port} error:`, err.message);
        resolve(false);
      }
    };

    server.once("error", onError);
    server.listen(port, () => {
      server.removeListener("error", onError);
      console.log(`[Port] Successfully bound to port ${port}`);
      resolve(true);
    });
  });
}

/**
 * Find an available port by actually trying to bind, starting from startPort.
 */
async function listenOnAvailablePort(
  server: ReturnType<typeof createServer>,
  startPort: number = 3000
): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await tryListen(server, port)) {
      return port;
    }
  }
  throw new Error(`No available port found in range ${startPort}-${startPort + 19}`);
}

/**
 * Serve static files in production mode
 * No Vite dependency - pure Express static serving
 */
function serveStaticFiles(app: express.Express) {
  // In production, static files are in the same directory as the server bundle
  // The build process puts client files in dist/public
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    console.error(
      `[Static] Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  } else {
    console.log(`[Static] Serving files from: ${distPath}`);
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Run database migrations on startup (creates tables if not exist)
  await runMigrations();

  // Ensure upload directory exists on startup
  ensureUploadDir();

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // v7.0: Security headers via helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://www.google-analytics.com", "https://wa.me", "http://89.117.55.173", "https://89.117.55.173", "https://stats.g.doubleclick.net"],
        frameSrc: ["'self'", "https://www.google.com"],
        scriptSrcAttr: ["'unsafe-inline'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // v7.0: SEO - robots.txt
  app.get("/robots.txt", (_req, res) => {
    const siteUrl = process.env.SITE_URL || "https://spotcudukkani.com";
    res.type("text/plain");
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/panel\n\nSitemap: ${siteUrl}/sitemap.xml`);
  });

  // v7.0: SEO - Dynamic sitemap.xml
  app.get("/sitemap.xml", async (_req, res) => {
    const siteUrl = process.env.SITE_URL || "https://spotcudukkani.com";
    const now = new Date().toISOString().split("T")[0];

    // Static pages
    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/urunler", priority: "0.9", changefreq: "daily" },
      { url: "/hakkimizda", priority: "0.7", changefreq: "monthly" },
      { url: "/iletisim", priority: "0.7", changefreq: "monthly" },
      { url: "/blog", priority: "0.8", changefreq: "weekly" },
      { url: "/urunler/mobilya", priority: "0.8", changefreq: "daily" },
      { url: "/urunler/beyaz-esya", priority: "0.8", changefreq: "daily" },
    ];

    let urls = staticPages.map(p => `
  <url>
    <loc>${siteUrl}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);

    // Dynamic product pages (fetch slugs from DB)
    try {
      const dbConn = await getDb();
      if (dbConn) {
        const products = await dbConn.execute(`SELECT id, updated_at FROM products WHERE 1=1 ORDER BY id DESC LIMIT 500`);
        if (Array.isArray(products) && products.length > 0) {
          const rows = (products as any)[0] || products;
          if (Array.isArray(rows)) {
            for (const p of rows) {
              urls.push(`
  <url>
    <loc>${siteUrl}/urunler?id=${p.id}</loc>
    <lastmod>${p.updated_at ? new Date(p.updated_at).toISOString().split("T")[0] : now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`);
            }
          }
        }
      }
    } catch (e) {
      console.warn("[Sitemap] Could not fetch products:", e);
    }

    // Dynamic blog posts
    try {
      const dbConn = await getDb();
      if (dbConn) {
        const posts = await dbConn.execute(`SELECT slug, updated_at FROM blog_posts WHERE is_published = 1 ORDER BY id DESC LIMIT 500`);
        if (Array.isArray(posts) && posts.length > 0) {
          const rows = (posts as any)[0] || posts;
          if (Array.isArray(rows)) {
            for (const p of rows) {
              urls.push(`
  <url>
    <loc>${siteUrl}/blog/${p.slug}</loc>
    <lastmod>${p.updated_at ? new Date(p.updated_at).toISOString().split("T")[0] : now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
            }
          }
        }
      }
    } catch (e) {
      console.warn("[Sitemap] Could not fetch blog posts:", e);
    }

    res.type("application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}
</urlset>`);
  });

  /**
   * v5.1: Dynamic upload directory serving
   * 
   * UPLOAD_DIR environment variable support for persistent storage:
   * - When UPLOAD_DIR is set, files are stored in that directory (e.g., /data/uploads)
   * - When not set, uses default ./public/uploads
   * 
   * This allows Docker volumes to persist uploads across container rebuilds.
   */
  const uploadDir = getUploadDirPath();

  // Primary: Serve from UPLOAD_DIR (or default public/uploads)
  app.use("/uploads", express.static(uploadDir));
  console.log(`[Uploads] Primary serving from: ${uploadDir}`);

  // Fallback paths for compatibility
  const distUploadsPath = process.env.NODE_ENV === "development"
    ? path.resolve(import.meta.dirname, "../..", "dist", "public", "uploads")
    : path.resolve(import.meta.dirname, "public", "uploads");
  const rootUploadsPath = path.resolve(process.cwd(), "public", "uploads");

  // Serve from dist (production build assets)
  if (fs.existsSync(distUploadsPath) && distUploadsPath !== uploadDir) {
    app.use("/uploads", express.static(distUploadsPath));
    console.log(`[Uploads] Fallback serving from: ${distUploadsPath}`);
  }

  // Serve from root public/uploads (development/legacy)
  if (rootUploadsPath !== uploadDir) {
    app.use("/uploads", express.static(rootUploadsPath));
    console.log(`[Uploads] Fallback serving from: ${rootUploadsPath}`);
  }

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // v7.1: Rate limiting for admin login (brute-force protection)
  const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 5, // max 5 deneme
    message: { error: "Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin." },
    standardHeaders: true,
    legacyHeaders: false,
    // Only apply to admin.login mutation
    skip: (req) => {
      const url = req.url || "";
      return !url.includes("admin.login");
    },
  });

  // v7.1: Rate limiting for view increment (anti-bot)
  const viewLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 dakika
    max: 30, // max 30 view/dakika per IP
    standardHeaders: false,
    legacyHeaders: false,
    skip: (req) => {
      const url = req.url || "";
      return !url.includes("products.incrementView");
    },
  });

  // Apply rate limiters before tRPC
  app.use("/api/trpc", adminLoginLimiter, viewLimiter);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // v7.1: Development mode uses split architecture:
  //   - Express runs on port 3001 (API only)
  //   - Vite runs separately on port 5173 (via `npx vite`) and proxies /api to 3001
  // Production mode: Express serves everything on port 3000
  if (process.env.NODE_ENV !== "development") {
    serveStaticFiles(app);
  }

  // v7.1: Listen on available port (try-listen-catch, no race condition)
  const defaultPort = process.env.NODE_ENV === "development" ? 3001 : 3000;
  const preferredPort = parseInt(process.env.PORT || String(defaultPort));
  const port = await listenOnAvailablePort(server, preferredPort);

  if (port !== preferredPort) {
    console.log(`[Port] Preferred port ${preferredPort} was busy, using ${port}`);
  }

  console.log(`Server running on http://localhost:${port}/`);
  console.log(`[Storage] Upload directory: ${uploadDir}`);
  if (process.env.UPLOAD_DIR) {
    console.log(`[Storage] Using persistent storage from UPLOAD_DIR environment variable`);
  }
  if (process.env.NODE_ENV === "development") {
    console.log(`[Dev] API server ready. Run 'npx vite' in another terminal for frontend (http://localhost:5173)`);
  }
}

startServer().catch(console.error);
