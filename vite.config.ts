import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, type Plugin } from "vite";

/**
 * v7.1: Conditionally load platform-specific plugins
 * These plugins (manus-runtime, jsx-loc) cause Vite to hang in local development.
 * Only loaded when VITE_APP_ID is set (indicating hosted/platform environment).
 */
async function loadOptionalPlugins(): Promise<Plugin[]> {
  // Skip platform plugins in local development
  if (!process.env.VITE_APP_ID) {
    console.log("[Vite] Local mode — skipping platform plugins");
    return [];
  }

  const optional: Plugin[] = [];

  try {
    const { jsxLocPlugin } = await import("@builder.io/vite-plugin-jsx-loc");
    optional.push(jsxLocPlugin());
  } catch {
    // skip
  }

  try {
    const { vitePluginManusRuntime } = await import("vite-plugin-manus-runtime");
    optional.push(vitePluginManusRuntime());
  } catch {
    // skip
  }

  return optional;
}

export default defineConfig(async () => {
  const optionalPlugins = await loadOptionalPlugins();

  return {
    plugins: [react(), tailwindcss(), ...optionalPlugins],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    publicDir: path.resolve(import.meta.dirname, "client", "public"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      // v6.0: Build optimizations
      target: "es2020",
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            router: ["wouter"],
            ui: ["@radix-ui/react-dialog", "@radix-ui/react-tabs", "@radix-ui/react-collapsible"],
            animation: ["framer-motion"],
            trpc: ["@trpc/client", "@trpc/react-query", "@tanstack/react-query"],
          },
        },
      },
    },
    server: {
      host: true,
      allowedHosts: true,
      // v7.1: Proxy API and upload requests to Express backend
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/uploads": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/robots.txt": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/sitemap.xml": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
      },
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});

