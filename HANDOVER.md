# AlphaCom Online — Client Handover Document

**Project:** AlphaCom Online (alphacom)  
**Type:** E-commerce / technology store frontend  
**Primary URL:** https://www.alphacomonline.com  
**Handover Date:** February 10, 2025  

---

## 1. Project Overview

AlphaCom Online is a **Next.js 14** e-commerce frontend for a premium technology store in Computer Village, Lagos, Nigeria. The site allows customers to browse products and categories, manage cart and wishlist, sign in/up, checkout, track orders, and contact the store (including via WhatsApp).

### Key features delivered

- **Home:** Hero, product categories, featured products  
- **Products:** Listing, filters, product detail pages (by slug and by ID)  
- **Categories:** Category listing and subcategory/product browsing  
- **Auth:** Sign in, sign up, forgot password  
- **Cart & wishlist:** Cart drawer, wishlist (Redux state)  
- **Checkout:** Checkout flow and payment verification  
- **Order tracking:** Order tracking page  
- **Stores:** Store locator/info page  
- **Legal & info:** About, Contact, Privacy, Terms, Return Policy, Warranty  
- **SEO & technical:** Sitemaps (main + products), `robots.txt`, `ads.txt`, security.txt redirect, metadata, Open Graph, Twitter cards, JSON-LD (WebSite + LocalBusiness)  
- **UX:** Dark/light theme, WhatsApp floating widget, loading states/skeletons, Vercel Analytics & Speed Insights  

---

## 2. Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, PostCSS |
| UI components | Radix UI, custom components in `components/ui/` |
| State | Redux Toolkit (cart, auth, checkout, theme, wishlist) |
| Data fetching | TanStack React Query, Axios |
| Forms | React Hook Form, Zod |
| Fonts | Geist (Vercel) |
| Hosting / analytics | Vercel (Analytics, Speed Insights) |

---

## 3. Repository Structure (High Level)

```
alphacom/
├── app/                    # Next.js App Router pages & routes
│   ├── page.tsx            # Home
│   ├── layout.tsx          # Root layout, metadata, providers
│   ├── globals.css
│   ├── about/, auth/, categories/, checkout/, contact/
│   ├── payment/verify/, products/, stores/, track/
│   ├── privacy/, terms/, return-policy/, warranty/
│   ├── sitemap.xml/, sitemap-products.xml/, robots.txt/, ads.txt/
│   └── .well-known/security.txt/
├── components/             # React components
│   ├── app-layout.tsx      # Main layout (header + footer + content)
│   ├── modern-header.tsx, modern-footer.tsx
│   ├── hero-section.tsx, featured-products.tsx, product-categories.tsx
│   ├── cart-drawer.tsx, premium-checkout.tsx
│   ├── product-detail-client.tsx, product-filters.tsx
│   ├── whatsapp-widget.tsx, theme-toggle.tsx
│   ├── ui/                 # Reusable UI (buttons, cards, inputs, etc.)
│   └── skeletons/          # Loading skeletons
├── lib/                    # Utilities and API layer
│   ├── api-client.ts       # Axios instance, auth token, refresh logic
│   ├── api/                # auth, categories, orders, products
│   └── providers/          # React Query provider
├── store/                  # Redux store and slices
│   ├── store.ts
│   └── slices/             # auth, cart, checkout, theme, wishlist
├── hooks/                  # use-auth, use-cart, use-checkout, use-orders, use-products, use-wishlist
├── types/                  # TypeScript types (e.g. auth)
└── public/                 # Static assets (images, logos, icons)
```

---

## 4. Environment Variables

The app expects these **optional** environment variables (e.g. in Vercel or a `.env.local` file):

| Variable | Purpose | Default (if unset) |
|----------|---------|--------------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (used by `lib/api-client.ts`) | `https://api.alphacomonline.com` |
| `NEXT_PUBLIC_API_BASE_URL` | Alternative API base (used in `lib/api/orders.ts`) | `http://localhost:8000` |

**Recommendation:** Use one canonical API base and align both `api-client.ts` and `lib/api/orders.ts` to the same variable (e.g. `NEXT_PUBLIC_API_URL`) so production and staging are consistent.

