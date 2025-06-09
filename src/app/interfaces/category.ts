import {Product} from './product';

export interface Category {
  name: string;
  url: string;
  products: Array<Product>;
}
