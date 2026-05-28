export enum AppRoleEnum {
  SUPER_USER = 'SUPER_USER',
  OWNER = 'OWNER',
  USER = 'USER',
}

export enum RestaurantTableStatusEnum {
  FREE = 'FREE',
  OCCUPIED = 'OCCUPIED',
}

export enum RestaurantOrderStatusEnum {
  PENDING = 'PENDING',
  IN_PROCESS = 'IN_PROCESS',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export type AppUser = {
  id: string;
  email: string;
  global_role: AppRoleEnum;
};

export type Product = {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  active: boolean;
};

export type Category = {
  id: number;
  menu_id: number;
  name: string;
  active: boolean;
  products?: Product[];
};

export type Menu = {
  id: number;
  restaurant_id: number;
  name: string | null;
  categories?: Category[];
};

export type RestaurantTable = {
  id: number;
  restaurant_id: number;
  code: string;
  area: string | null;
  capacity: number;
  status: RestaurantTableStatusEnum;
};

export type Restaurant = {
  id: number;
  name: string;
  owner_id: string;
  description: string | null;
  address: string | null;
  tables?: RestaurantTable[];
  menu?: Menu;
};

export type CreateRestaurantPayload = {
  name: string;
  description?: string;
  address?: string;
};

export type RestaurantStaff = {
  id: number;
  user_id: string;
  restaurant_id: number;
  role: AppRoleEnum;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  product_description: string | null;
  product_image: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: number;
  restaurant_id: number;
  restaurant?: Restaurant;
  table_id: number;
  user_id: string | null;
  number: number;
  status: RestaurantOrderStatusEnum;
  total: number;
  created_at: string;
  items?: OrderItem[];
  note: string | null;
};
