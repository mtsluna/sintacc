import {Component, inject, Input} from '@angular/core';
import {Product} from '../../../interfaces/product';
import {CurrencyPipe, NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [
    NgOptimizedImage,
    CurrencyPipe
  ],
  templateUrl: './card.component.html',
  standalone: true,
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() product: Product | undefined;

  router = inject(Router);

  protected readonly console = console;

  async navigateToDetail() {
    await this.router.navigate(['/detail', this.product?.id]);
  }
}
