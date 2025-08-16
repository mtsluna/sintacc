import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {SpinnerComponent} from './shared/components/spinner/spinner.component';
import {GoogleMapsModule} from '@angular/google-maps';
import {getRedirectResult, UserCredential} from 'firebase/auth';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { SafeAreaService } from './services/safe-area/safe-area.service';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, SpinnerComponent, GoogleMapsModule, NgStyle],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'barsac';
  hiddenRoutes = ['/cart', '/detail', '/checkout', '/profile/address', '/profile/orders', '/admin/categories', 'privacy-policy', 'confirmation'];

  router = inject(Router);

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private safeAreaService: SafeAreaService
  ) {}

  ngOnInit() {
    // El SafeAreaService ya se inicializa automáticamente en el constructor
    // y maneja tanto iOS como Android

    const auth = this.firebaseAuthService['auth'];
    getRedirectResult(auth)
      .then((result: UserCredential | null) => {
        if (result && result.user) {
          console.log('Signed in after redirect:', result.user);
        }
      })
      .catch((error) => {
        console.error('Redirect sign-in error:', error);
      });
  }

  shouldShowNavbar(): boolean {
    return !this.hiddenRoutes.some(route => this.router.url.includes(route));
  }

  protected readonly navigator = navigator;
}
