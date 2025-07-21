import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../interfaces/category';
import { Product } from '../../../interfaces/product';
import { CategoryService } from '../../../services/category/category.service';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<string>('');
  products = signal<(Product & { selectedFile?: File | null })[]>([]);

  constructor(private categoryService: CategoryService, private productService: ProductService) {
    this.fetchCategories();
    effect(() => {
      if (this.selectedCategoryId()) {
        this.fetchProducts();
      }
    });
  }

  fetchCategories() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories.set(categories);
      if (categories.length > 0) {
        this.selectedCategoryId.set(categories[0].id);
      }
    });
  }

  fetchProducts() {
    this.productService.getProducts(this.selectedCategoryId()).subscribe(products => {
      this.products.set(products.map(p => ({ ...p, selectedFile: null })));
    });
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategoryId.set(value);
  }

  onFileSelected(event: any, product: Product & { selectedFile?: File | null }) {
    const file = event.target.files[0];
    product.selectedFile = file;
  }

  uploadImage(product: Product & { selectedFile?: File | null }) {
    if (!product.selectedFile) return;
    const formData = new FormData();
    formData.append('image', product.selectedFile);
    // this.http.post(`/api/products/${product.id}/image`, formData).subscribe(() => {
    //   this.fetchProducts();
    // });
  }
}
