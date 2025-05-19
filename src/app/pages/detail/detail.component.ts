import {Component, inject} from '@angular/core';
import {Product} from '../../interfaces/product';
import {CurrencyPipe, NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {BackButtonComponent} from '../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-detail',
  imports: [
    NgOptimizedImage,
    CurrencyPipe,
    BackButtonComponent
  ],
  templateUrl: './detail.component.html',
  standalone: true,
  styleUrl: './detail.component.scss'
})
export class DetailComponent {

  product: Product = {
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

}
