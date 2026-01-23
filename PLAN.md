# Comoi Architecture Plan

**Last Updated:** January 23, 2026  
**Status:** Draft v2.0

---

## Executive Summary

Build a **modular monolith** with Next.js (web + API) and React Native/Expo (mobile), backed by **Convex** (reactive database + real-time sync + type-safe functions). Use **Effect.js** throughout for type-safe error handling, dependency injection, and business logic composition. Integrate **MoMo + VNPay + COD** for payments. Use **Zalo** for vendor communication and onboarding. Start Vietnam-only with clear expansion points for other SEA markets.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                         │
├──────────────────────┬──────────────────────┬──────────────────────────────┤
│   Web (Next.js)      │  Mobile (Expo/RN)    │  Vendor Dashboard (Next.js)  │
│   - Consumer PWA     │  - iOS/Android       │  - Simple web UI             │
│   - SSR/RSC          │  - Convex client     │  - Zalo Mini App (future)    │
│   - Convex React     │  - Optimistic UI     │                              │
└──────────┬───────────┴──────────┬───────────┴──────────────┬───────────────┘
           │                      │                          │
           │                      │                          │
           └──────────────────────┴──────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONVEX (Reactive Database + Functions)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │              Effect.js Business Logic Layer                          │   │
│  │  ┌──────────────┬──────────────┬──────────────┬─────────────────┐  │   │
│  │  │  Catalog     │  Orders      │  Payments    │  Vendors        │  │   │
│  │  │  Service     │  Service     │  Service     │  Service        │  │   │
│  │  └──────────────┴──────────────┴──────────────┴─────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Convex Functions (TypeScript)                     │   │
│  │  - Queries (read, reactive, cached)                                  │   │
│  │  - Mutations (write, transactional)                                  │   │
│  │  - Actions (external API calls, Effect.js orchestration)             │   │
│  │  - HTTP endpoints (webhooks, payment callbacks)                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      Convex Database                                 │   │
│  │  - Document-based, strongly typed (Zod-like schemas)                 │   │
│  │  - Automatic indexing                                                │   │
│  │  - Full-text search                                                  │   │
│  │  - Reactive subscriptions                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                  │
├────────────────────┬────────────────────────┬───────────────────────────────┤
│  Google Maps       │  Payment Providers     │  Messaging                    │
│  - Places API      │  - MoMo                │  - Zalo OA (vendors)          │
│  - Geocoding       │  - VNPay               │  - ZNS (notifications)        │
│  - Distance Matrix │  - PayOS               │  - Expo Push (consumers)      │
└────────────────────┴────────────────────────┴───────────────────────────────┘
```

---

## Tech Stack (Updated)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Web Frontend** | Next.js 16+ (App Router) | SSR/RSC for SEO, streaming UI, TypeScript-first, integrates well with Convex |
| **Mobile Apps** | React Native + Expo | Cross-platform, OTA updates, Convex React Native client |
| **Backend/Functions** | Convex + Effect.js | Type-safe mutations/queries, reactive, Effect for composition |
| **Database** | Convex | Document DB, reactive subscriptions, built-in real-time sync, excellent DX |
| **Business Logic** | Effect.js | Type-safe errors, dependency injection, testable, composable |
| **Authentication** | Convex Auth | Built-in, supports phone OTP, social login, type-safe |
| **Offline Strategy** | Convex Optimistic Updates + Local Cache | Convex handles sync automatically, optimistic UI for perceived performance |
| **Maps/Geo** | Google Maps Platform | Best Vietnam coverage, Places API for autocomplete |
| **Payments** | MoMo + VNPay + PayOS | Cover 90%+ of Vietnamese digital payments |
| **Messaging** | Zalo OA + ZNS | Vendor communication, order notifications |
| **i18n** | i18next + react-i18next | Most mature, works across web and mobile |
| **Infra** | Vercel (Next.js) + Convex Cloud | Managed, scales well, developer-friendly |
| **CDN/Images** | Cloudflare Images or Convex Storage | Vietnamese edge PoP, affordable |

---

## Why Convex over Supabase?

Based on Theo Browne's analysis and project requirements:

| Feature | Convex | Supabase | Winner |
|---------|--------|----------|--------|
| **TypeScript DX** | First-class, generated types, Zod-like schemas | Good, but manual type generation | ✅ Convex |
| **Real-time** | Built-in, automatic reactivity | Available via subscriptions | ✅ Convex |
| **Offline Sync** | Optimistic updates, automatic conflict resolution | Requires custom implementation | ✅ Convex |
| **Functions** | Run in DB, transactional, type-safe | Edge Functions (Deno), separate from DB | ✅ Convex |
| **Learning Curve** | Moderate (new paradigm) | Lower (familiar PostgreSQL) | Supabase |
| **Maturity** | Newer, smaller ecosystem | Mature, large community | Supabase |
| **Database Type** | Document (flexible schema) | PostgreSQL (relational) | Depends |
| **Open Source** | Yes (recently) | Yes | Tie |
| **Auth** | Built-in, type-safe | Excellent, mature | Supabase |

**Decision:** Convex's superior TypeScript integration, automatic reactivity, and built-in sync capabilities align perfectly with our mobile-first, offline-tolerant requirements. The learning curve is acceptable given the project's educational goals.

---

## Do We Still Need WatermelonDB?

**Short answer: No, not for MVP.**

### Convex's Offline Capabilities:
- **Optimistic updates**: UI responds immediately, syncs in background
- **Automatic retries**: Failed mutations retry when connection restored
- **Conflict resolution**: Built-in CRDT-like handling
- **Client caching**: Queries cached locally, updated reactively

### When You Might Add WatermelonDB Later:
- **True offline-first**: User needs to work for hours without connectivity
- **Complex offline writes**: Multiple related mutations while offline
- **Performance**: Tens of thousands of local records needed for instant search

**Recommendation:** Start with Convex's optimistic updates and local caching. If user research shows extended offline usage (unlikely for grocery shopping), add WatermelonDB in Phase 6+.

---

## Effect.js Architecture

### Core Principles
1. **All business logic uses Effect.js**
2. **Services are Effect services with dependency injection**
3. **Errors are typed and handled explicitly**
4. **Side effects (API calls, DB writes) are tracked**
5. **Testing uses Effect's testing utilities**

### Service Structure

```typescript
// convex/services/catalog.ts
import { Effect, Context } from "effect";
import type { MutationCtx, QueryCtx } from "./_generated/server";

