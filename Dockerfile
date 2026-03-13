# ============================================
# Spotçu Dükkanı v3.1 - Production Dockerfile
# Easypanel / VPS / Docker uyumlu
# ============================================

# ---- Build Stage ----
FROM node:20-alpine AS builder

# pnpm kurulumu
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Bağımlılık dosyalarını kopyala (cache için ayrı layer)
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Bağımlılıkları yükle
RUN pnpm install --frozen-lockfile

# Kaynak kodları kopyala
COPY . .

# Build işlemi
# - vite build: client -> dist/public
# - esbuild: server -> dist/index.js
RUN pnpm build

# Build çıktısını doğrula
RUN ls -la /app/dist/ && \
    test -f /app/dist/index.js || (echo "ERROR: dist/index.js not found!" && exit 1)

# ---- Production Stage ----
FROM node:20-alpine AS production

# pnpm kurulumu
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Sadece production bağımlılıklarını kopyala
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile --prod

# Build çıktılarını kopyala
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Uploads klasörünü oluştur
RUN mkdir -p /app/public/uploads && \
    chown -R node:node /app/public

# Güvenlik: root olmayan kullanıcı
USER node

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Port
EXPOSE 3000

# Uploads için persistent volume
VOLUME ["/app/public/uploads"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start komutu
CMD ["node", "dist/index.js"]
