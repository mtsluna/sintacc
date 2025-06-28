import {Component, inject} from '@angular/core';
import {BackButtonComponent} from '../../shared/components/back-button/back-button.component';
import {NextButtonComponent} from '../../shared/components/next-button/next-button.component';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {matLocationOnRound, matMotorcycleRound, matNotesRound} from '@ng-icons/material-icons/round';
import {ActivatedRoute} from '@angular/router';
import {Checkout} from '../../interfaces/checkout';
import {CurrencyPipe} from '@angular/common';

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

  route = inject(ActivatedRoute);

  constructor() {
    this.route.data.subscribe({
      next: (data) => {
        console.log('Checkout data:', data);
        this.checkout = data['checkout'];
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

}
