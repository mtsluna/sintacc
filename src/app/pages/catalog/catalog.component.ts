import {Component, inject} from '@angular/core';
import {CardComponent} from '../../shared/components/card/card.component';
import {Product} from '../../interfaces/product';
import {NextButtonComponent} from "../../shared/components/next-button/next-button.component";
import {Router} from '@angular/router';

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

  productCatena: Product = {
    name: 'Catena Zapata Malbec Argentino 750ml',
    price: 95000,
    images: [
      {
        id: '123',
        url: 'https://acdn-us.mitiendanube.com/stores/004/090/131/products/5173-zapata-malbecargentino-57697795e348a757ef17065395157362-1024-1024.jpg',
        alt: 'Catena Zapata Malbec Argentino 750ml'
      }
    ],
    id: '124',
    description: 'Un vinito',
    discount: 10
  }

  router = inject(Router);

  async navigateToCart() {
    await this.router.navigate(['/cart'], {
      queryParams: {
        from: this.router.url
      }
    });
  }

}
