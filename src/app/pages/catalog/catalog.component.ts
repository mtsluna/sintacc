import {Component, inject, OnInit} from '@angular/core';
import {CardComponent} from '../../shared/components/card/card.component';
import {NextButtonComponent} from "../../shared/components/next-button/next-button.component";
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../interfaces/category';
import {async, firstValueFrom} from 'rxjs';
import {ProductService} from '../../services/product/product.service';
import {CategoryService} from '../../services/category/category.service';
import {FooterComponent} from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-catalog',
  imports: [
    CardComponent,
    NextButtonComponent,
    FooterComponent,
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

  getContentPaddingTop(): string {
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    if (isAndroid) {
      // Navbar (108px) + Android safe area (32px) + pequeño margen (8px)
      return '148px';
    } else if (isIOS) {
      // Navbar (108px) + iOS safe area dinámico + pequeño margen
      return 'calc(116px + env(safe-area-inset-top, 0px))';
    }

    // Para desktop, navbar + pequeño margen
    return '116px';
  }

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
            id: 'abc1234',
            name: `Tu busqueda`,
            url: 'search',
            products,
            active: true
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
    window.scrollTo(0, 0);
  }

  async navigateToCategory(category: Category) {
    await this.router.navigate(['/category', category.url], {
      queryParams: {
        from: this.router.url
      }
    });
    window.scrollTo(0, 0);
  }

  async navigateToCatalog() {
    await this.router.navigate(['']);
    window.scrollTo(0, 0);
  }

  isOnCategoryRoute(): boolean {
    const currentRoute = this.router.url;
    const q = this.route.snapshot.queryParamMap.get('q');
    return /^\/category\/[^/]+$/.test(currentRoute) || !!q;
  }

}
