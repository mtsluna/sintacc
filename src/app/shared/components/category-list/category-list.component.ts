import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { Category } from '../../../interfaces/category';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CategoryService } from '../../../services/category/category.service';
import { BackButtonComponent } from '../back-button/back-button.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  imports: [BackButtonComponent],
  standalone: true
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = true;

  private location = inject(Location);
  private router = inject(Router);
  private categoryService = inject(CategoryService);

  async ngOnInit() {
    try {
      this.categories = (await firstValueFrom(this.categoryService.getCategories())) ?? [];
    } finally {
      this.loading = false;
    }
  }

  async onCategoryClick(category: Category) {
    await this.router.navigate(['/category', category.url]);
    window.scrollTo(0, 0);
  }

  onClose() {
    this.location.back();
  }
}
