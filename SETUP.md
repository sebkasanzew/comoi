# Setup Guide

This guide walks you through setting up the Comoi development environment and external services.

## Prerequisites

- **Bun** - Install with `curl -fsSL https://bun.sh/install | bash`
- **VS Code** - [Download](https://code.visualstudio.com/)
- **xcpretty** (optional) - Improves Xcode build output formatting (used by our Detox scripts). Install locally with:

  ```bash
  gem install --user-install xcpretty
  ```

  Then ensure the gem bin directory is on your PATH (add to `~/.zshrc`):

  ```bash
  echo 'export PATH="$(ruby -e '\''print Gem.user_dir'\'')/bin:$PATH"' >> ~/.zshrc
  source ~/.zshrc
  ```

  For CI (macOS runners) add a step before building:

  ```yaml
  - name: Install xcpretty
    run: gem install xcpretty
  ```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/sebkasanzew/comoi.git
cd comoi

# Install dependencies
bun install

# Run all apps in development mode
bun run dev
```

## External Services Setup

### 1. Convex (Backend & Database)

Convex provides our database, real-time subscriptions, and serverless functions.

#### Create a Convex Project

1. Sign up at [https://dashboard.convex.dev](https://dashboard.convex.dev)
2. Create a new project named "comoi"
3. Note your deployment URL (e.g., `https://your-deployment.convex.cloud`)

#### Configure Convex

```bash
# Navigate to the convex package
cd packages/convex

# Login to Convex CLI
bunx convex login

# Initialize Convex (link to your project)
bunx convex dev
```

This will:
- Generate type definitions in `convex/_generated/`
- Start the Convex development server
- Push your schema to Convex

#### Environment Variables

Add your Convex URL to the web apps:

```bash
# apps/web/.env.local
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 2. Clerk (Authentication)

Clerk provides authentication with support for email/password, OAuth, and passkeys.

#### Create a Clerk Application

1. Sign up at [https://clerk.com](https://clerk.com)
2. Create a new application named "Comoi"
3. Configure your sign-in options:
   - Email/Password
   - Google OAuth
   - Facebook OAuth (popular in Vietnam)
   - Apple OAuth (for iOS users)

#### Configure Clerk for Web (Next.js)

1. Copy your API keys from the Clerk Dashboard

```bash
# apps/web/.env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

2. Optional: Configure sign-in/sign-up URLs

```bash
# apps/web/.env.local
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

#### Configure Clerk for Mobile (Expo)

1. In Clerk Dashboard, create a new "Mobile" application or use the same app
2. Add your API keys to Expo environment

```bash
# apps/mobile/.env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

#### Configure Convex to Validate Clerk JWTs

1. Get your Clerk JWT Issuer Domain from:
   - Clerk Dashboard → Configure → JWT Templates → Convex
   - Or use: `https://<your-instance>.clerk.accounts.dev`

2. Add to Convex Environment Variables:
   - Go to [Convex Dashboard](https://dashboard.convex.dev)
   - Navigate to Settings > Environment Variables
   - Add: `CLERK_JWT_ISSUER_DOMAIN=https://<your-instance>.clerk.accounts.dev`

#### Create a Convex JWT Template in Clerk (Important!)

1. Go to Clerk Dashboard → JWT Templates
2. Click "New template"
3. Select "Convex" from the list
4. Save the template

This ensures Clerk issues JWTs that Convex can validate.

### 3. Expo (Mobile App)

Expo simplifies React Native development with managed workflows and OTA updates.

#### Create an Expo Account

1. Sign up at [https://expo.dev](https://expo.dev)
2. Install EAS CLI: `bun add -g eas-cli`
3. Login: `eas login`

#### Configure Expo

```bash
# Navigate to the mobile app
cd apps/mobile

# Link to your Expo account
eas init --id your-expo-project-id
```

#### Development

```bash
# Start Expo development server
cd apps/mobile
bun run dev

# Or run on specific platform
bun run ios      # iOS Simulator
bun run android  # Android Emulator
bun run web      # Web browser
```

#### Build for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### 4. Google Maps Platform (Optional for Development)

Required for location-based features like finding nearby vendors.

#### Get API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Distance Matrix API
4. Create credentials (API Key)
5. Restrict the API key to your domains

#### Configure

```bash
# apps/web/.env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key

# apps/mobile - add to app.json config
```

### 5. Payment Providers (Production Only)

For testing, use COD (Cash on Delivery). Set up payment providers when ready for production.

#### MoMo

1. Register at [MoMo Business](https://business.momo.vn/)
2. Complete merchant verification
3. Get sandbox credentials for testing

#### VNPay

1. Register at [VNPay](https://vnpay.vn/)
2. Complete merchant verification
3. Get sandbox credentials for testing

#### PayOS

1. Register at [PayOS](https://payos.vn/)
2. Complete merchant verification
3. Get API credentials

---

## Development Workflow

### Available Commands

```bash
# Install dependencies
bun install

# Development (all apps)
bun run dev

# Build all packages
bun run build

# Run tests
bun run test

# Type checking
bun run typecheck

# Linting (Biome + ESLint)
bun run lint

# Fix linting issues
bun run lint:fix

# Format code
bun run format

# All checks (lint + typecheck + test)
bun run check
```

### Running Individual Apps

```bash
# Web app (consumer + vendor)
cd apps/web && bun run dev
# Consumer: http://localhost:3000
# Vendor dashboard: http://localhost:3000/vendor

# Mobile app
cd apps/mobile && bun run dev
# Opens Expo dev server

# Convex backend
cd packages/convex && bun run dev
# Starts Convex development server
```

### Seeding Development Data

The project includes a seed system for populating the database with realistic Vietnamese grocery marketplace data using `@faker-js/faker`.

#### Quick Seed

```bash
# From project root - seed with default counts
bun run seed

# Reset and reseed (clears all tables first)
bun run seed:reset
```

#### Custom Seed Configuration

```bash
# From packages/convex directory
cd packages/convex

# Seed with custom counts
bunx convex run seed:runSeed '{"categories": 10, "products": 50, "vendors": 20}'

# Custom counts with reset
bunx convex run seed:runSeed '{"reset": true, "customers": 100, "orders": 200}'
```

#### Default Counts
| Table | Default Count |
|-------|---------------|
| Categories | 8 |
| Products | ~50 (all from categories) |
| Vendors | 12 |
| Customers | 25 |
| Orders | 50 |

> **Note:** Price offers are auto-generated (each vendor carries 60-90% of products). Order items are created with each order (1-5 items per order).

#### What Gets Seeded

- **Categories**: 8 Vietnamese grocery categories (Vegetables, Meat, Seafood, Dairy, Rice, Seasonings, Beverages, Dry Goods)
- **Products**: Realistic Vietnamese grocery items with names in Vietnamese and English
- **Vendors**: Mini-markets with Vietnamese names, addresses, and phone numbers
- **Price Offers**: Vendor-specific pricing with stock status
- **Customers**: Vietnamese names, phone numbers, and addresses
- **Orders**: Realistic orders with multiple items, various statuses, and payment methods

### VS Code Extensions

Open the project in VS Code and install recommended extensions:
- Biome (fast linting)
- ESLint (React hooks rules)
- Convex
- Tailwind CSS IntelliSense
- GitHub Copilot

---

## Project Structure

```
comoi/
├── apps/
│   ├── web/           # Consumer web app (Next.js 15)
│   ├── vendor/        # Vendor dashboard (Next.js 15)
│   └── mobile/        # Consumer mobile app (Expo/React Native)
├── packages/
│   ├── convex/        # Convex backend, schema, services
│   ├── shared/        # Shared types and utilities
│   ├── ui/            # Shared UI components
│   ├── eslint-config/ # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── biome.json         # Biome configuration
└── turbo.json         # Turborepo configuration
```

---

## Troubleshooting

### Convex Issues

**"Cannot find Convex deployment"**
```bash
cd packages/convex
bunx convex login
bunx convex dev
```

**Schema changes not reflecting**
```bash
bunx convex dev --once  # Push schema changes
```

### Expo Issues

**"Expo CLI not found"**
```bash
bun add -g expo-cli eas-cli
```

**Metro bundler issues**
```bash
cd apps/mobile
bunx expo start --clear
```

### Build Issues

**TypeScript errors after dependency changes**
```bash
bun install
bun run build
```

**Stale cache issues**
```bash
bun run clean
bun install
```

---

## Next Steps

After setup, continue with:

1. **Week 2: Effect.js Foundation** - See [PLAN.md](./PLAN.md)
   - Create base service structure
   - Implement ConfigService
   - Implement DatabaseService wrapper

2. **Week 3: Convex Auth** - Set up phone OTP authentication

3. **Week 4: Core Services** - Build out catalog, vendor, and order services
