import {Component, inject, OnInit} from '@angular/core';
import {Product} from '../../interfaces/product';
import {CurrencyPipe, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {BackButtonComponent} from '../../shared/components/back-button/back-button.component';
import {NextButtonComponent} from "../../shared/components/next-button/next-button.component";
import {RecommendationComponent} from '../../shared/sections/recommendation/recommendation.component';
import {ProductService} from '../../services/product/product.service';
import {firstValueFrom} from 'rxjs';

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
export class DetailComponent implements OnInit {

  product: Product | undefined;
  router = inject(Router);
  route = inject(ActivatedRoute);
  productService = inject(ProductService);

  constructor() {}

  async ngOnInit(): Promise<void> {
    const id = this.route?.snapshot.paramMap?.get('id');

    this.product = await firstValueFrom(this.productService.getProductById(id as string));
  }


}
