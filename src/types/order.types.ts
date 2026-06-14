export type OrderStatus = 'PENDING' | 'IN_PROCESS' | 'DELIVERED' | 'CANCELLED';

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
  table_id: number;
  user_id: string;
  number: number;
  status: OrderStatus;
  total: number;
  created_at: string;
  items?: OrderItem[];
  note?: string | null;
};

export type CreateOrderPayload = {
  table_code: string;
  items: CreateOrderItemPayload[];
  note?: string;
};

export type CreateOrderItemPayload = {
  product_id: number;
  quantity: number;
};
