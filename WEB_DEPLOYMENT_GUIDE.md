# WorkForce 360 — Next.js Web Application Deployment Guide

WorkForce 360's multi-portal web application is built on **Next.js 15+ (App Router)** with **React 19**, **Tailwind CSS**, and **Supabase SSR**. This guide covers production deployment on Vercel and containerized Docker environments.

---

## 1. Application Portals Architecture

The web application encapsulates 4 role-gated experiences within a unified App Router structure:

| Route Namespace | Experience | Target Audience | Primary Features |
|---|---|---|---|
| `/(public)` | Marketing & Landing | Prospective Customers, Public | Feature showcases, SaaS pricing tiers, ROI calculator |
| `/(auth)` | Enterprise Login | All Users | Role-switchable demo authentication, password reset |
| `/employee` | Employee Portal | General Employees | Personal dashboard, attendance punches, leave ledger, BDT payslips |
| `/manager` | Manager Portal | Team Leads, Dept Heads | Scoped team overview, approval queue, team efficiency tracking |
| `/admin` | Company Admin | HR & Operations Admins | Lifecycle management, branch geofencing, shift rotations, payroll engine |
| `/platform-admin`| Platform Super Admin | SaaS Platform Owners | Multi-tenant metrics, subscription billing, remote device control |

---

## 2. Environment Variables

Create `.env.production` (or configure via your hosting provider's secrets manager):

```bash
# Monorepo Application URL
NEXT_PUBLIC_APP_URL="https://app.workforce360.com"

# Supabase Infrastructure
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Encryption & Session Secrets
APP_ENCRYPTION_KEY="your-32-byte-hex-encryption-key-for-credentials"
NEXTAUTH_SECRET="your-generated-random-32-char-secret"

# Localization & Default Timezone
NEXT_PUBLIC_DEFAULT_TIMEZONE="Asia/Dhaka"
NEXT_PUBLIC_DEFAULT_CURRENCY="BDT"
NEXT_PUBLIC_DEFAULT_LOCALE="bn-BD"

# Payment Gateways (Bangladesh)
SSLCOMMERZ_STORE_ID="workforce360_live"
SSLCOMMERZ_STORE_PASSWD="live_store_credential_here"
BKASH_APP_KEY="bkash_merchant_app_key"
BKASH_APP_SECRET="bkash_merchant_secret"
BKASH_USERNAME="bkash_merchant_username"
BKASH_PASSWORD="bkash_merchant_password"

# SMS Gateway (Bangladesh)
GREENWEB_SMS_TOKEN="greenweb_live_api_token"
```

---

## 3. Vercel Production Deployment (Recommended)

WorkForce 360 is optimized for zero-configuration Vercel deployment:

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Link & Set Root Directory
Link the repository and specify the web workspace root:

```bash
vercel link
# Set Root Directory to: apps/web
```

### Step 3: Configure Environment Variables
```bash
vercel env pull .env.production.local
```

### Step 4: Deploy to Production
```bash
vercel --prod
```

Vercel automatically detects the Next.js framework, runs `npm run build`, and distributes SSR routes and static assets across global edge CDNs.

---

## 4. Docker Container Deployment (Self-Hosted / Kubernetes)

For on-premise enterprise deployments in Bangladesh data centers, a production-optimized multi-stage `Dockerfile` is provided:

### Multi-Stage Dockerfile (`apps/web/Dockerfile`)

```dockerfile
# Stage 1: Dependencies & Monorepo Build
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN npm ci
RUN npm run build:packages
RUN npm --workspace=apps/web run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
```

### Build & Run Container

```bash
# Build Docker image
docker build -t workforce360-web:latest -f apps/web/Dockerfile .

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  --name workforce360 \
  --env-file .env.production \
  workforce360-web:latest
```

---

## 5. Security & HTTP Header Hardening

In `apps/web/next.config.mjs`, the following security headers are enforced across all responses:

- **Strict-Transport-Security**: `max-age=63072000; includeSubDomains; preload`
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=(self)`
- **Content-Security-Policy**: Enforces strict script and connect origins for Supabase Realtime WebSockets (`wss://*.supabase.co`).

---

## 6. Verification & Health Monitoring

To verify a production build locally before promoting to live traffic:

```bash
# Run local monorepo production build
npm --workspace=apps/web run build

# Start local production server
npm --workspace=apps/web run start
```

Health check endpoint: `GET /api/health` returns `200 OK` with Supabase connectivity status and database latency.
