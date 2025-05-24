import {Component, inject} from '@angular/core';
import {Product} from '../../interfaces/product';
import {CardRowComponent} from '../../shared/components/card-row/card-row.component';
import {BackButtonComponent} from '../../shared/components/back-button/back-button.component';
import {CartService} from '../../services/cart/cart.service';
import {NextButtonComponent} from "../../shared/components/next-button/next-button.component";

@Component({
  selector: 'app-cart',
    imports: [
        CardRowComponent,
        BackButtonComponent,
        NextButtonComponent
    ],
  templateUrl: './cart.component.html',
  standalone: true,
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartService = inject(CartService);

  products: Array<Product>

  constructor() {
    this.products = this.cartService.getProducts();
  }

}
