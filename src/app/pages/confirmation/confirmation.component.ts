import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {NextButtonComponent} from '../../shared/components/next-button/next-button.component';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {
  matCheckCircleOutlineRound,
  matCancelRound
} from '@ng-icons/material-icons/round';
import {Cart} from '../../interfaces/cart';
import {CartService} from '../../services/cart/cart.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-confirmation',
  imports: [
    NextButtonComponent,
    NgIcon,
    NgClass
  ],
  providers: [
    provideIcons({
      matCheckCircleOutlineRound,
      matCancelRound
    })
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit {

  cart!: Cart;
  cartService = inject(CartService);

  constructor(private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.cart = await this.cartService.getCart();
  }

  async goToCatalog() {
    await this.router.navigate(['/']);
  }
}
