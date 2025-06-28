import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Category} from '../../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  httpClient = inject(HttpClient);

  constructor() { }

  getCategories(category?: string) {
    return this.httpClient.get<Category[]>('https://barsac-api-production.up.railway.app/api/categories', {
      params: {
          ...(category ? { category } : {})
      }
    });
  }
}
