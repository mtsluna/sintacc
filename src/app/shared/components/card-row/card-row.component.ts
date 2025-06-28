import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
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

  @Output() removeProductEvent = new EventEmitter<Product>();

  cartService = inject(CartService);

  increaseQuantity(product: Product | undefined) {
    this.cartService.increaseQuantity(true, product);
  }

  decreaseQuantity(product: Product | undefined) {
    this.cartService.decreaseQuantity(true, product);
  }

  removeProduct(product: Product | undefined) {
    this.cartService.removeProduct(product);
    this.removeProductEvent.emit(product);
  }

}
