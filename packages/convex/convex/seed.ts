/**
 * Development Seed Data for Comoi
 *
 * Populates the database with realistic Vietnamese grocery marketplace data.
 * Only intended for development and testing environments.
 *
 * Usage:
 *   # Seed with default counts
 *   bunx convex run seed:seed
 *
 *   # Seed with custom counts
 *   bunx convex run seed:seed '{"categories": 10, "products": 50}'
 *
 *   # Reset and reseed (clears all data first)
 *   bunx convex run seed:seed '{"reset": true}'
 */

import { faker } from "@faker-js/faker/locale/vi";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { internalAction, internalMutation, mutation } from "./_generated/server";

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_COUNTS = {
  categories: 8,
  products: 40,
  vendors: 12,
  customers: 25,
  orders: 50,
} as const;

type SeedSummary = {
  categories: number;
  products: number;
  vendors: number;
  priceOffers: number;
  customers: number;
  orders: number;
};

// ============================================================================
// Vietnamese Data Constants
// ============================================================================

const VIETNAM_CITIES = [
  {
    city: "Hồ Chí Minh",
    districts: [
      "Quận 1",
      "Quận 3",
      "Quận 7",
      "Bình Thạnh",
      "Phú Nhuận",
      "Tân Bình",
      "Gò Vấp",
      "Thủ Đức",
    ],
  },
  {
    city: "Hà Nội",
    districts: [
      "Ba Đình",
      "Hoàn Kiếm",
      "Đống Đa",
      "Cầu Giấy",
      "Hai Bà Trưng",
      "Thanh Xuân",
      "Long Biên",
      "Nam Từ Liêm",
    ],
  },
  {
    city: "Đà Nẵng",
    districts: ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Cẩm Lệ"],
  },
];

const WARDS = [
  "Phường 1",
  "Phường 2",
  "Phường 3",
  "Phường 4",
  "Phường 5",
  "Phường 6",
  "Phường 7",
  "Phường 8",
  "Phường 9",
  "Phường 10",
  "Phường An Phú",
  "Phường Bình An",
  "Phường Thảo Điền",
];

const STREET_NAMES = [
  "Nguyễn Huệ",
  "Lê Lợi",
  "Trần Hưng Đạo",
  "Hai Bà Trưng",
  "Lý Tự Trọng",
  "Nguyễn Trãi",
  "Điện Biên Phủ",
  "Võ Văn Tần",
  "Pasteur",
  "Nam Kỳ Khởi Nghĩa",
  "Lê Văn Sỹ",
  "Nguyễn Đình Chiểu",
  "Cách Mạng Tháng 8",
  "Phan Xích Long",
  "Hoàng Văn Thụ",
  "Nguyễn Văn Trỗi",
  "Phan Đăng Lưu",
  "Xô Viết Nghệ Tĩnh",
];

const VIETNAMESE_FIRST_NAMES = [
  "Anh",
  "Bình",
  "Chi",
  "Dũng",
  "Em",
  "Hải",
  "Hạnh",
  "Hiền",
  "Hoa",
  "Hùng",
  "Hương",
  "Khoa",
  "Lan",
  "Linh",
  "Long",
  "Mai",
  "Minh",
  "Nam",
  "Ngọc",
  "Nhung",
  "Phong",
  "Phương",
  "Quang",
  "Quyên",
  "Sơn",
  "Tâm",
  "Thảo",
  "Thành",
  "Thiên",
  "Thu",
  "Thúy",
  "Tiến",
  "Trang",
  "Trung",
  "Tuấn",
  "Tuyết",
  "Uyên",
  "Văn",
  "Vinh",
  "Yến",
];

const VIETNAMESE_LAST_NAMES = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Huỳnh",
  "Phan",
  "Vũ",
  "Võ",
  "Đặng",
  "Bùi",
  "Đỗ",
  "Hồ",
  "Ngô",
  "Dương",
  "Lý",
  "Đinh",
  "Lương",
  "Trịnh",
  "Mai",
];

const VENDOR_NAMES = [
  "Tạp Hóa",
  "Cửa Hàng Tiện Lợi",
  "Siêu Thị Mini",
  "Bách Hóa",
  "Cửa Hàng Thực Phẩm",
  "Rau Sạch",
  "Đồ Khô",
  "Thực Phẩm Sạch",
  "Hàng Việt",
  "Nông Sản Sạch",
];

