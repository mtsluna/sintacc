import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Category} from '../../interfaces/category';
import {API_URL} from '../../constants/api';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  httpClient = inject(HttpClient);

  constructor() { }

  getCategories(category?: string) {
    return this.httpClient.get<Category[]>(`${API_URL}/api/categories`, {
      params: {
          ...(category ? { category } : {})
      }
    }).pipe(
      map(categories => categories.filter(cat => !cat.active))
    );
  }
}

