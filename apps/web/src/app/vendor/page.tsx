"use client";

import type { Id } from "@comoi/convex";
import {
  Bell,
  CheckCircle,
  ChevronRight,
  Clock,
  Loader2,
  Package,
  Settings,
  Store,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { cn, formatPrice } from "@/lib/utils";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "picked_up"
  | "delivered"
  | "cancelled";

interface Order {
  _id: Id<"orders">;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  created_at: number;
  customer?: {
    name: string;
    phone?: string;
  };
  items: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
  }>;
  delivery_type: "pickup" | "delivery";
  estimated_ready_time?: number;
}

// Status configuration
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: "Đơn mới",
    color: "bg-amber-500",
    icon: <Bell className="w-4 h-4" />,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-500",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  preparing: {
    label: "Đang chuẩn bị",
    color: "bg-purple-500",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
  },
  ready: {
    label: "Sẵn sàng",
    color: "bg-green-500",
    icon: <Package className="w-4 h-4" />,
  },
  picked_up: {
    label: "Đã lấy hàng",
    color: "bg-gray-500",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  delivered: {
    label: "Đã giao",
    color: "bg-green-700",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-500",
    icon: <XCircle className="w-4 h-4" />,
  },
};

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];
  if (!config) {
    return <Badge>Unknown</Badge>;
  }
  return (
    <Badge className={cn("gap-1", config.color)}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return new Date(timestamp).toLocaleDateString("vi-VN");
}

function OrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order;
  onUpdateStatus: (orderId: Id<"orders">, newStatus: OrderStatus) => void;
}) {
  const nextStatus: Record<string, OrderStatus | null> = {
    pending: "confirmed",
    confirmed: "preparing",
    preparing: "ready",
    ready: "picked_up",
    picked_up: null,
    delivered: null,
    cancelled: null,
  };

  const actionLabel: Record<string, string> = {
    pending: "Xác nhận đơn",
    confirmed: "Bắt đầu chuẩn bị",
    preparing: "Sẵn sàng giao",
    ready: "Đã lấy hàng",
  };

  const next = nextStatus[order.status];

  return (
    <Card className="p-4 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">#{order.order_number}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(order.created_at)}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {order.delivery_type === "pickup" ? "Tự đến lấy" : "Giao hàng"}
        </Badge>
      </div>

      {/* Customer */}
      {order.customer && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm">{order.customer.name}</span>
            {order.customer.phone && (
              <span className="text-xs text-muted-foreground">• {order.customer.phone}</span>
            )}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item) => (
          <div
            key={`${order._id}-${item.product_name}`}
            className="flex items-center justify-between text-sm"
          >
            <span>
              {item.quantity}x {item.product_name}
            </span>
            <span className="text-muted-foreground">
              {formatPrice(item.unit_price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <Separator className="my-3" />

      {/* Total & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Tổng cộng</p>
          <p className="font-bold text-lg text-primary">{formatPrice(order.total_amount)}</p>
        </div>

        <div className="flex gap-2">
          {order.status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => onUpdateStatus(order._id, "cancelled")}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Từ chối
            </Button>
          )}
          {next && (
            <Button size="sm" onClick={() => onUpdateStatus(order._id, next)}>
              {actionLabel[order.status]}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function OrderCountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
      {count}
    </span>
  );
}

function DashboardStats() {
  const stats = {
    todayOrders: 12,
    todayRevenue: 2450000,
    pendingOrders: 3,
    avgPrepTime: "15 phút",
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Đơn hôm nay</p>
        <p className="text-2xl font-bold">{stats.todayOrders}</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Doanh thu</p>
        <p className="text-2xl font-bold text-primary">{formatPrice(stats.todayRevenue)}</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Chờ xử lý</p>
        <p className="text-2xl font-bold text-amber-500">{stats.pendingOrders}</p>
      </Card>
      <Card className="p-4">
        <p className="text-xs text-muted-foreground">Thời gian TB</p>
        <p className="text-2xl font-bold">{stats.avgPrepTime}</p>
      </Card>
    </div>
  );
}

// Mock orders data
const MOCK_ORDERS: Order[] = [
  {
    _id: "order1" as Id<"orders">,
    order_number: "1001",
    status: "pending",
    total_amount: 235000,
    created_at: Date.now() - 5 * 60000,
    customer: { name: "Nguyễn Văn A", phone: "0901234567" },
    items: [
      { product_name: "Rau muống tươi", quantity: 2, unit_price: 15000 },
      { product_name: "Thịt ba chỉ", quantity: 1, unit_price: 180000 },
      { product_name: "Hành lá", quantity: 1, unit_price: 25000 },
    ],
    delivery_type: "pickup",
  },
  {
    _id: "order2" as Id<"orders">,
    order_number: "1002",
    status: "preparing",
    total_amount: 450000,
    created_at: Date.now() - 20 * 60000,
    customer: { name: "Trần Thị B", phone: "0912345678" },
    items: [
      { product_name: "Tôm sú", quantity: 1, unit_price: 320000 },
      { product_name: "Nghệu tươi", quantity: 2, unit_price: 65000 },
    ],
    delivery_type: "delivery",
  },
  {
    _id: "order3" as Id<"orders">,
    order_number: "1003",
    status: "ready",
    total_amount: 125000,
    created_at: Date.now() - 45 * 60000,
    customer: { name: "Lê Văn C" },
    items: [
      { product_name: "Cà chua bi", quantity: 2, unit_price: 45000 },
      { product_name: "Dưa leo", quantity: 1, unit_price: 35000 },
    ],
    delivery_type: "pickup",
  },
];

function EmptyOrdersState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Package className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

function VendorDashboard() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState("pending");

  const handleUpdateStatus = (orderId: Id<"orders">, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
    );
  };

  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case "pending":
        return order.status === "pending" || order.status === "confirmed";
      case "preparing":
        return order.status === "preparing";
      case "ready":
        return order.status === "ready";
      case "completed":
        return (
          order.status === "picked_up" ||
          order.status === "delivered" ||
          order.status === "cancelled"
        );
      default:
        return true;
    }
  });

  const counts = {
    pending: orders.filter((o) => o.status === "pending" || o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    completed: orders.filter(
      (o) => o.status === "picked_up" || o.status === "delivered" || o.status === "cancelled"
    ).length,
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold">Chợ Bến Thành</h1>
              <p className="text-xs opacity-80">Quản lý đơn hàng</p>
            </div>
          </div>
          <Link href="/vendor/settings">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="p-4">
        <DashboardStats />
      </div>

      {/* Orders Section */}
      <div className="p-4">
        <h2 className="font-bold text-lg mb-4">Đơn hàng</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="pending" className="text-xs px-1">
              Mới
              <OrderCountBadge count={counts.pending} />
            </TabsTrigger>
            <TabsTrigger value="preparing" className="text-xs px-1">
              Đang làm
              <OrderCountBadge count={counts.preparing} />
            </TabsTrigger>
            <TabsTrigger value="ready" className="text-xs px-1">
              Sẵn sàng
              <OrderCountBadge count={counts.ready} />
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs px-1">
              Xong
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-0">
            {filteredOrders.length === 0 ? (
              <EmptyOrdersState message="Không có đơn hàng mới" />
            ) : (
              filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} onUpdateStatus={handleUpdateStatus} />
              ))
            )}
          </TabsContent>

          <TabsContent value="preparing" className="mt-0">
            {filteredOrders.length === 0 ? (
              <EmptyOrdersState message="Không có đơn đang chuẩn bị" />
            ) : (
              filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} onUpdateStatus={handleUpdateStatus} />
              ))
            )}
          </TabsContent>

          <TabsContent value="ready" className="mt-0">
            {filteredOrders.length === 0 ? (
              <EmptyOrdersState message="Không có đơn sẵn sàng" />
            ) : (
              filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} onUpdateStatus={handleUpdateStatus} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            {filteredOrders.length === 0 ? (
              <EmptyOrdersState message="Chưa có đơn hoàn thành" />
            ) : (
              filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} onUpdateStatus={handleUpdateStatus} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-4 py-2 z-50">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link href="/vendor" className="flex flex-col items-center gap-1 py-2 px-4 text-primary">
            <Package className="w-5 h-5" />
            <span className="text-xs font-medium">Đơn hàng</span>
          </Link>
          <Link
            href="/vendor/products"
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-primary"
          >
            <Store className="w-5 h-5" />
            <span className="text-xs font-medium">Sản phẩm</span>
          </Link>
          <Link
            href="/vendor/stats"
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-primary"
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Thống kê</span>
          </Link>
          <Link
            href="/vendor/settings"
            className="flex flex-col items-center gap-1 py-2 px-4 text-muted-foreground hover:text-primary"
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">Cài đặt</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default function VendorPage() {
  return <VendorDashboard />;
}
