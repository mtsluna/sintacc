import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {matCloseRound} from '@ng-icons/material-icons/round';

@Component({
  selector: 'app-back-button',
  imports: [
    NgIcon
  ],
  providers: [
    provideIcons({
      matCloseRound
    })
  ],
  templateUrl: './back-button.component.html',
  standalone: true,
  styleUrl: './back-button.component.scss'
})
export class BackButtonComponent {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  async navigateToFrom() {
    const from = this.activatedRoute.snapshot.queryParamMap.get('from') || '/';
    console.log(from)
    await this.router.navigateByUrl(from);
  }

}
