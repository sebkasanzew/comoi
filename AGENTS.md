# Project Summary: Comoi

## Overview
**Comoi** is a consumer-facing **grocery marketplace app** for **Southeast Asia**, with an initial focus on **Vietnam**.

The platform connects consumers with nearby **local mini-markets**, enabling price transparency and convenient ordering in markets that are traditionally offline and fragmented.

---

## Core Problem
Local mini-markets in SEA are typically:
- Fragmented and highly localized
- Price-intransparent
- Offline-first and low-tech
- Difficult to compare or order from digitally

Consumers want:
- Clear price comparison across nearby markets
- Convenient pickup or delivery options
- A simple, mobile-first user experience

---

## Product Scope

### Platforms
- Web application (initial)
- Mobile applications (iOS / Android)

### User Types
1. **Consumers**
   - Browse products from nearby mini-markets
   - Compare prices between stores
   - Place orders for pickup or delivery

2. **Vendors (Mini-markets)**
   - Manage product catalog and pricing
   - Receive and fulfill orders
   - Update availability and stock levels (manually or semi-automated)

---

## Core Features

### Consumer Features
- Location-based market discovery
- Product search and category browsing
- Price comparison across multiple markets
- Shopping cart with multi-vendor support
- Pickup or delivery selection
- Order status tracking and notifications

### Vendor Features
- Simple catalog and price management
- Order intake and status updates
- Lightweight inventory adjustments  
  (not intended to be a full ERP system, but maybe in the future)

---

## Key Constraints & Assumptions
- Vendors are small, local, and often low-tech
- Inventory and pricing data may be:
  - Incomplete
  - Slightly outdated
  - Manually maintained
- The system must tolerate **eventual consistency**
- Mobile connectivity can be unreliable
- Payments may initially rely on:
  - Cash on delivery
  - Local digital wallets

---

## Non-Goals (MVP)
- Real-time warehouse-level inventory
- Complex supply-chain or route optimization
- Cross-city or inter-region logistics
- Advanced vendor analytics or forecasting

---

## Initial Geography
- Launch market: **Vietnam**
- Designed for expansion to other SEA countries:
  - Singapore
  - Thailand
  - Indonesia
  - Philippines
  - Malaysia

---

## Technical Expectations
- Mobile-first UX
- Offline-tolerant client behavior
- Scalable to thousands of small vendors
- Strong emphasis on:
  - Developer experience
  - Clear domain boundaries
  - Long-term extensibility (payments, promotions, loyalty)

---

## Open Architecture Questions
- Monolith vs modular monolith vs microservices
- Data modeling:
  - Products vs offers vs vendors
- Handling stale pricing and user trust
- Search and geospatial querying strategy
- Order splitting and fulfillment across vendors
- Low-friction vendor onboarding

## Architecture Decisions (Final)
- **Next.js** with App Router for Web-Frontend and API layer
- **Effect.js** for type-safe error handling, dependency injection, and business logic composition
- **Convex** for database, real-time sync, and backend functions
- **React Native + Expo** for Mobile Apps
- **Convex Optimistic Updates** for offline-tolerance (no WatermelonDB needed for MVP)
- **Testing** with Playwright (E2E), Vitest (unit/integration), Convex Test
- **Turborepo** for monorepo management
- **TypeScript** for all layers
- **CI/CD** with GitHub Actions
- **Infrastructure** on Vercel (Next.js) + Convex Cloud
- **Payment integration**: MoMo + VNPay + PayOS (COD fallback)
- **Messaging**: Zalo OA + ZNS for vendor communication
- **i18n**: i18next + react-i18next
- **Maps**: Google Maps Platform

---

## Expected Output from the Planning Phase ✅

**Status**: Complete - See [PLAN.md](PLAN.md)

The plan provides:
- ✅ High-level system architecture with Convex + Effect.js
- ✅ Recommended tech stack (full detail)
- ✅ Core data model (Convex schema)
- ✅ Key trade-offs and risks
- ✅ MVP-first implementation strategy (24-week roadmap)
- ✅ Payment integration strategy (MoMo, VNPay, PayOS)
- ✅ Vendor onboarding approach (Zalo-first)
- ✅ Offline strategy (Convex optimistic updates)
- ✅ Effect.js architecture patterns
- ✅ Testing strategy

**Key Decisions Made**:
1. **Convex over Supabase** - Better TypeScript DX, automatic reactivity, built-in sync
2. **Full Effect.js adoption** - Learning goal, type-safe errors, DI
3. **No WatermelonDB for MVP** - Convex optimistic updates sufficient for grocery shopping use case
4. **Modular monolith** - Faster MVP, can split later if needed
5. **Zalo-first vendor approach** - Market fit for Vietnam

**Next Steps**: Begin Phase 1 implementation (Project setup + Effect.js foundation)
