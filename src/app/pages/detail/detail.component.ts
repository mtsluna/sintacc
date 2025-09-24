import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Product} from '../../interfaces/product';
import {CurrencyPipe, NgClass, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {BackButtonComponent} from '../../shared/components/back-button/back-button.component';
import {NextButtonComponent} from "../../shared/components/next-button/next-button.component";
import {RecommendationComponent} from '../../shared/sections/recommendation/recommendation.component';
import {ProductService} from '../../services/product/product.service';
import {firstValueFrom} from 'rxjs';
import {CartService} from '../../services/cart/cart.service';
import {SafeAreaService} from '../../services/safe-area/safe-area.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-detail',
  imports: [
    NgOptimizedImage,
    CurrencyPipe,
    BackButtonComponent,
    NextButtonComponent,
    RecommendationComponent,
    NgClass
  ],
  templateUrl: './detail.component.html',
  standalone: true,
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

  product: Product | undefined;
  loading = false;
  router = inject(Router);
  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  cartService = inject(CartService);
  safeAreaService = inject(SafeAreaService);
  $destroyRef = inject(DestroyRef);

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.route.paramMap.pipe(takeUntilDestroyed(this.$destroyRef)).subscribe({
      next: async (params) => {
        const id = params.get('id');

        this.product = await firstValueFrom(this.productService.getProductById(id as string));
      }
    })
  }

  addProduct(product: Product | undefined) {
    return async () => {
      this.loading = true;
      await this.cartService.increaseQuantity(false, product);

      const from = this.route.snapshot.queryParamMap.get('from') || '/';
      await this.router.navigate([from]);
      window.scrollTo(0, 0);

      this.loading = false;
    }
  }

  getButtonPositionClass(): string {
    return this.safeAreaService.getBottomButtonPosition();
  }

}
