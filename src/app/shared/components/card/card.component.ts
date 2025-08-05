import {Component, inject, Input} from '@angular/core';
import {Product} from '../../../interfaces/product';
import {CurrencyPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';
import {CartService} from '../../../services/cart/cart.service';
import {SpinnerComponent} from '../spinner/spinner.component';

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
  loading = false;

  router = inject(Router);
  cartService = inject(CartService);

  protected readonly console = console;

  async navigateToDetail() {
    await this.router.navigate(['/detail', this.product?.id], {
      queryParams: {
        from: this.router.url
      }
    });
    window.scrollTo(0, 0);
  }

  async addProduct(product: Product | undefined) {
    this.loading = true;
    await this.cartService.increaseQuantity(false, product);
    this.loading = false;
  }
}