const VENDOR_SUFFIXES = [
  "Nhà Bé",
  "Anh Hai",
  "Chị Ba",
  "Cô Tư",
  "Bác Năm",
  "Anh Sáu",
  "Út Hậu",
  "Bà Tám",
  "Cô Chín",
  "Chú Mười",
];

// ============================================================================
// Category & Product Data
// ============================================================================

const CATEGORIES_DATA = [
  {
    name_vi: "Rau củ quả",
    name_en: "Vegetables & Fruits",
    slug: "rau-cu-qua",
    icon: "🥬",
    products: [
      { name_vi: "Rau muống", name_en: "Water spinach", unit: "bó", priceRange: [8000, 15000] },
      { name_vi: "Cải thìa", name_en: "Bok choy", unit: "kg", priceRange: [20000, 35000] },
      { name_vi: "Cà chua", name_en: "Tomatoes", unit: "kg", priceRange: [15000, 30000] },
      { name_vi: "Dưa leo", name_en: "Cucumber", unit: "kg", priceRange: [12000, 25000] },
      { name_vi: "Cà rốt", name_en: "Carrots", unit: "kg", priceRange: [18000, 30000] },
      { name_vi: "Khoai tây", name_en: "Potatoes", unit: "kg", priceRange: [20000, 35000] },
      { name_vi: "Hành tây", name_en: "Onion", unit: "kg", priceRange: [15000, 30000] },
      { name_vi: "Tỏi", name_en: "Garlic", unit: "kg", priceRange: [50000, 80000] },
      { name_vi: "Ớt", name_en: "Chili", unit: "kg", priceRange: [30000, 60000] },
      { name_vi: "Bắp cải", name_en: "Cabbage", unit: "kg", priceRange: [10000, 20000] },
    ],
  },
  {
    name_vi: "Thịt tươi",
    name_en: "Fresh Meat",
    slug: "thit-tuoi",
    icon: "🥩",
    products: [
      {
        name_vi: "Thịt heo ba chỉ",
        name_en: "Pork belly",
        unit: "kg",
        priceRange: [120000, 180000],
      },
      {
        name_vi: "Thịt heo nạc vai",
        name_en: "Pork shoulder",
        unit: "kg",
        priceRange: [100000, 150000],
      },
      { name_vi: "Sườn heo", name_en: "Pork ribs", unit: "kg", priceRange: [130000, 180000] },
      { name_vi: "Thịt bò", name_en: "Beef", unit: "kg", priceRange: [250000, 400000] },
      {
        name_vi: "Thịt gà ta",
        name_en: "Free-range chicken",
        unit: "kg",
        priceRange: [100000, 150000],
      },
      { name_vi: "Đùi gà", name_en: "Chicken thigh", unit: "kg", priceRange: [80000, 120000] },
    ],
  },
  {
    name_vi: "Hải sản",
    name_en: "Seafood",
    slug: "hai-san",
    icon: "🦐",
    products: [
      { name_vi: "Cá basa", name_en: "Basa fish", unit: "kg", priceRange: [50000, 80000] },
      { name_vi: "Tôm sú", name_en: "Tiger shrimp", unit: "kg", priceRange: [200000, 350000] },
      { name_vi: "Mực", name_en: "Squid", unit: "kg", priceRange: [150000, 250000] },
      { name_vi: "Cua", name_en: "Crab", unit: "kg", priceRange: [250000, 400000] },
      { name_vi: "Nghêu", name_en: "Clams", unit: "kg", priceRange: [40000, 70000] },
    ],
  },
  {
    name_vi: "Sữa & Trứng",
    name_en: "Dairy & Eggs",
    slug: "sua-trung",
    icon: "🥛",
    products: [
      {
        name_vi: "Sữa tươi Vinamilk",
        name_en: "Vinamilk fresh milk",
        unit: "hộp",
        priceRange: [30000, 45000],
      },
      {
        name_vi: "Sữa đặc Ông Thọ",
        name_en: "Ong Tho condensed milk",
        unit: "hộp",
        priceRange: [25000, 35000],
      },
      {
        name_vi: "Trứng gà ta",
        name_en: "Free-range eggs",
        unit: "vỉ 10",
        priceRange: [35000, 50000],
      },
      { name_vi: "Trứng vịt", name_en: "Duck eggs", unit: "vỉ 10", priceRange: [40000, 55000] },
      {
        name_vi: "Phô mai con bò cười",
        name_en: "Laughing Cow cheese",
        unit: "hộp",
        priceRange: [35000, 50000],
      },
    ],
  },
  {
    name_vi: "Gạo & Bột",
    name_en: "Rice & Flour",
    slug: "gao-bot",
    icon: "🍚",
    products: [
      { name_vi: "Gạo ST25", name_en: "ST25 rice", unit: "kg", priceRange: [25000, 40000] },
      { name_vi: "Gạo Jasmine", name_en: "Jasmine rice", unit: "kg", priceRange: [18000, 30000] },
      {
        name_vi: "Bột mì đa dụng",
        name_en: "All-purpose flour",
        unit: "kg",
        priceRange: [20000, 35000],
      },
      { name_vi: "Bột gạo", name_en: "Rice flour", unit: "kg", priceRange: [25000, 40000] },
      {
        name_vi: "Bún khô",
        name_en: "Dried rice vermicelli",
        unit: "gói",
        priceRange: [15000, 25000],
      },
      { name_vi: "Phở khô", name_en: "Dried pho noodles", unit: "gói", priceRange: [20000, 35000] },
    ],
  },
  {
    name_vi: "Gia vị",
    name_en: "Seasonings",
    slug: "gia-vi",
    icon: "🧂",
    products: [
      {
        name_vi: "Nước mắm Phú Quốc",
        name_en: "Phu Quoc fish sauce",
        unit: "chai",
        priceRange: [30000, 60000],
      },
      {
        name_vi: "Nước tương Maggi",
        name_en: "Maggi soy sauce",
        unit: "chai",
        priceRange: [15000, 25000],
      },
      {
        name_vi: "Dầu ăn Tường An",
        name_en: "Tuong An cooking oil",
        unit: "lít",
        priceRange: [35000, 50000],
      },
      { name_vi: "Muối iốt", name_en: "Iodized salt", unit: "gói", priceRange: [5000, 10000] },
      { name_vi: "Đường trắng", name_en: "White sugar", unit: "kg", priceRange: [20000, 30000] },
      {
        name_vi: "Bột ngọt Ajinomoto",
        name_en: "Ajinomoto MSG",
        unit: "gói",
        priceRange: [10000, 20000],
      },
      {
        name_vi: "Hạt nêm Knorr",
        name_en: "Knorr seasoning",
        unit: "gói",
        priceRange: [15000, 30000],
      },
    ],
  },
  {
    name_vi: "Đồ uống",
    name_en: "Beverages",
    slug: "do-uong",
    icon: "🥤",
    products: [
      {
        name_vi: "Trà xanh Không Độ",
        name_en: "Zero Degree green tea",
        unit: "chai",
        priceRange: [8000, 12000],
      },
      { name_vi: "Cà phê G7", name_en: "G7 coffee", unit: "hộp", priceRange: [50000, 80000] },
      {
        name_vi: "Nước suối Aquafina",
        name_en: "Aquafina water",
        unit: "thùng",
        priceRange: [70000, 100000],
      },
      { name_vi: "Coca Cola", name_en: "Coca Cola", unit: "lốc 6", priceRange: [50000, 70000] },
      {
        name_vi: "Bia Saigon",
        name_en: "Saigon beer",
        unit: "thùng",
        priceRange: [280000, 350000],
      },
    ],
  },
  {
    name_vi: "Đồ khô & Đóng hộp",
    name_en: "Dry Goods & Canned",
    slug: "do-kho",
    icon: "🥫",
    products: [
      {
        name_vi: "Mì gói Hảo Hảo",
        name_en: "Hao Hao instant noodles",
        unit: "thùng",
        priceRange: [80000, 120000],
      },
      {
        name_vi: "Cá hộp 3 Cô Gái",
        name_en: "Three Ladies canned fish",
        unit: "hộp",
        priceRange: [20000, 35000],
      },
      { name_vi: "Thịt hộp", name_en: "Canned meat", unit: "hộp", priceRange: [30000, 50000] },
      {
        name_vi: "Đậu phộng rang",
        name_en: "Roasted peanuts",
        unit: "gói",
        priceRange: [25000, 40000],
      },
      { name_vi: "Bánh tráng", name_en: "Rice paper", unit: "gói", priceRange: [15000, 25000] },
    ],
  },
] as const;

