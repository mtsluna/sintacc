import {Component, inject} from '@angular/core';
import {CardComponent} from '../../shared/components/card/card.component';
import {NextButtonComponent} from "../../shared/components/next-button/next-button.component";
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../interfaces/category';

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

  constructor() {

    this.route.data.subscribe({
      next: (data) => {
        console.log(data)
        this.categories = data['catalog']?.categories || [];
      },
      error: (err) => {
        console.error('Error loading catalog data:', err);
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

}
