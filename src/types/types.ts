export enum RestaurantStaffEnum {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  CASHIER_PLUS = 'CASHIER_PLUS',
  CASHIER = 'CASHIER',
}

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
  image: string | null;
  tables?: RestaurantTable[];
  menu?: Menu;
};

/**
 * A local image selected from the device (e.g. via expo-image-picker) ready to
 * be uploaded as a multipart file part.
 */
export type ImageFile = {
  uri: string;
  name: string;
  type: string;
};

export type CreateRestaurantPayload = {
  name: string;
  description?: string;
  address?: string;
  imageFile?: ImageFile | null;
  existingImage?: string | null;
};

export type UpdateRestaurantPayload = {
  name: string;
  description: string | null;
  address: string | null;
  imageFile?: ImageFile | null;
  existingImage?: string | null;
};

export type CreateTablePayload = {
  code: string;
  area?: string;
  capacity: number;
};

export type CreateStaffPayload = {
  email: string;
  role: RestaurantStaffEnum;
};

export type CreateCategoryPayload = {
  name: string;
};

export type CreateProductPayload = {
  category_id: number;
  name: string;
  description?: string;
  price: number;
  imageFile?: ImageFile | null;
  existingImage?: string | null;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type RestaurantStaff = {
  id: number;
  user_id: string;
  restaurant_id: number;
  role: RestaurantStaffEnum;
  app_user: AppUser;
};