// ============================================================================
// Helper Functions
// ============================================================================

function generateVietnamesePhone(): string {
  const prefixes = [
    "090",
    "091",
    "093",
    "094",
    "096",
    "097",
    "098",
    "032",
    "033",
    "034",
    "035",
    "036",
    "037",
    "038",
    "039",
  ];
  const prefix = faker.helpers.arrayElement(prefixes);
  const number = faker.string.numeric(7);
  return `${prefix}${number}`;
}

function generateVietnameseName(): string {
  const lastName = faker.helpers.arrayElement(VIETNAMESE_LAST_NAMES);
  const firstName = faker.helpers.arrayElement(VIETNAMESE_FIRST_NAMES);
  const middleName = faker.helpers.maybe(() => faker.helpers.arrayElement(VIETNAMESE_FIRST_NAMES), {
    probability: 0.7,
  });
  return middleName ? `${lastName} ${middleName} ${firstName}` : `${lastName} ${firstName}`;
}

function generateVietnameseAddress() {
  const cityData = faker.helpers.arrayElement(VIETNAM_CITIES);
  const district = faker.helpers.arrayElement(cityData.districts);
  const ward = faker.helpers.arrayElement(WARDS);
  const streetNumber = faker.number.int({ min: 1, max: 500 });
  const street = `${streetNumber} ${faker.helpers.arrayElement(STREET_NAMES)}`;
  const raw = `${street}, ${ward}, ${district}, ${cityData.city}`;

  return {
    address: {
      street,
      ward,
      district,
      city: cityData.city,
      raw,
    },
    location: {
      // Ho Chi Minh City area coordinates with some variation
      lat: 10.762622 + faker.number.float({ min: -0.05, max: 0.05 }),
      lng: 106.660172 + faker.number.float({ min: -0.05, max: 0.05 }),
    },
  };
}

