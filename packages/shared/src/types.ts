/**
 * Core types used across Comoi applications
 */

/**
 * Supported currencies
 */
export const CURRENCIES = ["VND", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

/**
 * Stock status for products at vendors
 */
export const STOCK_STATUSES = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"] as const;
export type StockStatus = (typeof STOCK_STATUSES)[number];

/**
 * Order lifecycle statuses
 */
export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "DELIVERING",
  "COMPLETED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/**
 * Payment lifecycle statuses
 */
export const PAYMENT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/**
 * Supported payment methods for Vietnam
 */
export const PAYMENT_METHODS = ["MOMO", "VNPAY", "PAYOS", "COD"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/**
 * Geographic location
 */
export interface Location {
  lat: number;
  lng: number;
}

/**
 * Vietnamese address structure
 */
export interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
  raw: string; // User's original input
}
