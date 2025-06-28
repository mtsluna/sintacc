import {Component, inject} from '@angular/core';
import {Product} from '../../interfaces/product';
import {CurrencyPipe, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {BackButtonComponent} from '../../shared/components/back-button/back-button.component';
import {NextButtonComponent} from "../../shared/components/next-button/next-button.component";
import {RecommendationComponent} from '../../shared/sections/recommendation/recommendation.component';

@Component({
  selector: 'app-detail',
  imports: [
    NgOptimizedImage,
    CurrencyPipe,
    BackButtonComponent,
    NextButtonComponent,
    RecommendationComponent
  ],
  templateUrl: './detail.component.html',
  standalone: true,
  styleUrl: './detail.component.scss'
})
export class DetailComponent {

  product: Product | undefined;
  router = inject(Router);
  route = inject(ActivatedRoute);

  constructor() {

    this.route.data.subscribe({
      next: (data) => {
        this.product = data['detail']?.product || [];
      },
      error: (err) => {
        console.error('Error loading catalog data:', err);
      }
    })
  }

}
