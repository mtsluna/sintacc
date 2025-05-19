import {Component, Input} from '@angular/core';
import {Product} from '../../../interfaces/product';
import {CurrencyPipe, NgClass} from '@angular/common';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {matDeleteRound} from '@ng-icons/material-icons/round';

@Component({
  selector: 'app-card-row',
  imports: [
    CurrencyPipe,
    NgClass,
    NgIcon
  ],
  providers: [
    provideIcons({
      matDeleteRound
    })
  ],
  templateUrl: './card-row.component.html',
  standalone: true,
  styleUrl: './card-row.component.scss'
})
export class CardRowComponent {

  @Input()
  product: Product | undefined;

  increaseQuantity(product: Product | undefined) {
    // if(product?.quantity === 99) {
    //   return;
    // }
    //
    // this.moveQuantity(product?.id, 1);
  }

  decreaseQuantity(product: Product | undefined) {
    // if(product?.quantity === 0) {
    //   return;
    // }
    //
    // this.moveQuantity(product?.id, -1);
  }

  removeProduct(product: Product | undefined) {
    // console.log(this.products.findIndex((p: Product) => p?.id === product?.id))
    // this.products.splice(this.products.findIndex((p: Product) => p?.id === product?.id), 1)
  }

  moveQuantity(id: string | undefined, modifier: number) {
    // const actualQuantity = this.products.find((p: Product) => p?.id === id)!.quantity;
    //
    // this.products.find((p: Product) => p?.id === id)!.quantity = (actualQuantity || 0) + modifier;
  }

}
