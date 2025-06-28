import { ResolveFn } from '@angular/router';
import {Product} from '../../interfaces/product';
import {inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {ProductService} from '../../services/product/product.service';

export const detailResolver: ResolveFn<{
  product: Product
}> = async (route, state) => {

  const productService = inject(ProductService);

  const id = route?.paramMap?.get('id');

  const product = await firstValueFrom(productService.getProductById(id as string));

  return {
    product
  }
};
