import { Injectable } from '@angular/core';
import {Product} from '../../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private products: Array<Product> = [];

  constructor() { }

  increaseQuantity(product: Product | undefined) {
    if((product?.quantity || 0) >= 99) {
      return;
    }

    this.moveProduct(product, 1);
  }

  decreaseQuantity(product: Product | undefined) {
    if(product?.quantity === 0) {
      return;
    }

    this.moveProduct(product, -1);
  }

  removeProduct(product: Product | undefined) {
    console.log(this.products.findIndex((p: Product) => p?.id === product?.id))
    this.products.splice(this.products.findIndex((p: Product) => p?.id === product?.id), 1)
  }

  getProducts() {
    return this.products;
  }

  countProducts() {
    return this.products.reduce((previousValue, currentValue) => previousValue + (currentValue?.quantity || 0), 0)
  }

  moveProduct(product: Product | undefined, modifier: number) {
    const existingProduct = this.products.find((p) => p.id == product?.id);

    if(modifier === 1 && (existingProduct?.quantity || 0) >= 99) {
      return;
    }

    if(existingProduct) {
      existingProduct.quantity = (existingProduct?.quantity || 0) + modifier;
      this.products.splice(this.products.findIndex((p) => p.id == product?.id), 1, existingProduct);
    } else if (product) {
      this.products.push({
        ...product,
        quantity: 1
      });
    }
  }
}
