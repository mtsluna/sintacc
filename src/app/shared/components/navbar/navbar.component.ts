import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import { matExpandMoreRound, matShoppingCartRound, matSearchRound, matCloseRound } from '@ng-icons/material-icons/round';
import {ActivatedRoute, Router} from '@angular/router';
import {CartService} from '../../../services/cart/cart.service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [
    NgIcon,
    ReactiveFormsModule
  ],
  providers: [
    provideIcons({
      matExpandMoreRound,
      matShoppingCartRound,
      matSearchRound,
      matCloseRound
    })
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  destroyRef: DestroyRef = inject(DestroyRef);
  search = new FormControl('');
  router = inject(Router);
  route = inject(ActivatedRoute);
  cartCount: number = 0;
  cartService = inject(CartService);

  constructor() {
    this.search.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: async (value) => {
        await this.router.navigate(['/'], {
          queryParams: {
              ...(value ? { q: value } : {})
          }
        })
      },
      error: (err) => {
        console.error('Error in search input:', err);
      }
    })

    this.route.queryParamMap.subscribe({
      next: (params) => {
        const q = params.get('q');
        this.search.setValue(q ? q : '', { emitEvent: false });
      },
      error: (err) => {
        console.error('Error in queryParamMap:', err);
      }
    })
  }

  async ngOnInit(): Promise<void> {
    await this.cartService.getCart();

    (await this.cartService.countProducts()).subscribe({
      next: (count) => {
        this.cartCount = count;
      }
    })
  }

  async navigateToCart() {
    await this.router.navigate(['/cart'], {
      queryParams: {
        from: this.router.url
      }
    });
  }

  async navigateToProfileAddress() {
    await this.router.navigate(['/profile/address'], {
      queryParams: {
        from: this.router.url
      }
    });
  }

  async countProducts() {

  }

}