function generateVendorName(): string {
  const baseName = faker.helpers.arrayElement(VENDOR_NAMES);
  const suffix = faker.helpers.arrayElement(VENDOR_SUFFIXES);
  return `${baseName} ${suffix}`;
}

function generateSku(category: string, index: number): string {
  const categoryCode = category.substring(0, 3).toUpperCase();
  return `${categoryCode}-${String(index).padStart(4, "0")}`;
}

function generateBarcode(): string {
  // Vietnamese EAN-13 barcode (893 is Vietnam's GS1 prefix)
  return `893${faker.string.numeric(10)}`;
}

function generatePrice(min: number, max: number): number {
  // Round to nearest 500 VND
  const price = faker.number.int({ min, max });
  return Math.round(price / 500) * 500;
}

// ============================================================================
// Seed Mutations
// ============================================================================

/**
 * Clear all tables (use with caution!)
 */
export const clearAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "order_items",
      "orders",
      "price_offers",
      "customers",
      "products",
      "vendors",
      "categories",
    ] as const;

    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }

    return { message: "All tables cleared" };
  },
});

/**
 * Seed categories
 */
export const seedCategories = internalMutation({
  args: { count: v.optional(v.number()) },
  handler: async (ctx, { count }) => {
    const categoriesToCreate = CATEGORIES_DATA.slice(0, count ?? CATEGORIES_DATA.length);
    const categoryIds: Id<"categories">[] = [];

    for (let i = 0; i < categoriesToCreate.length; i++) {
      const cat = categoriesToCreate[i];
      if (!cat) continue;
      const id = await ctx.db.insert("categories", {
        name_vi: cat.name_vi,
        name_en: cat.name_en,
        slug: cat.slug,
        icon: cat.icon,
        order: i,
      });
      categoryIds.push(id);
    }

    return categoryIds;
  },
});

/**
 * Seed products
 */