// Define service interface
export class CatalogService extends Context.Tag("CatalogService")<
  CatalogService,
  {
    readonly searchProducts: (query: string) => Effect.Effect<Product[], CatalogError>;
    readonly getPriceOffers: (productId: string, location: Location) => Effect.Effect<PriceOffer[], CatalogError>;
    readonly updateProductPrice: (vendorId: string, productId: string, price: number) => Effect.Effect<void, CatalogError>;
  }
>() {}

// Errors
export class CatalogError extends Data.TaggedError("CatalogError")<{
  reason: "ProductNotFound" | "VendorNotFound" | "InvalidPrice";
  message: string;
}> {}

// Live implementation
export const CatalogServiceLive = Layer.succeed(
  CatalogService,
  CatalogService.of({
    searchProducts: (query) =>
      Effect.gen(function* (_) {
        const db = yield* _(DatabaseService);
        const results = yield* _(
          Effect.tryPromise({
            try: () => db.query("products").withSearchIndex("name", q => q.search("name", query)).collect(),
            catch: (error) => new CatalogError({ reason: "ProductNotFound", message: String(error) })
          })
        );
        return results;
      }),
    
    getPriceOffers: (productId, location) =>
      Effect.gen(function* (_) {
        const db = yield* _(DatabaseService);
        const geo = yield* _(GeoService);
        
        // Find nearby vendors
        const vendors = yield* _(geo.findNearbyVendors(location));
        
        // Get price offers from those vendors
        const offers = yield* _(
          Effect.forEach(vendors, (vendor) =>
            db.query("price_offers")
              .withIndex("by_vendor_product", q => 
                q.eq("vendor_id", vendor._id).eq("product_id", productId)
              )
              .first()
          )
        );
        
        return offers.filter(o => o !== null);
      }),
    
    updateProductPrice: (vendorId, productId, price) =>
      Effect.gen(function* (_) {
        yield* _(
          Effect.when(price <= 0, () => 
            new CatalogError({ reason: "InvalidPrice", message: "Price must be positive" })
          )
        );
        
        const db = yield* _(DatabaseService);
        yield* _(
          Effect.tryPromise({
            try: () => db.patch(priceOfferId, { price, updated_at: Date.now() }),
            catch: (error) => new CatalogError({ reason: "VendorNotFound", message: String(error) })
          })
        );
      })
  })
);
```

### Convex Function Integration

```typescript
// convex/products.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Effect } from "effect";
import { CatalogService, CatalogServiceLive } from "./services/catalog";

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    // Run Effect in Convex function
    const program = Effect.gen(function* (_) {
      const catalog = yield* _(CatalogService);
      return yield* _(catalog.searchProducts(args.query));
    });

    const runnable = Effect.provide(program, CatalogServiceLive);
    
    return await Effect.runPromise(runnable);
  }
});

