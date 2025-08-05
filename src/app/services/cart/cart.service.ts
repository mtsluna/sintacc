import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {Product} from '../../interfaces/product';
import {API_URL} from '../../constants/api';
import {Cart} from '../../interfaces/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = `${API_URL}/api/carts`;
  private count: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  createCart(userId: string): Observable<{ id: string }> {
    return this.http.post<any>(this.apiUrl, { user_id: userId });
  }

  async increaseQuantity(fromCart: boolean, product: Product | undefined): Promise<any> {
    let cart = localStorage.getItem('cart');

    if (cart == null) {
      const userId = localStorage.getItem('userId') || 'empty';

      cart = (await firstValueFrom(this.createCart(userId))).id;

      localStorage.setItem('cart', cart);
    }

    if((product?.quantity || 0) >= 99 || !cart || !product) {
      return;
    }

    const update = await this.modifyProductQuantity(product.id, 1);

    if(fromCart) {
      product.quantity = update.quantity;
      product.price = update.price;
      product.original_price = update.original_price;
    }

    this.count.next(this.count.value + 1);

    return update;
  }

  async decreaseQuantity(fromCart: boolean, product: Product | undefined): Promise<any> {
    let cart = localStorage.getItem('cart');

    if (cart == null) {
      const userId = localStorage.getItem('userId') || 'empty';

      cart = (await firstValueFrom(this.createCart(userId))).id;

      localStorage.setItem('cart', cart);
    }

    if((product?.quantity || 0) <= 0 || !cart || !product) {
      return;
    }

    const update = await this.modifyProductQuantity(product.id, -1);

    if(fromCart) {
      product.quantity = update.quantity;
      product.price = update.price;
      product.original_price = update.original_price;
    }

    this.count.next(this.count.value - 1);

    return update;
  }

  async removeProduct(product: Product | undefined): Promise<any>{
    let cart = localStorage.getItem('cart');

    if (cart == null) {
      const userId = localStorage.getItem('userId') || 'empty';

      cart = (await firstValueFrom(this.createCart(userId))).id;

      localStorage.setItem('cart', cart);
    }

    if (!cart || !product) {
      return;
    }

    this.count.next(this.count.value - 1);

    return await firstValueFrom(this.http.post<any>(`${this.apiUrl}/remove-product`, {
      cart_id: cart,
      product_id: product.id
    }));
  }

  async getCart(): Promise<Cart> {
    let cart = localStorage.getItem('cart');

    if (cart == null) {
      const userId = localStorage.getItem('userId') || 'empty';
      cart = (await firstValueFrom(this.createCart(userId))).id;
      localStorage.setItem('cart', cart);
    }

    const cartData = await firstValueFrom(this.http.get<{
      id: string;
      user_id: string;
      status: string;
      products: Array<{
        product_id: string;
        name: string;
        image: string;
        price: number;
        original_price: number;
        discount: number;
        quantity: number;
      }>;
    }>(`${this.apiUrl}/${cart}`));

    if (cartData.status !== 'PENDING') {
      const userId = localStorage.getItem('userId') || 'empty';
      const newCartId = (await firstValueFrom(this.createCart(userId))).id;
      localStorage.setItem('cart', newCartId);
      return await firstValueFrom(this.http.get<Cart>(`${this.apiUrl}/${newCartId}`));
    }

    return cartData;
  }

  async countProducts(): Promise<BehaviorSubject<number>> {
    if(!this.count.value) {
      this.count = new BehaviorSubject<number>(0);

      const cart = await this.getCart();

      this.count.next(cart.products.map((p) => p.quantity)
        .reduce((a, b) => a + b, 0))
    }

    return this.count;
  }

  private async modifyProductQuantity(productId: string, quantity: number): Promise<{
    quantity: number;
    price: number;
    original_price: number;
  }> {
    let cart = localStorage.getItem('cart');

    if (cart == null) {
      const userId = localStorage.getItem('userId') || 'empty';

      cart = (await firstValueFrom(this.createCart(userId))).id;

      localStorage.setItem('cart', cart);
    }

    return await firstValueFrom(this.http.post<any>(`${this.apiUrl}/add-product`, {
      cart_id: cart,
      product_id: productId,
      quantity
    }));
  }
}
