import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../interfaces/category';

@Component({
  selector: 'app-category-scroller',
  templateUrl: './category-scroller.component.html',
  styleUrl: './category-scroller.component.scss',
  standalone: true
})
export class CategoryScrollerComponent {
  @Input() categories: Category[] = [];
  @Output() categorySelected = new EventEmitter<Category>();
  @Output() viewAll = new EventEmitter<void>();

  get displayCategories(): Category[] {
    return this.categories.slice(0, 5);
  }

  onCategoryClick(category: Category) {
    this.categorySelected.emit(category);
  }

  onViewAllClick() {
    this.viewAll.emit();
  }
}

