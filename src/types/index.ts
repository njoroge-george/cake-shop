export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CakeSize {
  name: string;
  price: number;
  serves: number;
}

export interface CakeLayer {
  name: string;
  price: number;
}

export interface Cake {
  id: string;
  name: string;
  description: string;
  slug: string;
  images: string[];
  basePrice: number;
  categoryId: string;
  category?: Category;
  sizes: CakeSize[];
  flavors: string[];
  layers: CakeLayer[];
  featured: boolean;
  inStock: boolean;
  stock?: number;
  tags: string[];
  reviews?: Review[];
  // Computed/expanded fields returned by API
  averageRating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  user?: User;
  cakeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  userId: string;
  cakeId: string;
  cake?: Cake;
  quantity: number;
  selectedSize: string;
  selectedFlavor: string;
  selectedLayers: string;
  customMessage?: string;
  specialRequests?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  county: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  cakeId: string;
  cake?: Cake;
  quantity: number;
  selectedSize: string;
  selectedFlavor: string;
  selectedLayers: string;
  customMessage?: string;
  specialRequests?: string;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  addressId: string;
  address?: Address;
  deliveryDate: Date;
  deliveryTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'MPESA' | 'CARD' | 'CASH';
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  promoCode?: string;
  notes?: string;
  mpesaReference?: string;
  paybillNumber?: string;
  paybillAccount?: string;
  paymentReference?: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discount: number;
  type: 'PERCENTAGE' | 'FIXED';
  minOrder?: number;
  maxDiscount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  season?: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  lowStock: number;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export interface TopCake {
  cakeId: string;
  name: string;
  totalSold: number;
  revenue: number;
}
