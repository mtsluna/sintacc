import {Component, inject} from '@angular/core';
import {BackButtonComponent} from '../../shared/components/back-button/back-button.component';
import {NextButtonComponent} from '../../shared/components/next-button/next-button.component';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {matLocationOnRound, matMotorcycleRound, matNotesRound} from '@ng-icons/material-icons/round';
import {ActivatedRoute, Router} from '@angular/router';
import {Checkout} from '../../interfaces/checkout';
import {CurrencyPipe} from '@angular/common';
import {Address} from '../../interfaces/address';

@Component({
  selector: 'app-checkout',
  imports: [
    BackButtonComponent,
    NextButtonComponent,
    NgIcon,
    CurrencyPipe
  ],
  providers: [
    provideIcons({
      matLocationOnRound,
      matMotorcycleRound,
      matNotesRound
    })
  ],
  templateUrl: './checkout.component.html',
  standalone: true,
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  checkout: Checkout | undefined;
  selectedAddress: Address | undefined;

  route = inject(ActivatedRoute);
  router = inject(Router);

  constructor() {
    this.route.data.subscribe({
      next: (data) => {
        this.checkout = data['checkout'];
        this.selectedAddress = data['selectedAddress'];
      },
      error: (err) => {
        console.error('Error loading catalog data:', err);
      }
    })
  }

  navigateToMercadoPago(initPoint: string | undefined) {
    return () => {
      window.location.href = initPoint || '';
    }
  }

  async navigateToProfileAddress() {
    await this.router.navigate(['/profile/address'], {
      queryParams: {
        from: this.router.url
      }
    });
  }

}
