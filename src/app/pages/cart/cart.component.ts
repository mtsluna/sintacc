import {Component, inject, OnInit} from '@angular/core';
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
export class CartComponent implements OnInit {

  cartService = inject(CartService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  products: Array<Product>;
  loadingProducts: boolean = true;

  constructor() {
    this.products = [];
  }

  async ngOnInit() {
    this.loadingProducts = true;
    const cart = await this.cartService.getCart();
    this.products = cart.products.map((product) => ({
      id: product.product_id,
      name: product.name,
      image: product.image,
      price: product.price,
      original_price: product.original_price,
      discount: product.discount,
      quantity: product.quantity,
      description: ''
    }));
    this.loadingProducts = false;
  }

  async navigateToFrom() {
    const from = this.activatedRoute.snapshot.queryParamMap.get('from') || '/';
    await this.router.navigate([from]);
  }

  async navigateToCheckout() {
    await this.router.navigate(['/checkout'], {
      queryParams: {
        from: this.router.url
      }
    });
  }

  async removeProduct(product: Product | undefined) {
    if (!product) return;

    this.products = this.products.filter(p => p.id !== product.id);
  }

}
