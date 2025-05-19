import {Component, inject, Input} from '@angular/core';
import {Product} from '../../../interfaces/product';
import {CurrencyPipe, NgClass} from '@angular/common';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {matDeleteRound} from '@ng-icons/material-icons/round';
import {CartService} from '../../../services/cart/cart.service';

@Component({
  selector: 'app-card-row',
  imports: [
    CurrencyPipe,
    NgClass,
    NgIcon
  ],
  providers: [
    provideIcons({
      matDeleteRound
    })
  ],
  templateUrl: './card-row.component.html',
  standalone: true,
  styleUrl: './card-row.component.scss'
})
export class CardRowComponent {

  @Input()
  product: Product | undefined;

  cartService = inject(CartService);

  increaseQuantity(product: Product | undefined) {
    this.cartService.increaseQuantity(product);
  }

  decreaseQuantity(product: Product | undefined) {
    this.cartService.decreaseQuantity(product);
  }

  removeProduct(product: Product | undefined) {
    this.cartService.removeProduct(product);
  }

}