---

## 5. How to Run the Project

### Prerequisites

- Node.js 18+ (or 20+ recommended)  
- npm (or yarn/pnpm/bun)  

### Commands

```bash
# Install dependencies
npm install

# Development (with hot reload)
npm run dev
# → Open http://localhost:3000

# Production build
npm run build

# Run production build locally
npm start

# Lint
npm run lint
```

**Note:** The project has `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true` in `next.config.mjs`. For long-term maintenance, consider re-enabling these and fixing issues.

---

## 6. Backend API Assumptions

The frontend is built to work with a backend that provides:

- **Auth:** Login, signup, refresh token, forgot-password (JWT in `Authorization: Bearer …`).  
- **Products:** List, filters, single product (by slug and by id).  
- **Categories:** List categories and subcategories, products per category.  
- **Orders:** Create order, verify payment, order tracking.  

API base URL is set via `NEXT_PUBLIC_API_URL` (default: `https://api.alphacomonline.com`).  
Auth tokens are stored in `localStorage` (`auth_token`, `refresh_token`, `user_data`). The client refreshes tokens on 401 and redirects to `/auth/signin` if refresh fails.

---

## 7. Key Configuration and Customization

### Branding and contact

- **Metadata, Open Graph, JSON-LD:** Set in `app/layout.tsx` (title, description, URLs, social links, address, phone, email).  
- **WhatsApp:** Phone number and default message are in `components/whatsapp-widget.tsx` (e.g. `+2347026384967`).  
- **Favicon / icons:** Referenced in `layout.tsx` and `public/` (e.g. `alphacomwhitelogo.ico`).  

### SEO and verification

- **Search console:** In `app/layout.tsx`, `metadata.verification` has placeholders for Google, Yandex, and Yahoo. Replace `"your-google-verification-code"` (and similar) with real meta tags or verification codes.  
- **Canonical / sitemaps:** Canonical URL and sitemap routes are set for `https://www.alphacomonline.com`.  
- **Security.txt:** `app/.well-known/security.txt/routes.ts` redirects to `https://your-domain.com/security.txt`. Update to your live domain and ensure a real `security.txt` is served there.  

### Images

- **Next.js images:** `next.config.mjs` has `images: { unoptimized: true, domains: ['res.cloudinary.com'] }`. For production, consider enabling the default Next.js image optimizer and configuring allowed domains (e.g. Cloudinary) via `remotePatterns` if you upgrade config.  

---

## 8. Deployment (Vercel)

- The app is set up for Vercel (Analytics and Speed Insights are in the root layout).  
- **Build command:** `npm run build` (or `next build`).  
- **Output:** Standard Next.js output (no custom `dist` path).  
- Set `NEXT_PUBLIC_API_URL` (and optionally `NEXT_PUBLIC_API_BASE_URL`) in the Vercel project environment variables for production and preview.

---

## 9. Maintenance and Next Steps

1. **Env consistency:** Unify API base URL usage on `NEXT_PUBLIC_API_URL` (or one chosen name) across `lib/api-client.ts` and `lib/api/orders.ts`.  
2. **Linting and TypeScript:** Turn off `ignoreDuringBuilds` / `ignoreBuildErrors` and fix reported issues.  
3. **SEO:** Replace placeholder verification codes and confirm `security.txt` URL.  
4. **Images:** If you use Cloudinary or other CDNs, align `next.config.mjs` with Next.js image optimization and security (e.g. `remotePatterns`).  
5. **Content:** Update About, Contact, and legal pages as needed; ensure store hours and contact details in `layout.tsx` JSON-LD match reality.  

---

## 10. Support and Contacts (Placeholder)

- **Development / handover:** [Your name/company and contact]  
- **Client:** [Client name and contact]  
- **Hosting:** Vercel project — ensure client has access to the linked Git repo and Vercel project for deployments and env changes.  

---

*This handover document was generated for the AlphaCom Online project. Update the placeholders (verification codes, security.txt URL, support contacts) and any project-specific notes before sharing with the client.*
