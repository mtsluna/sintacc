import {inject, Injectable} from '@angular/core';
import {Product} from '../../interfaces/product';
import {HttpClient} from '@angular/common/http';
import {Checkout} from '../../interfaces/checkout';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  httpClient = inject(HttpClient);

  constructor() { }

  postCheckout({ cartId, addressId, userId }: {
    cartId: string, userId: string, addressId: string
  }) {
    return this.httpClient.post<Checkout>(`https://barsac-api-production.up.railway.app/api/checkout`, {
      cart_id: cartId,
      user_id: userId,
      address_id: addressId
    });
  }
}
