import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { Category } from '../../../interfaces/category';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matCloseRound } from '@ng-icons/material-icons/round';
import { Location } from '@angular/common';
import {CategoryService} from '../../../services/category/category.service';
import {BackButtonComponent} from '../back-button/back-button.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  imports: [NgIcon, BackButtonComponent],
  providers: [
    provideIcons({ matCloseRound })
  ],
  standalone: true
})
export class CategoryListComponent implements OnInit {
  categories: Category[] | undefined = [];
  loading = true;
  categorySelected = new EventEmitter<Category>();

  private location = inject(Location);
  private categoryService = inject(CategoryService);

  async ngOnInit() {
    try {
      this.categories = await this.categoryService.getCategories().toPromise();
    } finally {
      this.loading = false;
    }
  }

  onCategoryClick(category: Category) {
    this.categorySelected.emit(category);
  }

  onClose() {
    this.location.back();
  }
}
