import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {SpinnerComponent} from './shared/components/spinner/spinner.component';
import {GoogleMapsModule} from '@angular/google-maps';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, SpinnerComponent, GoogleMapsModule],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'barsac';
  hiddenRoutes = ['/cart', '/detail', '/checkout', '/profile/address'];

  router = inject(Router);

  shouldShowNavbar(): boolean {
    return !this.hiddenRoutes.some(route => this.router.url.includes(route));
  }
}
