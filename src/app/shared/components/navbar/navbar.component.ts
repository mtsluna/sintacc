import {Component, inject} from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import { matExpandMoreRound, matShoppingCartRound, matSearchRound } from '@ng-icons/material-icons/round';
import {Router} from '@angular/router';

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

  async navigateToCart() {
    await this.router.navigate(['/cart']);
  }

  async navigateToProfileAddress() {
    await this.router.navigate(['/profile/address']);
  }

}
