export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  sku?: string;
  uploading?: boolean;
  discount: number;
  image?: string;
  quantity?: number;
  category_id?: string;
}
