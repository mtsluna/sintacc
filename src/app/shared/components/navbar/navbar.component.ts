import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import { matExpandMoreRound, matShoppingCartRound, matSearchRound, matCloseRound, matPersonRound, matLoginRound } from '@ng-icons/material-icons/round';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CartService} from '../../../services/cart/cart.service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged, interval} from 'rxjs';
import {Address} from '../../../interfaces/address';
import {AddressService} from '../../../services/address/address.service';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    NgIcon,
    ReactiveFormsModule,
    LoginModalComponent,
    NgStyle,
    RouterLink
  ],
  providers: [
    provideIcons({
      matExpandMoreRound,
      matShoppingCartRound,
      matSearchRound,
      matCloseRound,
      matPersonRound,
      matLoginRound
    })
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  hiddenRoutes = ['/cart', '/detail', '/checkout', '/profile/address', '/profile/orders', '/admin/categories', 'privacy-policy', 'confirmation', 'categories'];
  destroyRef: DestroyRef = inject(DestroyRef);
  search = new FormControl('');
  router = inject(Router);
  route = inject(ActivatedRoute);
  cartCount: number | undefined = undefined;
  cartService = inject(CartService);
  selectedAddress: Address | undefined;
  addressService = inject(AddressService);
  firebaseAuth = inject(FirebaseAuthService);
  userPhotoURL: string | null = null;
  showLoginModal = false;
  showProfileMenu = false;
  isLoggedIn: boolean = false;
  private lastSelectedAddressId: string | null = null;

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
        });
        window.scrollTo(0, 0);
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

    this.pickedAddress();
    this.startAddressMonitoring();
  }

  async ngOnInit(): Promise<void> {
    this.listenToAuthState();
    return Promise.resolve();
  }

  private startAddressMonitoring() {
    // Monitor localStorage every second for address changes
    interval(1000).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.checkAddressChange();
    });
  }

  private checkAddressChange() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // If no user, set default message if not already set
      if (this.selectedAddress?.address !== 'Inicia sesión para ver tu dirección') {
        this.selectedAddress = {
          address: 'Inicia sesión para ver tu dirección',
        } as unknown as Address;
      }
      this.lastSelectedAddressId = null;
      return;
    }

    const currentSelectedAddressId = localStorage.getItem(`selectedAddress_${userId}`);

    // Check if the selected address ID has changed
    if (currentSelectedAddressId !== this.lastSelectedAddressId) {
      this.lastSelectedAddressId = currentSelectedAddressId;
      this.pickedAddress();
    }
  }

  pickedAddress() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.addressService.getSelectedAddress(userId).subscribe({
        next: (value) => {
          this.selectedAddress = value;
          localStorage.setItem(`selectedAddress_${userId}`, value.id);
          this.lastSelectedAddressId = value.id;
        },
        error: (err) => {
          this.selectedAddress = {
            address: 'Aún no tenes una dirección cargada',
          } as unknown as Address;
        }
      });
    } else {
      this.selectedAddress = {
        address: 'Inicia sesión para ver tu dirección',
      } as unknown as Address;
    }
  }

  listenToAuthState() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user: User | null) => {

      this.userPhotoURL = user?.photoURL || null;
      this.isLoggedIn = !!user;

      console.log(user)

      // Siempre actualizar la dirección cuando cambia el estado de auth
      this.pickedAddress();

      if(user || user !== null) {
        (await this.cartService.countProducts()).subscribe({
          next: (count) => {
            this.cartCount = count;
          }, error: () => {
            this.cartCount = undefined;
          }
        });
      } else {
        // Cuando el usuario se deslogea, limpiar datos
        this.cartCount = undefined;
        this.showProfileMenu = false;
        this.selectedAddress = {
          address: 'Inicia sesión para ver tu dirección',
        } as unknown as Address;
      }
    });
  }

  async navigateToCart() {
    if(!this.isLoggedIn) {
      return;
    }

    await this.router.navigate(['/cart'], {
      queryParams: {
        from: this.router.url
      }
    });
    window.scrollTo(0, 0);
  }

  async navigateToProfileAddress() {
    await this.router.navigate(['/profile/address'], {
      queryParams: {
        from: this.router.url
      }
    });
    window.scrollTo(0, 0);
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.listenToAuthState();
    this.showLoginModal = false;
  }
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }
  async logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('cart');
    await this.firebaseAuth.signOut();
    this.userPhotoURL = null;
    this.showProfileMenu = false;
    this.selectedAddress = {
      address: 'Inicia sesión para ver tu dirección',
    } as unknown as Address;
  }

  async navigateToOrders() {
    await this.router.navigate(['/profile/orders'])
  }

  getNavbarStyles() {
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    if (isAndroid) {
      return {
        'top': '0px',
        'padding-top': 'calc(max(env(safe-area-inset-top, 0px), 24px) + 16px)'
      };
    } else if (isIOS) {
      return {
        'top': 'env(safe-area-inset-top, 0px)',
        'padding-top': '16px'
      };
    }

    return {
      'top': '0px'
    };
  }

  shouldShowNavbar(): boolean {
    return !this.hiddenRoutes.some(route => this.router.url.includes(route));
  }

}