export const updatePrice = mutation({
  args: { 
    vendorId: v.string(), 
    productId: v.string(), 
    price: v.number() 
  },
  handler: async (ctx, args) => {
    const program = Effect.gen(function* (_) {
      const catalog = yield* _(CatalogService);
      yield* _(catalog.updateProductPrice(args.vendorId, args.productId, args.price));
    });

    const runnable = Effect.provide(program, CatalogServiceLive);
    
    // Effect error handling
    const result = await Effect.runPromise(
      Effect.catchAll(runnable, (error) => 
        Effect.fail(new Error(`Catalog error: ${error.message}`))
      )
    );
    
    return result;
  }
});
```

### Testing with Effect

```typescript
// convex/services/catalog.test.ts
import { Effect, Layer } from "effect";
import { describe, it, expect } from "vitest";
import { CatalogService } from "./catalog";

// Mock service for testing
const CatalogServiceTest = Layer.succeed(
  CatalogService,
  CatalogService.of({
    searchProducts: (query) => Effect.succeed([
      { id: "1", name: "Test Product", price: 100 }
    ]),
    getPriceOffers: (productId, location) => Effect.succeed([]),
    updateProductPrice: (vendorId, productId, price) => Effect.void
  })
);

describe("CatalogService", () => {
  it("searches products successfully", async () => {
    const program = Effect.gen(function* (_) {
      const catalog = yield* _(CatalogService);
      return yield* _(catalog.searchProducts("test"));
    });

    const runnable = Effect.provide(program, CatalogServiceTest);
    const result = await Effect.runPromise(runnable);
    
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Test Product");
  });
});
```

---

## Core Data Model (Convex)

### Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  vendors: defineTable({
    name: v.string(),
    name_en: v.optional(v.string()),
    phone: v.string(),
    zalo_id: v.optional(v.string()),
    location: v.object({
      lat: v.number(),
      lng: v.number()
    }),
    address: v.object({
      street: v.string(),
      ward: v.string(),
      district: v.string(),
      city: v.string(),
      raw: v.string() // User's original input
    }),
    delivery_radius_km: v.number(),
    is_active: v.boolean(),
    created_at: v.number(),
    updated_at: v.number()
  })
    .index("by_active", ["is_active"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["is_active"]
    }),

  products: defineTable({
    sku: v.string(),
    name_vi: v.string(),
    name_en: v.optional(v.string()),
    description_vi: v.optional(v.string()),
    description_en: v.optional(v.string()),
    image_url: v.optional(v.string()),
    barcode: v.optional(v.string()),
    category_id: v.id("categories"),
    unit: v.string(), // "kg", "piece", "pack"
    created_at: v.number(),
    updated_at: v.number()
  })
    .index("by_category", ["category_id"])
    .index("by_barcode", ["barcode"])
    .searchIndex("search_name", {
      searchField: "name_vi"
    }),

  categories: defineTable({
    name_vi: v.string(),
    name_en: v.optional(v.string()),
    slug: v.string(),
    parent_id: v.optional(v.id("categories")),
    icon: v.optional(v.string()),
    order: v.number()
  })
    .index("by_parent", ["parent_id"])
    .index("by_slug", ["slug"]),

  price_offers: defineTable({
    vendor_id: v.id("vendors"),
    product_id: v.id("products"),
    price: v.number(), // VND, no decimals
    stock_status: v.union(
      v.literal("IN_STOCK"),
      v.literal("LOW_STOCK"),
      v.literal("OUT_OF_STOCK")
    ),
    is_available: v.boolean(),
    updated_at: v.number()
  })
    .index("by_vendor", ["vendor_id", "is_available"])
    .index("by_product", ["product_id", "is_available"])
    .index("by_vendor_product", ["vendor_id", "product_id"]),

  customers: defineTable({
    phone: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    addresses: v.array(v.object({
      id: v.string(),
      label: v.string(), // "Home", "Work"
      location: v.object({
        lat: v.number(),
        lng: v.number()
      }),
      address: v.object({
        street: v.string(),
        ward: v.string(),
        district: v.string(),
        city: v.string(),
        raw: v.string()
      }),
      is_default: v.boolean()
    })),
    preferred_language: v.union(v.literal("vi"), v.literal("en")),
    created_at: v.number()
  })
    .index("by_phone", ["phone"]),

  orders: defineTable({
    customer_id: v.id("customers"),
    vendor_id: v.id("vendors"),
    status: v.union(
      v.literal("PENDING"),
      v.literal("CONFIRMED"),
      v.literal("PREPARING"),
      v.literal("READY"),
      v.literal("COMPLETED"),
      v.literal("CANCELLED")
    ),
    payment_method: v.union(
      v.literal("MOMO"),
      v.literal("VNPAY"),
      v.literal("ZALOPAY"),
      v.literal("COD")
    ),
    payment_status: v.union(
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("FAILED"),
      v.literal("REFUNDED")
    ),
    payment_reference: v.optional(v.string()), // External payment ID
    subtotal: v.number(),
    delivery_fee: v.number(),
    total: v.number(),
    delivery_address: v.object({
      location: v.object({ lat: v.number(), lng: v.number() }),
      address: v.object({
        street: v.string(),
        ward: v.string(),
        district: v.string(),
        city: v.string(),
        raw: v.string()
      })
    }),
    notes: v.optional(v.string()),
    created_at: v.number(),
    updated_at: v.number()
  })
    .index("by_customer", ["customer_id", "created_at"])
    .index("by_vendor", ["vendor_id", "status"])
    .index("by_status", ["status"]),

  order_items: defineTable({
    order_id: v.id("orders"),
    product_id: v.id("products"),
    vendor_id: v.id("vendors"),
    quantity: v.number(),
    unit_price: v.number(),
    total_price: v.number()
  })
    .index("by_order", ["order_id"])
});
```

