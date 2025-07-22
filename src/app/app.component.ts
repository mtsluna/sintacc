import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {SpinnerComponent} from './shared/components/spinner/spinner.component';
import {GoogleMapsModule} from '@angular/google-maps';
import {getAuth, getRedirectResult, UserCredential} from 'firebase/auth';
import { FirebaseAuthService } from './services/firebase-auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, SpinnerComponent, GoogleMapsModule],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'barsac';
  hiddenRoutes = ['/cart', '/detail', '/checkout', '/profile/address', '/admin/categories'];

  router = inject(Router);

  constructor(private firebaseAuthService: FirebaseAuthService) {}

  ngOnInit() {
    const auth = this.firebaseAuthService['auth'];
    getRedirectResult(auth)
      .then((result: UserCredential | null) => {
        if (result && result.user) {
          // Handle successful sign-in after redirect
          // For example, you can store user info or show a welcome message
          console.log('Signed in after redirect:', result.user);
        }
      })
      .catch((error) => {
        // Handle errors from redirect sign-in
        console.error('Redirect sign-in error:', error);
      });
  }

  shouldShowNavbar(): boolean {
    return !this.hiddenRoutes.some(route => this.router.url.includes(route));
  }
}
