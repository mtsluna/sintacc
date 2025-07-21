import {Product} from './product';

export interface Category {
  id: string;
  name: string;
  url: string;
  products: Array<Product>;
}