### Key Design Decisions
- **Document model**: Flexible schema, nested objects (addresses, location)
- **No joins needed**: Convex queries can load related data efficiently
- **Indexes**: Carefully defined for common query patterns
- **Search indexes**: Built-in full-text search for products/vendors
- **Timestamps**: Using `v.number()` (Unix epoch) for simplicity
- **Enums**: Using `v.union()` with literals for type safety

---

## Payment Integration Strategy

### Payment Flow with Effect.js

```typescript
// convex/services/payment.ts
import { Effect, Context, Data } from "effect";

export class PaymentError extends Data.TaggedError("PaymentError")<{
  code: "INVALID_AMOUNT" | "PROVIDER_ERROR" | "WEBHOOK_VERIFICATION_FAILED";
  provider?: "MOMO" | "VNPAY" | "ZALOPAY";
  message: string;
}> {}

export class PaymentService extends Context.Tag("PaymentService")<
  PaymentService,
  {
    readonly initiateMoMoPayment: (orderId: string, amount: number) => Effect.Effect<{ paymentUrl: string }, PaymentError>;
    readonly verifyMoMoWebhook: (signature: string, data: unknown) => Effect.Effect<boolean, PaymentError>;
    readonly initiateVNPayPayment: (orderId: string, amount: number) => Effect.Effect<{ paymentUrl: string }, PaymentError>;
  }
>() {}

// Implementation
export const PaymentServiceLive = Layer.effect(
  PaymentService,
  Effect.gen(function* (_) {
    const config = yield* _(ConfigService);
    
    return PaymentService.of({
      initiateMoMoPayment: (orderId, amount) =>
        Effect.gen(function* (_) {
          // Validate amount
          yield* _(
            Effect.when(amount <= 0, () =>
              new PaymentError({ code: "INVALID_AMOUNT", message: "Amount must be positive" })
            )
          );

          // Call MoMo API
          const momoConfig = yield* _(config.getMoMoConfig);
          const response = yield* _(
            Effect.tryPromise({
              try: () => fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
                method: "POST",
                body: JSON.stringify({
                  partnerCode: momoConfig.partnerCode,
                  orderId,
                  amount,
                  // ... other MoMo fields
                })
              }),
              catch: (error) => new PaymentError({ 
                code: "PROVIDER_ERROR", 
                provider: "MOMO",
                message: String(error) 
              })
            })
          );

          const data = yield* _(
            Effect.tryPromise({
              try: () => response.json(),
              catch: () => new PaymentError({ 
                code: "PROVIDER_ERROR", 
                provider: "MOMO",
                message: "Failed to parse response" 
              })
            })
          );

          return { paymentUrl: data.payUrl };
        }),

      verifyMoMoWebhook: (signature, data) =>
        Effect.gen(function* (_) {
          const config = yield* _(ConfigService);
          const momoConfig = yield* _(config.getMoMoConfig);
          
          // Verify signature using MoMo's secret key
          const isValid = yield* _(
            Effect.try({
              try: () => {
                // HMAC SHA256 verification logic
                return true; // Placeholder
              },
              catch: () => new PaymentError({
                code: "WEBHOOK_VERIFICATION_FAILED",
                provider: "MOMO",
                message: "Invalid signature"
              })
            })
          );

          return isValid;
        }),

      initiateVNPayPayment: (orderId, amount) =>
        Effect.gen(function* (_) {
          // Similar to MoMo implementation
          return { paymentUrl: "https://sandbox.vnpayment.vn/..." };
        })
    });
  })
);
```

### Convex HTTP Endpoints for Webhooks

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Effect } from "effect";
import { PaymentService, PaymentServiceLive } from "./services/payment";

const http = httpRouter();

// MoMo webhook
http.route({
  path: "/webhooks/momo",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    
    const program = Effect.gen(function* (_) {
      const payment = yield* _(PaymentService);
      const db = yield* _(DatabaseService);
      
      // Verify webhook
      const isValid = yield* _(payment.verifyMoMoWebhook(body.signature, body));
      
      if (!isValid) {
        return new Response("Invalid signature", { status: 400 });
      }

      // Update order payment status
      yield* _(
        db.patch(body.orderId, {
          payment_status: body.resultCode === 0 ? "PAID" : "FAILED",
          payment_reference: body.transId
        })
      );

      return new Response("OK", { status: 200 });
    });

    const runnable = Effect.provide(program, Layer.merge(PaymentServiceLive, DatabaseServiceLive));
    
    try {
      await Effect.runPromise(runnable);
      return new Response("OK");
    } catch (error) {
      console.error("Webhook error:", error);
      return new Response("Error", { status: 500 });
    }
  })
});

