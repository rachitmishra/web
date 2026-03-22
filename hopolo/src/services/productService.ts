export interface Variant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  title: string;
  price: number;
  category: string;
  isBestSeller?: boolean;
  description?: string;
  images?: string[];
  image?: string;
  rating?: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  deliveryDetails?: string;
  deliveryTime?: string;
  priceDisclaimer?: string;
  specifications?: Record<string, string>;
  artDetails?: Record<string, string>;
  variants?: Variant[];
  sizes?: string[];
  colors?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  name: string;
}
