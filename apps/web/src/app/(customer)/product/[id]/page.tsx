"use client";

import type { Id } from "@comoi/convex";
import { api } from "@comoi/convex";
import { useQuery } from "convex/react";
import { ArrowLeft, MapPin, Minus, Plus, ShoppingCart, Store } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { formatDistance, formatPrice } from "@/lib/utils";

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-4 space-y-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

interface VendorOffer {
  vendorId: Id<"vendors">;
  vendorName: string;
  price: number;
  originalPrice?: number;
  stock: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  district: string;
  distance?: number;
}

function VendorOfferCard({
  offer,
  isSelected,
  onSelect,
}: {
  offer: VendorOffer;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const discount = offer.originalPrice
    ? Math.round((1 - offer.price / offer.originalPrice) * 100)
    : 0;

  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        isSelected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Store className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">{offer.vendorName}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {offer.district}
              {offer.distance && ` • ${formatDistance(offer.distance)}`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-primary">{formatPrice(offer.price)}</p>
          {offer.originalPrice && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(offer.originalPrice)}
              </span>
              <Badge variant="destructive" className="text-[10px] px-1">
                -{discount}%
              </Badge>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Badge
          variant={
            offer.stock === "IN_STOCK"
              ? "success"
              : offer.stock === "LOW_STOCK"
                ? "warning"
                : "destructive"
          }
        >
          {offer.stock === "IN_STOCK"
            ? "Còn hàng"
            : offer.stock === "LOW_STOCK"
              ? "Sắp hết"
              : "Hết hàng"}
        </Badge>
        {isSelected && <span className="text-xs text-primary font-semibold">✓ Đã chọn</span>}
      </div>
    </Card>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as Id<"products">;

  const productWithPrices = useQuery(api.products.getWithPrices, {
    productId,
  });

  const [selectedVendorId, setSelectedVendorId] = useState<Id<"vendors"> | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!productWithPrices) {
    return <ProductDetailSkeleton />;
  }

  const { product, offers } = productWithPrices;

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const selectedOffer =
    offers.find((o: VendorOffer) => o.vendorId === selectedVendorId) || offers[0];
  const totalPrice = selectedOffer ? selectedOffer.price * quantity : 0;

  // Sort offers by price
  const sortedOffers = [...offers].sort((a: VendorOffer, b: VendorOffer) => a.price - b.price);
  const lowestPrice = sortedOffers[0]?.price;
  const highestPrice = sortedOffers[sortedOffers.length - 1]?.price;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-bold">Chi tiết sản phẩm</h1>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                0
              </span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Product Image */}
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
        <span className="text-8xl opacity-30">📦</span>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-xl font-bold">{product.name_vi}</h2>
          <p className="text-muted-foreground text-sm mt-1">{product.unit}</p>
        </div>

        {/* Price Range */}
        {offers.length > 1 && lowestPrice && highestPrice && (
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">So sánh giá từ {offers.length} chợ</span>
              <Badge variant="success" className="font-mono">
                {formatPrice(lowestPrice)} - {formatPrice(highestPrice)}
              </Badge>
            </div>
          </div>
        )}

        {/* Description */}
        {product.description_vi && (
          <div>
            <h3 className="font-semibold mb-2">Mô tả</h3>
            <p className="text-sm text-muted-foreground">{product.description_vi}</p>
          </div>
        )}

        {/* Vendor Offers */}
        <div>
          <Tabs defaultValue="price" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="price" className="flex-1">
                Giá thấp nhất
              </TabsTrigger>
              <TabsTrigger value="distance" className="flex-1">
                Gần nhất
              </TabsTrigger>
            </TabsList>
            <TabsContent value="price" className="space-y-3 mt-4">
              {sortedOffers.map((offer: VendorOffer, index: number) => (
                <VendorOfferCard
                  key={offer.vendorId}
                  offer={offer}
                  isSelected={
                    selectedVendorId === offer.vendorId || (!selectedVendorId && index === 0)
                  }
                  onSelect={() => setSelectedVendorId(offer.vendorId)}
                />
              ))}
            </TabsContent>
            <TabsContent value="distance" className="space-y-3 mt-4">
              {offers.map((offer: VendorOffer, index: number) => (
                <VendorOfferCard
                  key={offer.vendorId}
                  offer={offer}
                  isSelected={
                    selectedVendorId === offer.vendorId || (!selectedVendorId && index === 0)
                  }
                  onSelect={() => setSelectedVendorId(offer.vendorId)}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 z-50">
        <div className="max-w-md mx-auto flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center bg-gray-100 rounded-full">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button className="flex-1 h-12 gap-2 rounded-full" disabled={!selectedOffer}>
            <ShoppingCart className="w-5 h-5" />
            <span className="font-semibold">Thêm • {formatPrice(totalPrice)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