export const seedProducts = internalMutation({
  args: {
    categoryIds: v.array(v.id("categories")),
    count: v.optional(v.number()),
  },
  handler: async (ctx, { categoryIds, count }) => {
    const productIds: Id<"products">[] = [];
    const now = Date.now();
    let productIndex = 0;

    // Get categories to match products
    const categories: (Doc<"categories"> | null)[] = await Promise.all(
      categoryIds.map((id) => ctx.db.get(id))
    );

    for (const category of categories) {
      if (!category) continue;

      const categoryData = CATEGORIES_DATA.find((c) => c.slug === category.slug);
      if (!categoryData) continue;

      for (const product of categoryData.products) {
        if (count && productIds.length >= count) break;

        const id = await ctx.db.insert("products", {
          sku: generateSku(categoryData.slug, productIndex++),
          name_vi: product.name_vi,
          name_en: product.name_en,
          category_id: category._id,
          unit: product.unit,
          barcode: generateBarcode(),
          created_at: now,
          updated_at: now,
        });
        productIds.push(id);
      }

      if (count && productIds.length >= count) break;
    }

    return productIds;
  },
});

/**
 * Seed vendors
 */
export const seedVendors = internalMutation({
  args: { count: v.optional(v.number()) },
  handler: async (ctx, { count }) => {
    const vendorCount = count ?? DEFAULT_COUNTS.vendors;
    const vendorIds: Id<"vendors">[] = [];
    const now = Date.now();

    for (let i = 0; i < vendorCount; i++) {
      const { address, location } = generateVietnameseAddress();

      const id = await ctx.db.insert("vendors", {
        name: generateVendorName(),
        phone: generateVietnamesePhone(),
        zalo_id: faker.helpers.maybe(() => faker.string.alphanumeric(10), { probability: 0.6 }),
        location,
        address,
        delivery_radius_km: faker.helpers.arrayElement([1, 2, 3, 5]),
        is_active: faker.helpers.maybe(() => true, { probability: 0.9 }) ?? false,
        created_at: now,
        updated_at: now,
      });
      vendorIds.push(id);
    }

    return vendorIds;
  },
});

/**
 * Seed price offers (vendor-product pricing)
 */
export const seedPriceOffers = internalMutation({
  args: {
    vendorIds: v.array(v.id("vendors")),
    productIds: v.array(v.id("products")),
  },
  handler: async (ctx, { vendorIds, productIds }) => {
    const priceOfferIds: Id<"price_offers">[] = [];
    const now = Date.now();

    // Get product data for pricing
    const products = await Promise.all(productIds.map((id) => ctx.db.get(id)));

    for (const vendorId of vendorIds) {
      // Each vendor carries 60-90% of products
      const vendorProductCount = Math.floor(
        productIds.length * faker.number.float({ min: 0.6, max: 0.9 })
      );
      const vendorProducts = faker.helpers.arrayElements(productIds, vendorProductCount);

      for (const productId of vendorProducts) {
        const product = products.find((p) => p?._id === productId);
        if (!product) continue;

        // Find price range from category data
        const categoryData = CATEGORIES_DATA.find((c) =>
          c.products.some((p) => p.name_vi === product.name_vi)
        );
        const productData = categoryData?.products.find((p) => p.name_vi === product.name_vi);
        const priceRange = productData?.priceRange ?? ([10000, 50000] as const);

        const id = await ctx.db.insert("price_offers", {
          vendor_id: vendorId,
          product_id: productId,
          price: generatePrice(priceRange[0], priceRange[1]),
          stock_status: faker.helpers.weightedArrayElement([
            { weight: 70, value: "IN_STOCK" as const },
            { weight: 20, value: "LOW_STOCK" as const },
            { weight: 10, value: "OUT_OF_STOCK" as const },
          ]),
          is_available: faker.helpers.maybe(() => true, { probability: 0.85 }) ?? false,
          updated_at: now,
        });
        priceOfferIds.push(id);
      }
    }

    return priceOfferIds;
  },
});

/**
 * Seed customers
 */
