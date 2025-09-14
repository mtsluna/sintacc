import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../interfaces/category';
import {NgIcon, provideIcons} from '@ng-icons/core';
import { matChevronRightRound, matCategoryRound } from '@ng-icons/material-icons/round';

@Component({
  selector: 'app-category-scroller',
  templateUrl: './category-scroller.component.html',
  styleUrl: './category-scroller.component.scss',
  imports: [
    NgIcon
  ],
  providers: [
    provideIcons({
      matChevronRightRound,
      matCategoryRound
    })
  ],
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

