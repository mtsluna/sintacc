import {Component, Input} from '@angular/core';
import {Product} from '../../../interfaces/product';
import {CurrencyPipe, NgOptimizedImage} from '@angular/common';

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

  protected readonly console = console;
}
