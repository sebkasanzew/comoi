/**
 * Shared utility functions
 */

/**
 * Format a number as Vietnamese Dong currency
 */
export function formatCurrency(amount: number, currency = "VND"): string {
  if (currency === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format distance in km
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
}

/**
 * Validate Vietnamese phone number
 * Supports formats: 0912345678, +84912345678, 84912345678
 */
export function isValidVietnamesePhone(phone: string): boolean {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, "");

  // Vietnamese mobile numbers start with 03, 05, 07, 08, 09
  // Landlines start with 02
  const vnPhoneRegex = /^(?:\+?84|0)(?:3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;

  return vnPhoneRegex.test(cleaned);
}
