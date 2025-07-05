import {Component, inject, OnInit} from '@angular/core';
import {BackButtonComponent} from '../../shared/components/back-button/back-button.component';
import {NextButtonComponent} from '../../shared/components/next-button/next-button.component';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {matLocationOnRound, matMotorcycleRound, matNotesRound} from '@ng-icons/material-icons/round';
import {ActivatedRoute, Router} from '@angular/router';
import {Checkout} from '../../interfaces/checkout';
import {CurrencyPipe} from '@angular/common';
import {Address} from '../../interfaces/address';
import {CheckoutService} from '../../services/checkout/checkout.service';
import {CartService} from '../../services/cart/cart.service';
import {AddressService} from '../../services/address/address.service';
import {merge} from 'rxjs/internal/operators/merge';
import {firstValueFrom} from 'rxjs';

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
export class CheckoutComponent implements OnInit {

  checkout: Checkout | undefined;
  selectedAddress: Address | undefined;
  isLoading: boolean = true;

  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);
  addressService = inject(AddressService);
  route = inject(ActivatedRoute);
  router = inject(Router);



  constructor() {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    const { id: cartId } = await this.cartService.getCart();
    const [address, checkout] = await Promise.all([
      firstValueFrom(this.addressService.getSelectedAddress('79f72af8-4aac-46da-8a49-c2314caebb13')),
      firstValueFrom(this.checkoutService.postCheckout({
        cartId,
        addressId: '95bc4a6c-9c04-41d8-b729-f06e0ccd81bb',
        userId: '79f72af8-4aac-46da-8a49-c2314caebb13'
      }))
    ]);
    this.selectedAddress = address;
    this.checkout = checkout;
    this.isLoading = false;
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