export default http;
```

---

## Mobile App Architecture with Convex

### React Native + Convex Integration

```typescript
// apps/mobile/convex/ConvexProvider.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  // Enable optimistic updates
  optimisticUpdates: true
});

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ConvexAuthProvider>{children}</ConvexAuthProvider>
    </ConvexProvider>
  );
}
```

### Optimistic UI Example

```typescript
// apps/mobile/app/cart/index.tsx
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function CartScreen() {
  const cart = useQuery(api.cart.get);
  const addToCart = useMutation(api.cart.addItem);
  
  const handleAddItem = async (productId: string, quantity: number) => {
    // Optimistic update - UI updates immediately
    await addToCart({ productId, quantity });
    // Convex automatically handles sync and rollback if error
  };

  return (
    <View>
      {cart?.items.map(item => (
        <CartItem key={item.id} {...item} />
      ))}
      <Button onPress={() => handleAddItem("prod_123", 1)}>
        Add Item
      </Button>
    </View>
  );
}
```

### Offline Behavior

Convex handles offline automatically:
1. **User goes offline**: Mutations queue locally
2. **Optimistic updates**: UI updates immediately with expected result
3. **User comes back online**: Queued mutations execute in order
4. **Conflict resolution**: Convex handles conflicts automatically (last-write-wins by default)

**No WatermelonDB needed** unless:
- User needs to work offline for extended periods (hours)
- Complex offline workflows (unlikely for grocery shopping)

---

## Geospatial Queries with Convex

### Vendor Discovery

Convex doesn't have native geospatial indexes (like PostGIS), so we use a hybrid approach:

```typescript
// convex/vendors.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

// Haversine distance formula
function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const findNearby = query({
  args: { 
    lat: v.number(), 
    lng: v.number(),
    maxDistanceKm: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const maxDistance = args.maxDistanceKm ?? 10;
    
    // Get all active vendors (could add bounding box filter for efficiency)
    const vendors = await ctx.db
      .query("vendors")
      .withIndex("by_active", q => q.eq("is_active", true))
      .collect();

    // Calculate distances and filter
    const nearby = vendors
      .map(vendor => ({
        ...vendor,
        distance: calculateDistance(
          args.lat, 
          args.lng, 
          vendor.location.lat, 
          vendor.location.lng
        )
      }))
      .filter(vendor => vendor.distance <= Math.min(maxDistance, vendor.delivery_radius_km))
      .sort((a, b) => a.distance - b.distance);

    return nearby;
  }
});
```

**Optimization for Scale:**
- Add bounding box pre-filter (rough lat/lng range)
- Cache results in client
- Consider adding vendor grid/cell indexes for very large vendor counts (>10k)

---

## Localization Architecture

### i18n Setup with Convex

```typescript
// apps/web/lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    vi: {
      common: {
        search: "Tìm kiếm",
        cart: "Giỏ hàng",
        checkout: "Thanh toán"
      },
      products: {
        add_to_cart: "Thêm vào giỏ",
        price: "Giá",
        stock: "Tình trạng"
      }
    },
    en: {
      common: {
        search: "Search",
        cart: "Cart",
        checkout: "Checkout"
      },
      products: {
        add_to_cart: "Add to Cart",
        price: "Price",
        stock: "Stock Status"
      }
    }
  },
  lng: "vi", // Default to Vietnamese
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
```

### Currency Formatting

```typescript
// packages/shared/utils/currency.ts
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(amount);
}

// Usage: formatVND(1500000) → "1.500.000 ₫"
```

---

## Vendor Onboarding with Zalo

### Zalo Official Account Flow

```typescript
// convex/vendors.ts (mutation)
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const registerViaZalo = mutation({
  args: {
    zalo_id: v.string(),
    phone: v.string(),
    name: v.string(),
    address_raw: v.string()
  },
  handler: async (ctx, args) => {
    // 1. Geocode address using Google Maps API
    const location = await geocodeAddress(args.address_raw);
    
    // 2. Create vendor record
    const vendorId = await ctx.db.insert("vendors", {
      name: args.name,
      phone: args.phone,
      zalo_id: args.zalo_id,
      location,
      address: {
        street: "",
        ward: "",
        district: "",
        city: "",
        raw: args.address_raw
      },
      delivery_radius_km: 3, // Default 3km
      is_active: false, // Requires admin approval
      created_at: Date.now(),
      updated_at: Date.now()
    });

    // 3. Send notification to admin for review
    // 4. Send confirmation to vendor via Zalo ZNS
    
    return vendorId;
  }
});
```

### Zalo Notification via Convex Action

```typescript
// convex/actions/zalo.ts
import { action } from "../_generated/server";
import { v } from "convex/values";