export const seedCustomers = internalMutation({
  args: { count: v.optional(v.number()) },
  handler: async (ctx, { count }) => {
    const customerCount = count ?? DEFAULT_COUNTS.customers;
    const customerIds: Id<"customers">[] = [];
    const now = Date.now();

    for (let i = 0; i < customerCount; i++) {
      const { address, location } = generateVietnameseAddress();
      const hasSecondAddress = faker.datatype.boolean();

      const addresses = [
        {
          id: faker.string.uuid(),
          label: "Nhà",
          location,
          address,
          is_default: true,
        },
      ];

      if (hasSecondAddress) {
        const { address: address2, location: location2 } = generateVietnameseAddress();
        addresses.push({
          id: faker.string.uuid(),
          label: "Văn phòng",
          location: location2,
          address: address2,
          is_default: false,
        });
      }

      const id = await ctx.db.insert("customers", {
        phone: generateVietnamesePhone(),
        name: generateVietnameseName(),
        email: faker.helpers.maybe(() => faker.internet.email().toLowerCase(), {
          probability: 0.7,
        }),
        addresses,
        preferred_language: faker.helpers.weightedArrayElement([
          { weight: 90, value: "vi" as const },
          { weight: 10, value: "en" as const },
        ]),
        created_at: now,
      });
      customerIds.push(id);
    }

    return customerIds;
  },
});

/**
 * Seed orders and order items
 */
export const seedOrders = internalMutation({
  args: {
    customerIds: v.array(v.id("customers")),
    vendorIds: v.array(v.id("vendors")),
    productIds: v.array(v.id("products")),
    count: v.optional(v.number()),
  },
  handler: async (ctx, { customerIds, vendorIds, productIds: _productIds, count }) => {
    const orderCount = count ?? DEFAULT_COUNTS.orders;
    const orderIds: Id<"orders">[] = [];
    const now = Date.now();

    // Get price offers for products
    const priceOffers = await ctx.db.query("price_offers").collect();

    for (let i = 0; i < orderCount; i++) {
      const customerId = faker.helpers.arrayElement(customerIds);
      const vendorId = faker.helpers.arrayElement(vendorIds);

      // Get customer's address
      const customer = await ctx.db.get(customerId);
      if (!customer || customer.addresses.length === 0) continue;

      const defaultAddress = customer.addresses.find((a) => a.is_default) ?? customer.addresses[0];
      if (!defaultAddress) continue;

      // Get vendor's price offers
      const vendorOffers = priceOffers.filter((po) => po.vendor_id === vendorId && po.is_available);
      if (vendorOffers.length === 0) continue;

      // Create 1-5 order items
      const itemCount = faker.number.int({ min: 1, max: 5 });
      const selectedOffers = faker.helpers.arrayElements(
        vendorOffers,
        Math.min(itemCount, vendorOffers.length)
      );

      let subtotal = 0;
      const items: Array<{
        product_id: Id<"products">;
        vendor_id: Id<"vendors">;
        quantity: number;
        unit_price: number;
        total_price: number;
      }> = [];

      for (const offer of selectedOffers) {
        const quantity = faker.number.int({ min: 1, max: 3 });
        const totalPrice = offer.price * quantity;
        subtotal += totalPrice;

        items.push({
          product_id: offer.product_id,
          vendor_id: vendorId,
          quantity,
          unit_price: offer.price,
          total_price: totalPrice,
        });
      }

      const deliveryFee = faker.helpers.arrayElement([0, 15000, 20000, 25000, 30000]);
      const total = subtotal + deliveryFee;

      // Randomize order timing
      const createdAt = now - faker.number.int({ min: 0, max: 30 * 24 * 60 * 60 * 1000 }); // Up to 30 days ago

      const orderId = await ctx.db.insert("orders", {
        customer_id: customerId,
        vendor_id: vendorId,
        status: faker.helpers.weightedArrayElement([
          { weight: 5, value: "PENDING" as const },
          { weight: 5, value: "CONFIRMED" as const },
          { weight: 5, value: "PREPARING" as const },
          { weight: 5, value: "READY" as const },
          { weight: 5, value: "DELIVERING" as const },
          { weight: 60, value: "COMPLETED" as const },
          { weight: 15, value: "CANCELLED" as const },
        ]),
        payment_method: faker.helpers.weightedArrayElement([
          { weight: 50, value: "COD" as const },
          { weight: 25, value: "MOMO" as const },
          { weight: 15, value: "VNPAY" as const },
          { weight: 10, value: "PAYOS" as const },
        ]),
        payment_status: faker.helpers.weightedArrayElement([
          { weight: 10, value: "PENDING" as const },
          { weight: 5, value: "PROCESSING" as const },
          { weight: 75, value: "COMPLETED" as const },
          { weight: 5, value: "FAILED" as const },
          { weight: 5, value: "REFUNDED" as const },
        ]),
        payment_reference: faker.helpers.maybe(() => faker.string.alphanumeric(16).toUpperCase(), {
          probability: 0.6,
        }),
        subtotal,
        delivery_fee: deliveryFee,
        total,
        delivery_address: {
          location: defaultAddress.location,
          address: defaultAddress.address,
        },
        notes: faker.helpers.maybe(
          () =>
            faker.helpers.arrayElement([
              "Gọi trước khi giao",
              "Để trước cửa",
              "Giao giờ trưa",
              "Không cần túi nhựa",
            ]),
          { probability: 0.3 }
        ),
        created_at: createdAt,
        updated_at: createdAt,
      });

      orderIds.push(orderId);

      // Create order items
      for (const item of items) {
        await ctx.db.insert("order_items", {
          order_id: orderId,
          ...item,
        });
      }
    }

    return orderIds;
  },
});

