export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ShadeVariant {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  subtitle: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  salePrice?: number;
  image: string;
  additionalImages?: string[];
  shades: ShadeVariant[];
  stock: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  authorName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item id (productId + shade)
  productId: string;
  productName: string;
  price: number;
  image: string;
  shade?: string;
  quantity: number;
  stock: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Payment Confirmed'
  | 'Order Placed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Canceled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  fulfillmentStatus: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery: string;
  createdAt: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  change: number;
  previousStock: number;
  newStock: number;
  reason: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  savedAddress?: ShippingAddress;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  label?: string;
  description: string;
  ctaText: string;
  ctaTarget: 'shop' | 'skincare' | 'makeup' | 'offers';
  categorySlug?: string;
  image: string;
  badge?: string;
  discountBadge?: string;
  accentColor: string;
  secondaryColor?: string;
  bgGradient: string;
  active: boolean;
}
