import {Component, inject} from '@angular/core';
import {CardComponent} from '../../shared/components/card/card.component';
import {NextButtonComponent} from "../../shared/components/next-button/next-button.component";
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../interfaces/category';
import {firstValueFrom} from 'rxjs';
import {ProductService} from '../../services/product/product.service';
import {CategoryService} from '../../services/category/category.service';

@Component({
  selector: 'app-catalog',
  imports: [
      CardComponent,
      NextButtonComponent
  ],
  templateUrl: './catalog.component.html',
  standalone: true,
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {

  categories: Array<Category> = [];
  router = inject(Router);
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);

  constructor() {

    this.route.data.subscribe({
      next: (data) => {
        this.categories = data['catalog']?.categories || [];
      },
      error: (err) => {
        console.error('Error loading catalog data:', err);
      }
    })

    this.route.queryParamMap.subscribe({
      next: async (params) => {
        const q = params.get('q');

        if(!q) {
          const category = this.route?.snapshot?.paramMap?.get('categoryId');
          this.categories = await firstValueFrom(this.categoryService.getCategories(category as string));

          return;
        }

        const products = await firstValueFrom(this.productService.getProducts(q));

        this.categories = [
          {
            name: `Resultados para "${q}"`,
            url: 'search',
            products
          }
        ]
      },
      error: (err) => {
        console.error('Error loading query parameters:', err);
      }
    })
  }

  async navigateToCart() {
    await this.router.navigate(['/cart'], {
      queryParams: {
        from: this.router.url
      }
    });
  }

  async navigateToCategory(category: Category) {
    await this.router.navigate(['/category', category.url], {
      queryParams: {
        from: this.router.url
      }
    });
  }

  async navigateToCatalog() {
    await this.router.navigate(['']);
  }

  isOnCategoryRoute(): boolean {
    const currentRoute = this.router.url;
    const q = this.route.snapshot.queryParamMap.get('q');
    return /^\/category\/[^/]+$/.test(currentRoute) || !!q;
  }

}
