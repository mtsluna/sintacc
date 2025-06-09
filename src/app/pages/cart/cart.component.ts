import {Component, inject} from '@angular/core';
import {Product} from '../../interfaces/product';
import {CardRowComponent} from '../../shared/components/card-row/card-row.component';
import {BackButtonComponent} from '../../shared/components/back-button/back-button.component';
import {CartService} from '../../services/cart/cart.service';
import {NextButtonComponent} from "../../shared/components/next-button/next-button.component";
import {ActivatedRoute, Router} from '@angular/router';

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
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  products: Array<Product>

  constructor() {
    this.products = this.cartService.getProducts();
  }

  navigateToFrom() {
    const from = this.activatedRoute.snapshot.queryParamMap.get('from') || '/';
    this.router.navigate([from]);
  }

}
