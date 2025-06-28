import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {CartService} from '../../services/cart/cart.service';
import {CheckoutService} from '../../services/checkout/checkout.service';
import {Checkout} from '../../interfaces/checkout';

export const checkoutResolver: ResolveFn<Checkout> = async (route, state) => {

  const checkoutService = inject(CheckoutService);
  const cartService = inject(CartService);

  const { id: cartId } = await cartService.getCart();

  return await firstValueFrom(checkoutService.postCheckout({
    cartId,
    addressId: '95bc4a6c-9c04-41d8-b729-f06e0ccd81bb',
    userId: '79f72af8-4aac-46da-8a49-c2314caebb13'
  }))
};
