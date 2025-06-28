export interface Checkout {
  products: {
    total: number;
    discount: number;
  },
  ship: {
    total: number;
    discount: number;
  };
  total: number;
  payment_link?: string;
}