export const sendOrderNotification = action({
  args: {
    zalo_id: v.string(),
    order_id: v.string(),
    message: v.string()
  },
  handler: async (ctx, args) => {
    // Zalo ZNS API call
    const response = await fetch("https://business.openapi.zalo.me/message/template", {
      method: "POST",
      headers: {
        "access_token": process.env.ZALO_ACCESS_TOKEN!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: args.zalo_id,
        template_id: "YOUR_TEMPLATE_ID",
        template_data: {
          order_id: args.order_id,
          message: args.message
        }
      })
    });

    return await response.json();
  }
});
```

---

## Project Structure (Turborepo Monorepo)

```
comoi/
├── apps/
│   ├── web/                    # Next.js web app (consumer)
│   │   ├── app/                # App router pages
│   │   ├── components/         # React components
│   │   ├── lib/                # Utils, i18n
│   │   └── convex/             # Convex client setup
│   │
│   ├── mobile/                 # React Native (Expo) app
│   │   ├── app/                # Expo Router pages
│   │   ├── components/         # Shared components
│   │   ├── convex/             # Convex client setup
│   │   └── package.json
│   │
│   └── vendor/                 # Vendor dashboard (Next.js)
│       ├── app/
│       └── components/
│
├── packages/
│   ├── shared/                 # Shared types, utils
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Currency, date formatting
│   │   └── constants/          # Enums, configs
│   │
│   └── ui/                     # Shared UI components (optional)
│       └── components/         # Cross-platform components
│
├── convex/                     # Convex backend
│   ├── schema.ts               # Database schema
│   ├── services/               # Effect.js services
│   │   ├── catalog.ts
│   │   ├── orders.ts
│   │   ├── payment.ts
│   │   └── vendors.ts
│   ├── products.ts             # Convex queries/mutations
│   ├── orders.ts
│   ├── vendors.ts
│   ├── actions/                # Convex actions (external calls)
│   │   ├── zalo.ts
│   │   └── maps.ts
│   ├── http.ts                 # HTTP endpoints (webhooks)
│   └── convex.json
│
├── turbo.json                  # Turborepo config
├── package.json
└── README.md
```

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)
**Goal:** Set up infrastructure, learn Effect.js, establish patterns

1. **Week 1: Project Setup**
   - Initialize Turborepo monorepo
   - Set up Convex project
   - Configure Next.js (web + vendor apps)
   - Set up React Native with Expo
   - Configure TypeScript, ESLint, Prettier

2. **Week 2: Effect.js Foundation**
   - Study Effect.js docs and examples
   - Create base service structure
   - Implement ConfigService (environment variables)
   - Implement DatabaseService (Convex wrapper)
   - Write first tests with Effect test utilities

3. **Week 3: Convex Schema & Auth**
   - Define complete Convex schema
   - Set up Convex Auth (phone OTP)
   - Implement auth flows in web and mobile
   - Create authentication Effect service

4. **Week 4: Core Services Structure**
   - Implement CatalogService skeleton
   - Implement OrderService skeleton
   - Implement VendorService skeleton
   - Set up dependency injection layers
   - Document Effect.js patterns for team

### Phase 2: Consumer MVP - Web (Weeks 5-8)
**Goal:** Functional web app for browsing and ordering

5. **Week 5: Product Catalog**
   - Category browsing UI
   - Product search (Convex full-text search)
   - Product detail page
   - Image upload (Convex storage or Cloudflare)

6. **Week 6: Vendor Discovery**
   - Location input with Google Places autocomplete
   - Nearby vendor discovery query
   - Vendor profile page
   - Distance calculation and filtering

7. **Week 7: Shopping Cart**
   - Add/remove items (optimistic updates)
   - Multi-vendor cart handling
   - Cart persistence (Convex reactive queries)
   - Price comparison view

8. **Week 8: Basic Checkout (COD)**
   - Delivery address selection
   - Order summary
   - Place order (COD only for now)
   - Order confirmation page

### Phase 3: Payments & Orders (Weeks 9-12)
**Goal:** Digital payment integration, order management

9. **Week 9: MoMo Integration**
   - PaymentService implementation with Effect.js
   - MoMo payment initiation
   - MoMo webhook handling (Convex HTTP endpoints)
   - Payment error handling

10. **Week 10: VNPay Integration**
    - VNPay payment flow
    - VNPay webhook handling
    - Payment method selection UI
    - Fallback to COD on payment failure

11. **Week 11: Order Management**
    - Order status updates (Convex mutations)
    - Customer order history
    - Reorder functionality
    - Order cancellation flow

12. **Week 12: Notifications**
    - Zalo ZNS setup
    - Order confirmation notifications
    - Order status update notifications
    - Email notifications (backup)

### Phase 4: Vendor Dashboard (Weeks 13-16)
**Goal:** Enable vendors to manage their business

13. **Week 13: Vendor Onboarding**
    - Zalo OA setup and QR code
    - Vendor registration flow
    - Admin approval interface
    - Vendor profile setup

14. **Week 14: Catalog Management**
    - Browse product catalog
    - Set prices for products (PriceOffer)
    - Update stock status
    - Bulk price updates

15. **Week 15: Order Fulfillment**
    - Incoming order notifications
    - Accept/reject orders
    - Update order status
    - Order completion workflow

16. **Week 16: Vendor Analytics (Basic)**
    - Daily/weekly sales reports
    - Popular products
    - Revenue tracking
    - Export data to CSV

### Phase 5: Mobile App (Weeks 17-20)
**Goal:** Native iOS/Android app with offline support

17. **Week 17: Mobile Foundation**
    - Expo Router setup
    - Convex React Native client integration
    - Navigation structure
    - Shared components with web

18. **Week 18: Core Mobile Features**
    - Product browsing (reactive Convex queries)
    - Vendor discovery with maps
    - Shopping cart (optimistic updates)
    - Location permissions and geolocation

19. **Week 19: Mobile Checkout & Payments**
    - Mobile payment flows (MoMo deep linking)
    - In-app payment WebView
    - Order tracking
    - Push notifications (Expo Push)

20. **Week 20: Offline Optimization**
    - Test offline scenarios
    - Optimize Convex caching
    - Queue management for offline actions
    - Loading states and error handling

### Phase 6: Polish & Launch (Weeks 21-24)
**Goal:** Production-ready application

21. **Week 21: Performance Optimization**
    - Web Vitals optimization
    - Mobile app performance profiling
    - Image optimization
    - Convex query optimization

22. **Week 22: Testing & QA**
    - E2E tests (Playwright for web)
    - Mobile testing (Detox or Maestro)
    - Payment testing (sandbox → production)
    - Load testing

23. **Week 23: Monitoring & Analytics**
    - Error tracking (Sentry)
    - Analytics (Mixpanel or PostHog)
    - Convex dashboard monitoring
    - Payment reconciliation

24. **Week 24: Soft Launch**
    - Deploy to production
    - Pilot area: 2-3 districts in Ho Chi Minh
    - Onboard 10-20 pilot vendors
    - Gather user feedback
    - Iterate rapidly

---

## Testing Strategy with Effect.js

### Unit Tests (Vitest)

```typescript
// convex/services/__tests__/catalog.test.ts
import { describe, it, expect } from "vitest";
import { Effect, Layer } from "effect";
import { CatalogService, CatalogError } from "../catalog";
import { DatabaseService } from "../database";

