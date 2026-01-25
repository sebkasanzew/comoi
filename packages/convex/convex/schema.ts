import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Comoi Database Schema
 *
 * A grocery marketplace connecting consumers with local mini-markets in Vietnam.
 * See PLAN.md for detailed architecture documentation.
 *
 * Authentication is handled by Clerk - user data synced via webhooks.
 */
export default defineSchema({
  /**
   * Users (synced from Clerk via webhooks)
   * Stores Clerk user data for application use
   */
  users: defineTable({
    clerk_id: v.string(), // Clerk user ID
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    name: v.optional(v.string()),
    image_url: v.optional(v.string()),
    role: v.union(v.literal("customer"), v.literal("vendor"), v.literal("admin")),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_clerk_id", ["clerk_id"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  /**
   * Vendors (Mini-markets)
   */
  vendors: defineTable({
    name: v.string(),
    name_en: v.optional(v.string()),
    phone: v.string(),
    zalo_id: v.optional(v.string()),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    address: v.object({
      street: v.string(),
      ward: v.string(),
      district: v.string(),
      city: v.string(),
      raw: v.string(), // User's original input
    }),
    delivery_radius_km: v.number(),
    is_active: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_active", ["is_active"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["is_active"],
    }),

  /**
   * Products (Master catalog)
   */
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
    updated_at: v.number(),
  })
    .index("by_category", ["category_id"])
    .index("by_barcode", ["barcode"])
    .searchIndex("search_name", {
      searchField: "name_vi",
    }),

  /**
   * Categories (Product categories)
   */
  categories: defineTable({
    name_vi: v.string(),
    name_en: v.optional(v.string()),
    slug: v.string(),
    parent_id: v.optional(v.id("categories")),
    icon: v.optional(v.string()),
    order: v.number(),
  })
    .index("by_parent", ["parent_id"])
    .index("by_slug", ["slug"]),

  /**
   * Price Offers (Vendor-specific pricing)
   */
  price_offers: defineTable({
    vendor_id: v.id("vendors"),
    product_id: v.id("products"),
    price: v.number(), // VND, no decimals
    stock_status: v.union(v.literal("IN_STOCK"), v.literal("LOW_STOCK"), v.literal("OUT_OF_STOCK")),
    is_available: v.boolean(),
    updated_at: v.number(),
  })
    .index("by_vendor", ["vendor_id", "is_available"])
    .index("by_product", ["product_id", "is_available"])
    .index("by_vendor_product", ["vendor_id", "product_id"]),

  /**
   * Customers (Consumer users)
   */
  customers: defineTable({
    phone: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    addresses: v.array(
      v.object({
        id: v.string(),
        label: v.string(), // "Home", "Work"
        location: v.object({
          lat: v.number(),
          lng: v.number(),
        }),
        address: v.object({
          street: v.string(),
          ward: v.string(),
          district: v.string(),
          city: v.string(),
          raw: v.string(),
        }),
        is_default: v.boolean(),
      })
    ),
    preferred_language: v.union(v.literal("vi"), v.literal("en")),
    created_at: v.number(),
  }).index("by_phone", ["phone"]),

  /**
   * Orders
   */
  orders: defineTable({
    customer_id: v.id("customers"),
    vendor_id: v.id("vendors"),
    status: v.union(
      v.literal("PENDING"),
      v.literal("CONFIRMED"),
      v.literal("PREPARING"),
      v.literal("READY"),
      v.literal("DELIVERING"),
      v.literal("COMPLETED"),
      v.literal("CANCELLED")
    ),
    payment_method: v.union(
      v.literal("MOMO"),
      v.literal("VNPAY"),
      v.literal("PAYOS"),
      v.literal("COD")
    ),
    payment_status: v.union(
      v.literal("PENDING"),
      v.literal("PROCESSING"),
      v.literal("COMPLETED"),
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
        raw: v.string(),
      }),
    }),
    notes: v.optional(v.string()),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_customer", ["customer_id", "created_at"])
    .index("by_vendor", ["vendor_id", "status"])
    .index("by_status", ["status"]),

  /**
   * Order Items
   */
  order_items: defineTable({
    order_id: v.id("orders"),
    product_id: v.id("products"),
    vendor_id: v.id("vendors"),
    quantity: v.number(),
    unit_price: v.number(),
    total_price: v.number(),
  }).index("by_order", ["order_id"]),
});
