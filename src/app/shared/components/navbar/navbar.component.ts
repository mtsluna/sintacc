import { Component } from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import { matExpandMoreRound, matShoppingCartRound, matSearchRound } from '@ng-icons/material-icons/round';

@Component({
  selector: 'app-navbar',
  imports: [
    NgIcon
  ],
  providers: [
    provideIcons({
      matExpandMoreRound,
      matShoppingCartRound,
      matSearchRound
    })
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
