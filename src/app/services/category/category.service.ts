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

  updateCategoryImage(categoryId: string, imageUrl: string) {
    return this.httpClient.patch(`${API_URL}/api/categories/${categoryId}`, {
      image: imageUrl
    }).toPromise();
  }

  uploadCategoryImage(categoryId: string, image: File) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('categoryId', categoryId);
    return this.httpClient.post(`${API_URL}/api/categories/upload-image`, formData);
  }
}
