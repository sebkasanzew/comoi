/**
 * @comoi/shared
 *
 * Shared types, utilities, and Effect.js services for Comoi applications.
 */

// Re-export types
export type { Currency, StockStatus, OrderStatus, PaymentStatus, PaymentMethod } from "./types";

// Re-export constants
export {
  CURRENCIES,
  STOCK_STATUSES,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
} from "./types";

// Re-export utilities
export { formatCurrency, formatDistance, isValidVietnamesePhone } from "./utils";
