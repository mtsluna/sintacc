import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart/cart.service';
import { Cart } from '../../../interfaces/cart';
import {BackButtonComponent} from '../../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, BackButtonComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  paidCarts: Cart[] = [];
  isLoading = true;
  expandedCarts: Set<string> = new Set();

  constructor(private cartService: CartService) {}

  async ngOnInit() {
    await this.loadPaidCarts();
  }

  async loadPaidCarts() {
    try {
      this.isLoading = true;
      this.paidCarts = await this.cartService.getPaidCarts();
    } catch (error) {
      console.error('Error loading paid carts:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getCartTotal(cart: Cart): number {
    return cart.products_total;
  }

  getShippingCost(cart: Cart): number {
    return cart.ship_total;
  }

  getCartTotalWithShipping(cart: Cart): number {
    return cart.total;
  }

  getProductsDiscount(cart: Cart): number {
    return cart.products_discount;
  }

  getShippingDiscount(cart: Cart): number {
    return cart.ship_discount;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTotalUnits(cart: Cart): number {
    return cart.products.reduce((total, product) => total + product.quantity, 0);
  }

  toggleCartExpansion(cartId: string): void {
    if (this.expandedCarts.has(cartId)) {
      this.expandedCarts.delete(cartId);
    } else {
      this.expandedCarts.add(cartId);
    }
  }

  isCartExpanded(cartId: string): boolean {
    return this.expandedCarts.has(cartId);
  }
}
