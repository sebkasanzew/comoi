# Comoi 🛒

**A modern grocery marketplace connecting consumers with local mini-markets in Southeast Asia**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Convex-Backend-orange.svg)](https://convex.dev/)
[![Effect](https://img.shields.io/badge/Effect-TS-purple.svg)](https://effect.website/)

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

### Frontend
- **[Next.js 16+](https://nextjs.org/)** - Web application with App Router
- **[React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)** - iOS & Android apps
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety across all layers

### Backend
- **[Convex](https://convex.dev/)** - Reactive database, real-time sync, type-safe functions
- **[Effect.js](https://effect.website/)** - Type-safe error handling, dependency injection, composable business logic

### Infrastructure
- **[Vercel](https://vercel.com/)** - Web hosting and deployment
- **[Convex Cloud](https://convex.dev/)** - Backend and database hosting
- **[Turborepo](https://turbo.build/)** - Monorepo management

### Integrations
- **Payment**: MoMo, VNPay, PayOS
- **Messaging**: Zalo OA, ZNS notifications
- **Maps**: Google Maps Platform
- **i18n**: i18next + react-i18next

---

## 📁 Project Structure

```
comoi/
├── apps/
│   ├── web/                    # Next.js web app (consumer)
│   ├── mobile/                 # React Native app (Expo)
│   └── vendor/                 # Vendor dashboard (Next.js)
│
├── packages/
│   ├── shared/                 # Shared types, utils, constants
│   └── ui/                     # Shared UI components
│
├── convex/                     # Convex backend
│   ├── schema.ts               # Database schema
│   ├── services/               # Effect.js services
│   ├── products.ts             # Queries & mutations
│   ├── orders.ts
│   ├── vendors.ts
│   └── http.ts                 # Webhooks & API endpoints
│
├── PLAN.md                     # Detailed architecture plan
├── AGENTS.md                   # Project context & decisions
└── README.md                   # This file
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** 20+ and **npm** or **pnpm**
- **Convex CLI**: `npm install -g convex`
- **Expo CLI**: `npm install -g expo-cli`
- Google Maps API key
- Payment provider accounts (MoMo/VNPay sandbox)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sebkasanzew/comoi.git
   cd comoi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Add your API keys and secrets
   ```

5. **Run development servers**
   ```bash
   # Start all apps
   npm run dev

   # Or run individually
   npm run dev:web        # Next.js web app
   npm run dev:mobile     # Expo mobile app
   npm run dev:vendor     # Vendor dashboard
   ```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Convex function tests
npm run test:convex
```

---

## 🗺️ Roadmap

### Phase 1: Foundation (Weeks 1-4) ✅
- [x] Monorepo setup with Turborepo
- [x] Convex schema and authentication
- [x] Effect.js service architecture
- [ ] Core services implementation

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
- [ ] React Native app with Expo
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
- Follow the existing code style (ESLint + Prettier)
- Update documentation as needed

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
