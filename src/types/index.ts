export interface TenantSettings {
  id?: string;
  name: string;
  domain: string;
  ownerEmail: string;
  status: 'active' | 'inactive' | 'suspended';
  monthlyFee?: number;
  billingStatus?: 'paid' | 'unpaid' | 'overdue';
  lastPaymentDate?: number;
  paymentDueDate?: number;
  createdAt: number;
  phone?: string;
  subscriptionPlan?: string;
  features?: {
    bookingSystem: boolean;
    qrMenu: boolean;
    whatsappOrdering: boolean;
    deliverySystem: boolean;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

export interface PaymentTransaction {
  id: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  date: number;
}

export interface SupportTicket {
  id: string;
  tenantId: string;
  tenantName: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}


export interface DeliveryZone {
  name: string;
  zipCodes: string;
  fee: number;
  minOrderValue: number;
}

export interface RestaurantSettings {
  id?: string;
  restaurantName: string;
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  heroOverlayOpacity?: number;
  contactEmail: string;
  address: string;
  isOpen: boolean;
  whatsappNumber: string;
  mbWayNumber: string;
  uberEatsUrl?: string;
  deliverooUrl?: string;
  glovoUrl?: string;
  boltFoodUrl?: string;
  deliveryFee?: number;
  promoBannerEnabled?: boolean;
  promoBannerText?: string;
  promoBannerLink?: string;
  highlightEnabled?: boolean;
  highlightTag?: string;
  highlightTitle?: string;
  highlightSubtitle?: string;
  highlightDescription?: string;
  highlightButtonText?: string;
  highlightImage?: string;
  storyEnabled?: boolean;
  storyHeadline?: string;
  storyDescription?: string;
  storyImage?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  deliveryZones?: DeliveryZone[];
}

export type MenuCategory = 'Cheesesteaks' | 'Burgers' | 'Sides' | 'Drinks';
export const CATEGORIES: MenuCategory[] = ['Cheesesteaks', 'Burgers', 'Sides', 'Drinks'];

export interface MenuOption {
  name: string;
  price: number;
}

export interface MenuItem {
  id?: string;
  name: string;
  price: number;
  description: string;
  category: MenuCategory;
  imageURL: string;
  isAvailable: boolean;
  createdAt: number;
  options?: MenuOption[];
}

export type OrderType = 'Eat-in' | 'Takeaway' | 'Delivery';

export interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions?: MenuOption[];
  specialInstructions?: string;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';

export interface Order {
  id?: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerDoor?: string;
  customerCity?: string;
  customerZipCode?: string;
  customerNif?: string;
  orderType: OrderType;
  items: CartItem[];
  totalPrice: number;
  deliveryFee: number;
  status: OrderStatus;
  paymentProofUrl?: string;
  createdAt: number;
}