// Mock DatabaseService
const MockDatabaseService = Layer.succeed(
  DatabaseService,
  {
    query: (table) => ({
      withSearchIndex: () => ({
        collect: () => Promise.resolve([
          { id: "1", name_vi: "Coca Cola", price: 15000 }
        ])
      })
    })
  }
);

describe("CatalogService", () => {
  it("searches products successfully", async () => {
    const program = Effect.gen(function* (_) {
      const catalog = yield* _(CatalogService);
      return yield* _(catalog.searchProducts("cola"));
    });

    const runnable = Effect.provide(
      program,
      Layer.merge(CatalogServiceLive, MockDatabaseService)
    );

    const result = await Effect.runPromise(runnable);
    expect(result).toHaveLength(1);
    expect(result[0].name_vi).toBe("Coca Cola");
  });

  it("handles invalid price updates", async () => {
    const program = Effect.gen(function* (_) {
      const catalog = yield* _(CatalogService);
      return yield* _(catalog.updateProductPrice("vendor1", "product1", -100));
    });

    const runnable = Effect.provide(program, CatalogServiceLive);

    await expect(Effect.runPromise(runnable)).rejects.toThrow();
  });
});
```

### Integration Tests (Convex Test)

Convex provides built-in testing for queries/mutations:

```typescript
// convex/products.test.ts
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import schema from "./schema";
import { api } from "./_generated/api";

describe("Product queries", () => {
  it("searches products by name", async () => {
    const t = convexTest(schema);
    
    // Seed data
    await t.run(async (ctx) => {
      await ctx.db.insert("products", {
        name_vi: "Coca Cola 330ml",
        sku: "COCA-330",
        category_id: "cat_1",
        unit: "can",
        created_at: Date.now(),
        updated_at: Date.now()
      });
    });

    // Test query
    const results = await t.query(api.products.search, { query: "coca" });
    expect(results).toHaveLength(1);
    expect(results[0].name_vi).toContain("Coca Cola");
  });
});
```

### E2E Tests (Playwright)

```typescript
// apps/web/__tests__/checkout.spec.ts
import { test, expect } from "@playwright/test";

