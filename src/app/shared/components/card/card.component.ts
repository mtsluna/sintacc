import {Component, inject, Input} from '@angular/core';
import {Product} from '../../../interfaces/product';
import {CurrencyPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {CartService} from '../../../services/cart/cart.service';

@Component({
  selector: 'app-card',
  imports: [
    NgOptimizedImage,
    CurrencyPipe,
    NgClass
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
    await this.router.navigate(['/detail', this.product?.id], {
      queryParams: {
        from: this.router.url
      }
    });
  }

  async addProduct(product: Product | undefined) {
    await this.cartService.increaseQuantity(false, product);
  }
}
