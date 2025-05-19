import {Component, inject, Input} from '@angular/core';
import {Product} from '../../../interfaces/product';
import {CurrencyPipe, NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {CartService} from '../../../services/cart/cart.service';

@Component({
  selector: 'app-card',
  imports: [
    NgOptimizedImage,
    CurrencyPipe
  ],
  templateUrl: './card.component.html',
  standalone: true,
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() product: Product | undefined;

  router = inject(Router);
  cartService = inject(CartService);

  protected readonly console = console;

  async navigateToDetail() {
    console.log("hello")
    await this.router.navigate(['/detail', this.product?.id], {
      queryParams: {
        from: this.router.url
      }
    });
  }

  addProduct(product: Product | undefined) {
    this.cartService.increaseQuantity(product);
  }
}
