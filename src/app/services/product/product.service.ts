import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../../interfaces/product';
import {API_URL} from '../../constants/api';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  httpClient = inject(HttpClient);

  constructor() { }

  getProductById(id: string) {
    return this.httpClient.get<Product>(`${API_URL}/api/products/${id}`);
  }

  getProducts(q: string) {
    return this.httpClient.get<Array<Product>>(`${API_URL}/api/products?q=${q}`);
  }

  getProductsByCategoryVariation(productId: string) {
    return this.httpClient.get<Array<Product>>(`${API_URL}/api/products/by-category/variation?productId=${productId}`);
  }
}
