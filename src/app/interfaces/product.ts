import {Image} from './image';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  images?: Array<Image>;
}
