import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import { matExpandMoreRound, matShoppingCartRound, matSearchRound, matCloseRound, matPersonRound } from '@ng-icons/material-icons/round';
import {ActivatedRoute, Router} from '@angular/router';
import {CartService} from '../../../services/cart/cart.service';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {Address} from '../../../interfaces/address';
import {AddressService} from '../../../services/address/address.service';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

@Component({
  selector: 'app-navbar',
  imports: [
    NgIcon,
    ReactiveFormsModule,
    LoginModalComponent
  ],
  providers: [
    provideIcons({
      matExpandMoreRound,
      matShoppingCartRound,
      matSearchRound,
      matCloseRound,
      matPersonRound
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
  cartCount: number | undefined = undefined;
  cartService = inject(CartService);
  selectedAddress: Address | undefined;
  addressService = inject(AddressService);
  firebaseAuth = inject(FirebaseAuthService);
  userPhotoURL: string | null = null;
  showLoginModal = false;
  showProfileMenu = false;
  isLoggedIn: boolean = false;

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

    const userId = localStorage.getItem('userId');

    if(userId) {
      this.addressService.getSelectedAddress(userId).subscribe({
        next: (value) => {
          this.selectedAddress = value;
        },
        error: (err) => {
          this.selectedAddress = {
            address: 'Aún no tenes una dirección cargada',
          } as unknown as Address;
        }
      })
    } else {
      this.selectedAddress = {
        address: 'Inicia sesión para ver tu dirección',
      } as unknown as Address;
    }
  }

  async ngOnInit(): Promise<void> {
    (await this.cartService.countProducts()).subscribe({
      next: (count) => {
        this.cartCount = count;
      }
    });
    this.listenToAuthState();
    return Promise.resolve();
  }

  listenToAuthState() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user: User | null) => {
      this.userPhotoURL = user?.photoURL || null;
      this.isLoggedIn = !!user;
    });
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

  async loginWithGoogle() {
    await this.firebaseAuth.signInWithGoogle();
    this.closeLoginModal();
  }

  async loginWithApple() {
    await this.firebaseAuth.signInWithApple();
    this.closeLoginModal();
  }

  openLoginModal() {
    this.showLoginModal = true;
  }
  closeLoginModal() {
    this.showLoginModal = false;
  }
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }
  async logout() {
    await this.firebaseAuth.signOut();
    localStorage.removeItem('userId');
    this.userPhotoURL = null;
    this.showProfileMenu = false;
  }

}
