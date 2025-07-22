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
        this.selectedCategoryId.set(categories[0].url);
      }
    });
  }

  fetchProducts() {
    this.categoryService.getCategories(this.selectedCategoryId()).subscribe({
      next: (categories: Category[]) => {
        const [category] = categories;
        if (category) {
          this.products.set(category.products.map(product => ({ ...product, selectedFile: null, uploading: false })));
        } else {
          this.products.set([]);
        }
      }
    });
  }

  onCategoryChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategoryId.set(value);
  }

  async previewPastedImage(product: Product & { selectedFile?: File | null }) {
    if (product.image) {
      const response = await fetch(product.image);
      const blob = await response.blob();
      const filename = product.image.split('/').pop() || 'image.jpg';
      const file = new File([blob], filename, { type: blob.type });
      product.selectedFile = file;
    }
  }

  async uploadImage(product: Product & { selectedFile?: File | null, uploading?: boolean }) {
    product.uploading = true;
    let fileToUpload = product.selectedFile;
    if (!fileToUpload && product.image) {
      try {
        // Usa proxy CORS solo si la descarga directa falla
        let response: Response | undefined;
        try {
          response = await fetch(product.image, { mode: 'cors' });
          if (!response.ok || response.type === 'opaque') {
            throw new Error('CORS error');
          }
        } catch (err) {
          // Si hay error, intenta con proxy
          const proxyUrl = 'https://corsproxy.io/?';
          const imageUrl = proxyUrl + encodeURIComponent(product.image);
          response = await fetch(imageUrl);
        }
        const blob = await response.blob();
        let filename = product.image.split('/').pop() || 'image';
        if (!filename.match(/\.(jpg|jpeg|png|gif|webp|png)$/i)) {
          const ext = blob.type.split('/')[1] || 'jpg';
          filename += '.' + ext;
        }
        fileToUpload = new File([blob], filename, { type: blob.type });
      } catch (err) {
        alert('No se pudo descargar la imagen por CORS. Usa una imagen local o una URL directa.');
        product.uploading = false;
        return;
      }
    }
    if (!fileToUpload) {
      product.uploading = false;
      return;
    }
    this.productService.uploadProductImage(product.id, fileToUpload).subscribe({
      next: () => {
        //this.fetchProducts();
        product.uploading = false;
      },
      error: () => {
        product.uploading = false;
      }
    });
  }
}
