import {Component, inject, OnInit} from '@angular/core';
import {CardComponent} from '../../shared/components/card/card.component';
import {NextButtonComponent} from "../../shared/components/next-button/next-button.component";
import {ActivatedRoute, ParamMap, Router, UrlSegment} from '@angular/router';
import {Category} from '../../interfaces/category';
import {async, firstValueFrom, map, merge} from 'rxjs';
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
export class CatalogComponent implements OnInit {

  categories: Array<Category> = [];
  router = inject(Router);
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);

  constructor() {}

  async ngOnInit(): Promise<void> {
    const categoryId = this.route.snapshot.paramMap.get('categoryId');

    this.categories = await firstValueFrom(this.categoryService.getCategories(categoryId || undefined));

    this.route.queryParamMap.subscribe({
      next: async params => {
        const q = this.route.snapshot.queryParamMap.get('q');

        if(!q) {
          if(this.route.snapshot.url.length === 0) {
            this.categories = await firstValueFrom(this.categoryService.getCategories());
          }

          return;
        }

        this.categories = [];

        const products = await firstValueFrom(this.productService.getProducts(q));

        this.categories = [
          {
            name: `Tu busqueda`,
            url: 'search',
            products
          }
        ]
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
