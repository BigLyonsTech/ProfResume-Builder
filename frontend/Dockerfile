# ============================================================
#   Resume Builder — Frontend Dockerfile
#   Multi-stage build:
#     Stage 1 (builder) → installs deps and builds React app
#     Stage 2 (runtime) → serves the static files via Nginx
#   Nginx is lightweight and perfect for serving React builds.
# ============================================================


# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (layer caching)
# If package.json hasn't changed, npm won't re-install
COPY package.json .

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code and build the production bundle
COPY . .
RUN npm run build


# ── Stage 2: Runtime ────────────────────────────────────────
FROM nginx:alpine AS runtime

# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
# Handles React Router (returns index.html for all routes)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
