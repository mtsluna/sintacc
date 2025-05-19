import {Component, inject} from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import { matExpandMoreRound, matShoppingCartRound, matSearchRound } from '@ng-icons/material-icons/round';
import {Router} from '@angular/router';
import {CartService} from '../../../services/cart/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [
    NgIcon
  ],
  providers: [
    provideIcons({
      matExpandMoreRound,
      matShoppingCartRound,
      matSearchRound
    })
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  router = inject(Router);
  cartService = inject(CartService);

  async navigateToCart() {
    await this.router.navigate(['/cart'], {
      queryParams: {
        from: this.router.url
      }
    });
  }

  async navigateToProfileAddress() {
    await this.router.navigate(['/profile/address'], {
      queryParams: {
        from: this.router.url
      }
    });
  }

  countProducts() {
    return this.cartService.countProducts();
  }

}
