import {Product} from './product';

export interface Category {
  id: string;
  name: string;
  url: string;
  image?: string;
  products: Array<Product>;
  active: boolean;
}
