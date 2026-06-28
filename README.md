# NextCart

NextCart is a full-stack e-commerce marketplace built with Next.js 15 and the App Router. It includes a public storefront, store owner dashboard, admin approval workflows, Stripe payments, image uploads via ImageKit, OpenAI product description generation, and PostgreSQL data storage using Prisma + Neon.

## Key Features

- Public storefront with products, categories, cart, and checkout
- Store and seller dashboard for listing and managing products
- Admin approval flows for stores and coupons
- Clerk authentication for users, store sellers, and admins
- Stripe webhook support for payment success/cancellation
- Product AI assistant for automated name/description generation
- Prisma schema with User, Product, Store, Order, Coupon, Rating, Address
- Inngest event routing for background tasks

## Project Structure

- `app/` – Next.js App Router pages, layouts, API routes
- `components/` – UI components and feature widgets
- `configs/` – service clients for OpenAI, ImageKit, Prisma
- `lib/` – Prisma and store setup
- `middlewares/` – auth middleware for admin and seller routes
- `prisma/` – Prisma schema definition
- `inngest/` – Inngest client and background functions

## Getting Started

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root and configure these values:

```env
DATABASE_URL=postgresql://...
# optional direct DB URL for Prisma
DIRECT_URL=

# Clerk auth config
NEXT_PUBLIC_CLERK_FRONTEND_API=
CLERK_API_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# ImageKit
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# OpenAI
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL=gpt-4.1-mini

# Admin & currency
ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_CURRENCY_SYMBOL=$
```

> Note: If your app uses a different Clerk configuration, adjust Clerk env vars accordingly. `OPENAI_BASE_URL` is optional unless you use a custom OpenAI-compatible endpoint.

### Database setup

If you are using Prisma migrations, run:

```bash
npx prisma migrate dev
```

Or if you want to push the schema directly:

```bash
npx prisma db push
```

### Run the app

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Scripts

- `npm run dev` — start development server
- `npm run build` — generate Prisma client and build production app
- `npm start` — run the production server
- `npm run lint` — run Next.js lint checks

## Notes

- `app/layout.jsx` wraps the app with `ClerkProvider` and a Redux `Provider` from `StoreProvider.js`
- `configs/prisma.config.js` reads database URLs from env vars for Prisma
- `configs/openai.js` configures OpenAI using `OPENAI_API_KEY` and `OPENAI_BASE_URL`
- `configs/imageKit.js` configures ImageKit for image uploads
- `app/api/stripe/route.js` validates Stripe webhook events with `STRIPE_WEBHOOK_SECRET`
- `prisma/schema.prisma` defines relational models for users, stores, products, orders, ratings, and coupons

## Deployment

This app can be deployed to Vercel or any Node.js-compatible hosting service that supports Next.js. Ensure all required environment variables are configured in your target environment.

## License

This project is provided as-is.
