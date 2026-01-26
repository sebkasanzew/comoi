"use client";

import { ArrowLeft, ChevronRight, Minus, Plus, ShoppingCart, Store, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, Card, ScrollArea } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

// Mock cart data for demonstration
// In a real app, this would come from Convex or local state
interface CartItem {
  id: string;
  productId: string;
  productName: string;
  vendorId: string;
  vendorName: string;
  price: number;
  quantity: number;
  unit: string;
}

interface CartVendorGroup {
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  subtotal: number;
}

// Sample data
const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: "1",
    productId: "prod1",
    productName: "Rau muống tươi",
    vendorId: "vendor1",
    vendorName: "Chợ Bến Thành",
    price: 15000,
    quantity: 2,
    unit: "bó",
  },
  {
    id: "2",
    productId: "prod2",
    productName: "Thịt ba chỉ",
    vendorId: "vendor1",
    vendorName: "Chợ Bến Thành",
    price: 180000,
    quantity: 1,
    unit: "kg",
  },
  {
    id: "3",
    productId: "prod3",
    productName: "Cà chua bi",
    vendorId: "vendor2",
    vendorName: "Minimart Quận 1",
    price: 45000,
    quantity: 1,
    unit: "kg",
  },
];

function groupCartByVendor(items: CartItem[]): CartVendorGroup[] {
  const groups: Record<string, CartVendorGroup> = {};

  for (const item of items) {
    const existing = groups[item.vendorId];
    if (!existing) {
      groups[item.vendorId] = {
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        items: [],
        subtotal: 0,
      };
    }
    const group = groups[item.vendorId];
    if (group) {
      group.items.push(item);
      group.subtotal += item.price * item.quantity;
    }
  }

  return Object.values(groups);
}

function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      {/* Product Image Placeholder */}
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-2xl opacity-30">📦</span>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2">{item.productName}</h4>
        <p className="text-xs text-muted-foreground">{item.unit}</p>
        <p className="font-semibold text-primary mt-1">{formatPrice(item.price)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 text-muted-foreground hover:text-red-500"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <div className="flex items-center bg-gray-100 rounded-full">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full"
            onClick={() => onQuantityChange(item.id, Math.max(0, item.quantity - 1))}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function VendorCartSection({
  group,
  onQuantityChange,
  onRemove,
}: {
  group: CartVendorGroup;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Card className="p-4 mb-4">
      {/* Vendor Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Store className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{group.vendorName}</h3>
          <p className="text-xs text-muted-foreground">{group.items.length} sản phẩm</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Items */}
      <div className="divide-y divide-border">
        {group.items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Subtotal */}
      <div className="pt-3 mt-3 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Tạm tính</span>
        <span className="font-bold">{formatPrice(group.subtotal)}</span>
      </div>
    </Card>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ShoppingCart className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-bold mb-2">Giỏ hàng trống</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Hãy khám phá các sản phẩm tươi ngon từ chợ gần bạn!
      </p>
      <Link href="/">
        <Button className="rounded-full px-6">Bắt đầu mua sắm</Button>
      </Link>
    </div>
  );
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART_ITEMS);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const handleRemove = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const vendorGroups = groupCartByVendor(cartItems);
  const totalAmount = vendorGroups.reduce((sum, g) => sum + g.subtotal, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Giỏ hàng</h1>
            {cartItems.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {totalItems} sản phẩm từ {vendorGroups.length} chợ
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <ScrollArea className="pb-36">
            <div className="p-4">
              {/* Multi-vendor notice */}
              {vendorGroups.length > 1 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                  <p className="text-xs text-amber-700">
                    <strong>Lưu ý:</strong> Đơn hàng của bạn được chia thành {vendorGroups.length}{" "}
                    phần từ các chợ khác nhau. Phí giao hàng sẽ được tính riêng cho mỗi chợ.
                  </p>
                </div>
              )}

              {/* Vendor Groups */}
              {vendorGroups.map((group) => (
                <VendorCartSection
                  key={group.vendorId}
                  group={group}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Bottom Summary */}
          <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 z-50">
            <div className="max-w-md mx-auto space-y-3">
              {/* Summary */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tổng cộng</span>
                <span className="text-xl font-bold">{formatPrice(totalAmount)}</span>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="block">
                <Button className="w-full h-12 rounded-full text-base font-semibold">
                  Đặt hàng ({totalItems} món)
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
