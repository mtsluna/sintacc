export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  discount: number;
  image?: string;
  quantity?: number;
}
