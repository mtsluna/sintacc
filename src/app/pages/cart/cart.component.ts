import {Component} from '@angular/core';
import {Product} from '../../interfaces/product';
import {CardRowComponent} from '../../shared/components/card-row/card-row.component';
import {BackButtonComponent} from '../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-cart',
  imports: [
    CardRowComponent,
    BackButtonComponent
  ],
  templateUrl: './cart.component.html',
  standalone: true,
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  products: Array<Product> = [
    {
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
      discount: 10,
      quantity: 9
    },
    {
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
      discount: 10,
      quantity: 9
    }
  ]

}
