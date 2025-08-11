export interface Cart {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  products_total: number;
  products_discount: number;
  ship_total: number;
  ship_discount: number;
  total: number;
  products: Array<any>;
}
