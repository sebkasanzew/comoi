# Setup Guide

This guide walks you through setting up the Comoi development environment and external services.

## Prerequisites

- **Bun** - Install with `curl -fsSL https://bun.sh/install | bash`
- **VS Code** - [Download](https://code.visualstudio.com/)

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

# apps/vendor/.env.local
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 2. Expo (Mobile App)

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

### 3. Google Maps Platform (Optional for Development)

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

### 4. Payment Providers (Production Only)

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
# Web app (consumer)
cd apps/web && bun run dev
# Opens at http://localhost:3000

# Vendor dashboard
cd apps/vendor && bun run dev
# Opens at http://localhost:3001

# Mobile app
cd apps/mobile && bun run dev
# Opens Expo dev server

# Convex backend
cd packages/convex && bun run dev
# Starts Convex development server
```

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
