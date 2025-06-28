import {ResolveFn} from '@angular/router';
import {Category} from '../../interfaces/category';
import {inject} from '@angular/core';
import {CategoryService} from '../../services/category/category.service';
import {firstValueFrom} from 'rxjs';
import {ProductService} from '../../services/product/product.service';

export const catalogResolver: ResolveFn<{
  categories: Array<Category>
}> = async (route, _) => {

  const categoryService = inject(CategoryService);
  const productService = inject(ProductService);

  const category = route?.paramMap?.get('categoryId');
  const q = route?.queryParamMap?.get('q');

  if(q) {
    const products = await firstValueFrom(productService.getProducts(q));

    return {
      categories: [
        {
          name: `Tu busqueda`,
          url: 'search',
          products
        }
      ]
    }
  }

  const categories = await firstValueFrom(categoryService.getCategories(category as string));

  return {
    categories
  }
};
