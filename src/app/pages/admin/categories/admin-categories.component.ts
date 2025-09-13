import { Component, OnInit, inject } from '@angular/core';
import { Category } from '../../../interfaces/category';
import { CategoryService } from '../../../services/category/category.service';
import { firstValueFrom } from 'rxjs';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  imports: [
    FormsModule
  ],
  standalone: true
})
export class AdminCategoriesComponent implements OnInit {
  categories: (Category & { uploading?: boolean, selectedFile?: File | null })[] = [];

  private categoryService = inject(CategoryService);

  async ngOnInit() {
    await this.loadAllCategories();
  }

  async loadAllCategories() {
    try {
      const allCategories = await firstValueFrom(this.categoryService.getCategories());
      this.categories = (allCategories || []).map(cat => ({ ...cat, uploading: false, selectedFile: null }));
    } catch (error) {
      console.error('Error loading categories:', error);
      this.categories = [];
    }
  }

  onImageInput(event: Event, category: Category & { uploading?: boolean, selectedFile?: File | null }) {
    const target = event.target as HTMLInputElement;
    category.image = target.value;
    // Cuando se pega una URL, intentar previsualizar la imagen
    if (category.image) {
      this.previewPastedImage(category);
    }
  }

  async previewPastedImage(category: Category & { selectedFile?: File | null }) {
    if (category.image) {
      try {
        const response = await fetch(category.image);
        const blob = await response.blob();
        const filename = category.image.split('/').pop() || 'image.jpg';
        const file = new File([blob], filename, { type: blob.type });
        category.selectedFile = file;
      } catch (error) {
        console.error('Error previewing image:', error);
      }
    }
  }

  async uploadImage(category: Category & { uploading?: boolean, selectedFile?: File | null }) {
    if (!category.image) return;

    category.uploading = true;
    let fileToUpload = category.selectedFile;

    if (!fileToUpload && category.image) {
      try {
        // Usa proxy CORS solo si la descarga directa falla
        let response: Response | undefined;
        try {
          response = await fetch(category.image, { mode: 'cors' });
          if (!response.ok || response.type === 'opaque') {
            throw new Error('CORS error');
          }
        } catch (err) {
          // Si hay error, intenta con proxy
          const proxyUrl = 'https://corsproxy.io/?';
          const imageUrl = proxyUrl + encodeURIComponent(category.image);
          response = await fetch(imageUrl);
        }

        const blob = await response.blob();
        let filename = category.image.split('/').pop() || 'image';
        if (!filename.match(/\.(jpg|jpeg|png|gif|webp|png)$/i)) {
          const ext = blob.type.split('/')[1] || 'jpg';
          filename += '.' + ext;
        }
        fileToUpload = new File([blob], filename, { type: blob.type });
      } catch (err) {
        alert('No se pudo descargar la imagen por CORS. Usa una imagen local o una URL directa.');
        category.uploading = false;
        return;
      }
    }

    if (!fileToUpload) {
      category.uploading = false;
      return;
    }

    this.categoryService.uploadCategoryImage(category.id, fileToUpload).subscribe({
      next: () => {
        category.uploading = false;
        console.log('Category image uploaded successfully');
      },
      error: (error) => {
        console.error('Error uploading category image:', error);
        category.uploading = false;
      }
    });
  }
}
