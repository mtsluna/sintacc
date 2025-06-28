import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  httpClient = inject(HttpClient);

  constructor() { }

  getProductById(id: string) {
    return this.httpClient.get<Product>(`https://barsac-api-production.up.railway.app/api/products/${id}`);
  }

  getProducts(q: string) {
    return this.httpClient.get<Array<Product>>(`https://barsac-api-production.up.railway.app/api/products?q=${q}`);
  }
}
