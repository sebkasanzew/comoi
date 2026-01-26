"use client";

import type { Doc } from "@comoi/convex";
import { api } from "@comoi/convex";
import { useQuery } from "convex/react";
import { ChevronDown, ChevronRight, MapPin, Search, ShoppingCart, Store } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card, Input, Skeleton } from "@/components/ui";
import { formatDistance } from "@/lib/utils";

// Category icons mapping
const CATEGORY_ICONS: Record<string, string> = {
  "rau-cu-qua": "🥬",
  "thit-tuoi": "🥩",
  "hai-san": "🦐",
  "sua-trung": "🥛",
  "gao-bot": "🍚",
  "gia-vi": "🧂",
  "do-uong": "🥤",
  "do-kho": "🥫",
};

function CategoryGrid() {
  const categories = useQuery(api.categories.list);

  if (!categories) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((key) => (
          <div key={`skeleton-cat-${key}`} className="flex flex-col items-center gap-2">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-y-6 gap-x-2">
      {categories.slice(0, 8).map((category: Doc<"categories">) => (
        <Link
          key={category._id}
          href={`/category/${category.slug}`}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary/20 transition-colors">
            {category.icon || CATEGORY_ICONS[category.slug] || "📦"}
          </div>
          <p className="text-xs font-medium text-center leading-tight">{category.name_vi}</p>
        </Link>
      ))}
    </div>
  );
}

function VendorCarousel() {
  const vendors = useQuery(api.vendors.list, { limit: 6 });

  if (!vendors) {
    return (
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {[1, 2, 3].map((key) => (
          <div key={`skeleton-vendor-${key}`} className="min-w-[200px] w-[200px]">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <Skeleton className="h-4 w-32 mt-2" />
            <Skeleton className="h-3 w-24 mt-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 pl-4 -ml-4">
      {vendors.map((vendor: Doc<"vendors">) => (
        <Link
          key={vendor._id}
          href={`/vendor/${vendor._id}`}
          className="flex flex-col gap-3 min-w-[200px] w-[200px] group"
        >
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center bg-green-50">
              <Store className="w-12 h-12 text-primary/40" />
            </div>
            <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold">
              {formatDistance(vendor.delivery_radius_km)}
            </div>
            {vendor.is_active && (
              <Badge className="absolute top-2 right-2" variant="success">
                Mở cửa
              </Badge>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">
              {vendor.name}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {vendor.address.district}, {vendor.address.city}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ProductGrid() {
  const products = useQuery(api.products.list, { limit: 12 });

  if (!products) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((key) => (
          <Card key={`skeleton-product-${key}`} className="overflow-hidden">
            <Skeleton className="w-full aspect-square" />
            <div className="p-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-20 mt-2" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product: Doc<"products">) => (
        <Link key={product._id} href={`/product/${product._id}`}>
          <Card className="overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
              <span className="text-4xl opacity-30">📦</span>
            </div>
            <div className="p-3">
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {product.name_vi}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">{product.unit}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function CustomerHomePage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-2 cursor-pointer group">
            <MapPin className="w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">Giao đến</span>
              <h2 className="text-sm font-bold leading-tight flex items-center gap-1 group-hover:text-primary transition-colors">
                Quận 1, TP.HCM
                <ChevronDown className="w-4 h-4" />
              </h2>
            </div>
          </div>
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative rounded-full">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                0
              </span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input className="pl-10 h-12 rounded-xl" placeholder="Tìm gạo, thịt, rau, đồ dùng..." />
        </div>
      </div>

      {/* Categories */}
      <section className="px-4 pb-6">
        <CategoryGrid />
      </section>

      {/* Nearby Vendors */}
      <section className="pb-6">
        <div className="flex items-center justify-between px-4 pb-3">
          <h3 className="text-lg font-bold">Chợ gần bạn</h3>
          <Link
            href="/vendors"
            className="text-sm font-medium text-primary hover:text-primary-dark flex items-center"
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <VendorCarousel />
      </section>

      {/* Popular Products */}
      <section className="px-4 pb-6">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-lg font-bold">Sản phẩm phổ biến</h3>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:text-primary-dark flex items-center"
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid />
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-4 py-2 z-50">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center gap-1 py-2 px-4 text-primary">
            <Store className="w-5 h-5" />
            <span className="text-xs font-medium">Trang chủ</span>
          </Link>
          <Link
            href="/search"
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-primary"
          >
            <Search className="w-5 h-5" />
            <span className="text-xs font-medium">Tìm kiếm</span>
          </Link>
          <Link
            href="/cart"
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-primary relative"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs font-medium">Giỏ hàng</span>
          </Link>
          <Link
            href="/orders"
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-primary"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-xs font-medium">Đơn hàng</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
