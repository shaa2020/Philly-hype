export interface DeliveryZone {
  name: string;
  zipCodes: string;
  fee: number;
  minOrderValue: number;
}

export interface RestaurantSettings {
  id?: string;
  restaurantName: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  address: string;
  isOpen: boolean;
  whatsappNumber: string;
  mbWayNumber: string;
  uberEatsUrl?: string;
  deliverooUrl?: string;
  deliveryFee?: number;
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
  customerZipCode?: string;
  orderType: OrderType;
  items: CartItem[];
  totalPrice: number;
  deliveryFee: number;
  status: OrderStatus;
  createdAt: number;
}
