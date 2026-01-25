# Comoi 🛒

**A modern grocery marketplace connecting consumers with local mini-markets in Southeast Asia**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Convex-1.31-orange.svg)](https://convex.dev/)
[![Effect](https://img.shields.io/badge/Effect-3.19-purple.svg)](https://effect.website/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Expo](https://img.shields.io/badge/Expo-54-000020.svg)](https://expo.dev/)
[![Bun](https://img.shields.io/badge/Bun-1.3-fbf0df.svg)](https://bun.sh/)

---

## 🌟 Overview

Comoi is a consumer-facing grocery marketplace platform designed for Southeast Asian markets, with an initial focus on **Vietnam**. The platform bridges the gap between consumers and local mini-markets, bringing price transparency and digital ordering to traditionally offline, fragmented markets.

### The Problem

Local mini-markets in Southeast Asia are:
- Highly fragmented and localized
- Price-intransparent
- Offline-first with low-tech infrastructure
- Difficult for consumers to compare or order from digitally

### The Solution

Comoi provides:
- 📍 **Location-based market discovery** - Find nearby mini-markets instantly
- 💰 **Price transparency** - Compare prices across multiple vendors
- 🛒 **Easy ordering** - Place orders for pickup or delivery
- 📱 **Mobile-first experience** - Optimized for smartphones with offline support
- 🏪 **Vendor-friendly tools** - Simple catalog and order management

---

## 🚀 Features

### For Consumers
- Browse products from nearby mini-markets
- Compare prices between stores in real-time
- Search by product name or category
- Add items from multiple vendors to cart
- Choose pickup or delivery
- Multiple payment options (MoMo, VNPay, COD)
- Track order status and history

### For Vendors
- Simple onboarding via Zalo
- Manage product catalog and pricing
- Receive and fulfill orders
- Update stock availability
- Track sales and revenue

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Package Manager** | [Bun](https://bun.sh/) | 1.3.6 |
| **Monorepo** | [Turborepo](https://turbo.build/) | 2.7.5 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.9.3 |
| **Web Apps** | [Next.js](https://nextjs.org/) (App Router) | 16.1.4 |
| **Mobile App** | [Expo](https://expo.dev/) + React Native | 54.0.32 |
| **Backend/DB** | [Convex](https://convex.dev/) | 1.31.6 |
| **Business Logic** | [Effect.js](https://effect.website/) | 3.19.15 |
| **UI Library** | [React](https://react.dev/) | 19.2.3 |
| **Linting** | [Biome](https://biomejs.dev/) + [ESLint](https://eslint.org/) | 2.3.12 / 9.39 |
| **Testing** | [Vitest](https://vitest.dev/) | 4.0.18 |
| **i18n** | [i18next](https://www.i18next.com/) | 25.8.0 |
| **Authentication** | [Convex Auth](https://labs.convex.dev/auth) | 0.0.90 |

### Integrations
- **Payment**: MoMo, VNPay, PayOS
- **Messaging**: Zalo OA, ZNS notifications
- **Maps**: Google Maps Platform

### Infrastructure
- **Web Hosting**: [Vercel](https://vercel.com/)
- **Backend**: [Convex Cloud](https://convex.dev/)
- **CI/CD**: GitHub Actions
- **Dependency Updates**: Renovate

---

## 📁 Project Structure

```
comoi/
├── apps/
│   ├── web/                    # Next.js 16 consumer + vendor web app
│   │   └── src/app/
│   │       ├── vendor/         # Vendor dashboard routes
│   │       └── auth/           # Authentication pages
│   └── mobile/                 # Expo 54 React Native app
│
├── packages/
│   ├── convex/                 # Convex backend (schema, functions, auth)
│   │   └── convex/
│   │       ├── schema.ts       # Database schema (with authTables)
│   │       ├── auth.ts         # Authentication configuration
│   │       ├── http.ts         # HTTP routes (OAuth callbacks)
│   │       └── _generated/     # Auto-generated types
│   ├── shared/                 # Shared types, utils, constants
│   ├── ui/                     # Shared UI components
│   ├── eslint-config/          # Shared ESLint configurations
│   └── typescript-config/      # Shared TypeScript configurations
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│
├── biome.json                  # Biome linting/formatting config
├── turbo.json                  # Turborepo task definitions
├── PLAN.md                     # Detailed architecture plan
├── AGENTS.md                   # Project context & AI agent guide
└── README.md                   # This file
```

---

## 🏁 Getting Started

### Prerequisites

- **Bun** 1.3.6+ - [Installation guide](https://bun.sh/docs/installation)
- **Git** - For version control
- (Optional) **Convex CLI**: `bun add -g convex`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sebkasanzew/comoi.git
   cd comoi
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up Convex** (if not already connected)
   ```bash
   cd packages/convex
   npx convex dev
   ```
   Follow the prompts to authenticate and create a deployment.

4. **Configure environment variables**
   
   Copy `.env.example` to `.env.local` in each app folder:
   ```bash
   # Root level for Convex package
   cp .env.example .env.local
   
   # Web app
   cp apps/web/.env.example apps/web/.env.local
   
   # Mobile app
   cp apps/mobile/.env.example apps/mobile/.env.local
   ```
   
   Update `NEXT_PUBLIC_CONVEX_URL` / `EXPO_PUBLIC_CONVEX_URL` with your Convex deployment URL.

5. **Run development servers**
   ```bash
   # Start all apps in development mode
   bun run dev
   ```

   This starts:
   - Web app (consumer + vendor) at `http://localhost:3000`
   - Vendor dashboard at `http://localhost:3000/vendor`
   - Mobile app via Expo

### Available Scripts

```bash
# Development
bun run dev           # Start all apps in development
bun run build         # Build all packages and apps

# Code Quality
bun run lint          # Run Biome + ESLint
bun run lint:fix      # Fix linting issues
bun run format        # Format code with Biome
bun run format:check  # Check formatting
bun run typecheck     # TypeScript type checking

# Testing
bun run test          # Run all tests
bun run test:watch    # Run tests in watch mode
bun run check         # Run lint + typecheck + test

# Maintenance
bun run clean         # Clean all build artifacts
```

---

## 🗺️ Roadmap

### Phase 1: Foundation (Weeks 1-4) 🚧
- [x] Monorepo setup with Turborepo + Bun
- [x] Next.js 16 web apps (consumer + vendor)
- [x] Expo 54 mobile app scaffold
- [x] Convex schema design
- [x] Shared packages (ui, shared, configs)
- [x] CI/CD with GitHub Actions
- [x] Biome + ESLint setup
- [ ] Effect.js service layer
- [ ] Core business logic implementation

### Phase 2: Consumer MVP (Weeks 5-8)
- [ ] Product catalog and search
- [ ] Vendor discovery with maps
- [ ] Shopping cart
- [ ] Basic checkout (COD)

### Phase 3: Payments & Orders (Weeks 9-12)
- [ ] MoMo integration
- [ ] VNPay integration
- [ ] Order management
- [ ] Zalo notifications

### Phase 4: Vendor Dashboard (Weeks 13-16)
- [ ] Vendor onboarding flow
- [ ] Catalog management
- [ ] Order fulfillment
- [ ] Basic analytics

### Phase 5: Mobile App (Weeks 17-20)
- [ ] Full React Native implementation
- [ ] Offline support with Convex optimistic updates
- [ ] Mobile payments
- [ ] Push notifications

### Phase 6: Launch (Weeks 21-24)
- [ ] Performance optimization
- [ ] Testing & QA
- [ ] Monitoring & analytics
- [ ] Soft launch in Ho Chi Minh City

See [PLAN.md](PLAN.md) for detailed implementation strategy.

---

## 🌍 Localization

Comoi currently supports:
- 🇻🇳 **Vietnamese** (vi) - Primary language
- 🇬🇧 **English** (en) - Secondary language

Planned expansions:
- 🇸🇬 Singapore
- 🇹🇭 Thailand
- 🇮🇩 Indonesia
- 🇵🇭 Philippines
- 🇲🇾 Malaysia

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Effect.js for business logic and error handling
- Write tests for new features
- Follow the existing code style (Biome + ESLint)
- Use Conventional Commits for commit messages
- Update documentation as needed

See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete workflow guide.

---

## 👨‍💻 Author

**Sebastian Kasanzew**
- GitHub: [@sebkasanzew](https://github.com/sebkasanzew)

---

## 🙏 Acknowledgments

- [Convex](https://convex.dev/) for the amazing backend platform
- [Effect.js](https://effect.website/) for type-safe functional programming
- [Theo Browne](https://twitter.com/t3dotgg) for insightful tech content
- The Vietnamese tech community for inspiration

---

## 📚 Documentation

- [Architecture Plan](PLAN.md) - Detailed technical architecture
- [Project Context](AGENTS.md) - Problem statement and decisions
- [Convex Docs](https://docs.convex.dev/)
- [Effect.js Docs](https://effect.website/docs/introduction)

---

## 🐛 Issues & Support

Found a bug or have a question? Please [open an issue](https://github.com/sebkasanzew/comoi/issues).

---

**Built with ❤️ for Southeast Asia**