test("complete checkout flow with MoMo", async ({ page }) => {
  await page.goto("/");
  
  // Search for product
  await page.fill('[data-testid="search-input"]', "Coca Cola");
  await page.click('[data-testid="product-card"]:first-child');
  
  // Add to cart
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="cart-icon"]');
  
  // Checkout
  await page.click('[data-testid="checkout-button"]');
  await page.click('[data-testid="payment-momo"]');
  
  // Should redirect to MoMo (in test, we mock this)
  await expect(page).toHaveURL(/.*momo.*/);
});
```

---

## Key Trade-offs & Decisions

| Decision | Choice | Alternative | Rationale |
|----------|--------|-------------|-----------|
| **Database** | Convex | Supabase/PostgreSQL | Better TypeScript DX, automatic reactivity, built-in sync |
| **Business Logic** | Effect.js | Vanilla TypeScript | Type-safe errors, DI, composability, learning goal |
| **Mobile Offline** | Convex Optimistic Updates | WatermelonDB | Simpler for MVP, good enough for grocery shopping |
| **Monorepo** | Turborepo | Nx / Lerna | Faster, simpler, better Vercel integration |
| **Mobile Framework** | React Native + Expo | Flutter | Code sharing with web, JavaScript ecosystem |
| **Auth** | Convex Auth | Auth0 / Clerk | Integrated with Convex, cost-effective |
| **Payments** | Local providers (MoMo/VNPay) | Stripe | Stripe doesn't support Vietnam |
| **Messaging** | Zalo OA | WhatsApp Business | Better fit for Vietnamese market |

---

## Risks & Mitigations

| Risk | Severity | Mitigation Strategy |
|------|----------|---------------------|
| **Effect.js learning curve** | Medium | Dedicate Week 2 to learning, create patterns doc, start small |
| **Convex at scale** | Low-Medium | Monitor query performance, optimize indexes, can self-host if needed |
| **Payment provider reliability** | High | Integrate multiple providers, always support COD fallback |
| **Offline sync complexity** | Medium | Start with optimistic updates only, add WatermelonDB if needed |
| **Vendor tech literacy** | High | Progressive onboarding, Zalo-first, phone support |
| **Address/geo data quality** | Medium | Flexible input, manual corrections, Google Maps validation |
| **Google Maps costs** | Medium | Monitor usage, set quotas, evaluate Mapbox after launch |
| **Multi-vendor order UX** | Low | Clear UI showing split orders, test with users early |

---

## Success Metrics

### Technical Metrics
- **Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Mobile App**: Launch time < 2s, 60fps scrolling
- **API Response Time**: p95 < 500ms for queries
- **Error Rate**: < 1% for critical flows (checkout, payment)

### Business Metrics (Post-Launch)
- **Vendor Adoption**: 50+ vendors in first 3 months
- **User Retention**: 30% WAU after first purchase
- **Order Completion**: > 80% of carts convert to orders
- **Payment Success**: > 95% success rate for digital payments

---

## Next Steps

1. **Review this plan** - Validate assumptions, adjust timeline
2. **Set up development environment** - Install tools, create accounts
3. **Start Phase 1, Week 1** - Initialize monorepo, Convex project
4. **Create Effect.js learning plan** - Curate resources, examples
5. **Weekly check-ins** - Review progress, adjust course

---

## Resources & References

### Documentation
- **Convex**: https://docs.convex.dev/
- **Effect.js**: https://effect.website/docs/introduction
- **Next.js**: https://nextjs.org/docs
- **Expo**: https://docs.expo.dev/
- **Turborepo**: https://turbo.build/repo/docs

### Payment Providers
- **MoMo**: https://developers.momo.vn/
- **VNPay**: https://sandbox.vnpayment.vn/apis/
- **PayOS**: https://payos.vn/docs/

### Messaging
- **Zalo OA**: https://oa.zalo.me/
- **Zalo Developers**: https://developers.zalo.me/docs/

### Learning Resources
- **Effect.js Workshop**: https://effect.website/docs/workshop
- **Convex University**: https://docs.convex.dev/tutorial

---

## Conclusion

This architecture provides a solid foundation for Comoi with:
- ✅ **Type-safe end-to-end**: Effect.js + Convex schemas
- ✅ **Real-time sync**: Convex handles reactivity automatically
- ✅ **Offline-tolerant**: Optimistic updates for great UX
- ✅ **Payment flexibility**: Multiple providers + COD
- ✅ **Vendor-friendly**: Zalo-first, progressive onboarding
- ✅ **Scalable**: Can grow with user base, clear extension points
- ✅ **Learning-oriented**: Effect.js as educational goal

The 24-week roadmap is ambitious but achievable with focused execution. The modular structure allows for parallel development and clear milestones.

**Ready to build!** 🚀
