import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import fs from "fs";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { ensureUploadDir } from "../localStorage";
import { runMigrations } from "../migrate";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
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
  
  // Serve uploaded files from /uploads
  app.use("/uploads", express.static(path.resolve(process.cwd(), "public", "uploads")));
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // Development mode uses Vite (dynamically imported), production uses static files
  if (process.env.NODE_ENV === "development") {
    // Dynamic import to avoid bundling Vite in production
    try {
      const { setupVite } = await import("./vite");
      await setupVite(app, server);
    } catch (error) {
      console.error("[Dev] Failed to setup Vite:", error);
      // Fallback to static files
      serveStaticFiles(app);
    }
  } else {
    // Production mode - serve static files directly
    serveStaticFiles(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