/**
 * Main seed action - orchestrates all seeding
 */
export const seed: ReturnType<typeof internalAction> = internalAction({
  args: {
    categories: v.optional(v.number()),
    products: v.optional(v.number()),
    vendors: v.optional(v.number()),
    customers: v.optional(v.number()),
    orders: v.optional(v.number()),
    reset: v.optional(v.boolean()),
  },
  handler: async (ctx, config): Promise<SeedSummary> => {
    console.log("🌱 Starting seed process...");

    // Clear tables if reset flag is set
    if (config.reset) {
      console.log("🗑️ Clearing all tables...");
      await ctx.runMutation(internal.seed.clearAll, {});
    }

    // Seed categories
    console.log("📁 Seeding categories...");
    const categoryIds: Id<"categories">[] = await ctx.runMutation(internal.seed.seedCategories, {
      count: config.categories,
    });
    console.log(`✅ Created ${categoryIds.length} categories`);

    // Seed products
    console.log("📦 Seeding products...");
    const productIds: Id<"products">[] = await ctx.runMutation(internal.seed.seedProducts, {
      categoryIds,
      count: config.products,
    });
    console.log(`✅ Created ${productIds.length} products`);

    // Seed vendors
    console.log("🏪 Seeding vendors...");
    const vendorIds: Id<"vendors">[] = await ctx.runMutation(internal.seed.seedVendors, {
      count: config.vendors,
    });
    console.log(`✅ Created ${vendorIds.length} vendors`);

    // Seed price offers
    console.log("💰 Seeding price offers...");
    const priceOfferIds: Id<"price_offers">[] = await ctx.runMutation(
      internal.seed.seedPriceOffers,
      {
        vendorIds,
        productIds,
      }
    );
    console.log(`✅ Created ${priceOfferIds.length} price offers`);

    // Seed customers
    console.log("👥 Seeding customers...");
    const customerIds: Id<"customers">[] = await ctx.runMutation(internal.seed.seedCustomers, {
      count: config.customers,
    });
    console.log(`✅ Created ${customerIds.length} customers`);

    // Seed orders
    console.log("🛒 Seeding orders...");
    const orderIds: Id<"orders">[] = await ctx.runMutation(internal.seed.seedOrders, {
      customerIds,
      vendorIds,
      productIds,
      count: config.orders,
    });
    console.log(`✅ Created ${orderIds.length} orders`);

    const summary: SeedSummary = {
      categories: categoryIds.length,
      products: productIds.length,
      vendors: vendorIds.length,
      priceOffers: priceOfferIds.length,
      customers: customerIds.length,
      orders: orderIds.length,
    };

    console.log("🎉 Seed complete!", summary);
    return summary;
  },
});

/**
 * Public seed mutation (for development only)
 * Wraps the internal action for CLI access
 */
export const runSeed = mutation({
  args: {
    categories: v.optional(v.number()),
    products: v.optional(v.number()),
    vendors: v.optional(v.number()),
    customers: v.optional(v.number()),
    orders: v.optional(v.number()),
    reset: v.optional(v.boolean()),
  },
  handler: async (ctx, config) => {
    // In a real app, you'd check for admin role here
    // For now, we trust this is only used in development

    // We need to use scheduler to run the action
    await ctx.scheduler.runAfter(0, internal.seed.seed, config);

    return {
      message: "Seed started! Check the Convex dashboard logs for progress.",
      config,
    };
  },
});
