import {Component, inject, Input, OnInit} from '@angular/core';
import {CardComponent} from '../../components/card/card.component';
import {firstValueFrom} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../services/product/product.service';
import {Product} from '../../../interfaces/product';

@Component({
  selector: 'app-recommendation',
  imports: [
    CardComponent
  ],
  templateUrl: './recommendation.component.html',
  standalone: true,
  styleUrl: './recommendation.component.scss'
})
export class RecommendationComponent implements OnInit {

  products: Array<Product> | undefined;
  router = inject(Router);
  route = inject(ActivatedRoute);
  productService = inject(ProductService);

  async ngOnInit(): Promise<void> {
    const id = this.route?.snapshot.paramMap?.get('id');

    this.products = await firstValueFrom(this.productService.getProductsByCategoryVariation(id as string));
  }

  @Input() title: string | undefined;
  @Input() category: string | undefined;

}
