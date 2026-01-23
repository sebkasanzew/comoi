/**
 * @comoi/shared
 *
 * Shared types, utilities, and Effect.js services for Comoi applications.
 */

// Re-export types
export type { Currency, OrderStatus, PaymentMethod, PaymentStatus, StockStatus } from "./types";

// Re-export constants
export {
  CURRENCIES,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  STOCK_STATUSES,
} from "./types";

// Re-export utilities
export { formatCurrency, formatDistance, isValidVietnamesePhone } from "./utils";
