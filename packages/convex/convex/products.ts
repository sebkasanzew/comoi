import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get all products with optional category filter
 */
export const list = query({
  args: {
    categoryId: v.optional(v.id("categories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { categoryId, limit }) => {
    const productsQuery = categoryId
      ? ctx.db.query("products").withIndex("by_category", (q) => q.eq("category_id", categoryId))
      : ctx.db.query("products");

    const products = await productsQuery.collect();

    if (limit) {
      return products.slice(0, limit);
    }

    return products;
  },
});

/**
 * Get a single product by ID
 */
export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

/**
 * Search products by name
 */
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, { searchTerm }) => {
    if (!searchTerm.trim()) {
      return [];
    }

    const results = await ctx.db
      .query("products")
      .withSearchIndex("search_name", (q) => q.search("name_vi", searchTerm))
      .take(20);

    return results;
  },
});

/**
 * Get product with price offers from all vendors
 */
export const getWithPrices = query({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => {
    const product = await ctx.db.get(productId);
    if (!product) return null;

    const priceOffers = await ctx.db
      .query("price_offers")
      .withIndex("by_product", (q) => q.eq("product_id", productId).eq("is_available", true))
      .collect();

    // Get vendor details for each price offer
    const offersWithVendors = await Promise.all(
      priceOffers.map(async (offer) => {
        const vendor = await ctx.db.get(offer.vendor_id);
        return {
          vendorId: offer.vendor_id,
          vendorName: vendor?.name ?? "Unknown",
          price: offer.price,
          originalPrice: undefined as number | undefined, // Not in schema yet
          stock: offer.stock_status,
          district: vendor?.address.district ?? "",
          distance: undefined as number | undefined, // Would calculate based on user location
        };
      })
    );

    // Sort by price (lowest first)
    offersWithVendors.sort((a, b) => a.price - b.price);

    // Get category
    const category = await ctx.db.get(product.category_id);

    return {
      product,
      category,
      offers: offersWithVendors.filter((o) => o.vendorName !== "Unknown"),
    };
  },
});
