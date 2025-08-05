import {Component, inject, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {NextButtonComponent} from '../../shared/components/next-button/next-button.component';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {
  matCheckCircleOutlineRound,
  matCancelRound
} from '@ng-icons/material-icons/round';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-confirmation',
  imports: [
    NextButtonComponent,
    NgIcon,
    NgClass
  ],
  providers: [
    provideIcons({
      matCheckCircleOutlineRound,
      matCancelRound
    })
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit {
  status!: string | undefined;
  cart!: string | null
  isLoading = false;
  route = inject(ActivatedRoute);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.queryParamMap.subscribe(params => {
      this.status = params.get('status') || undefined;
      this.cart = params.get('cart');
      localStorage.clear();
      this.isLoading = false;
    });
  }

  async goToCatalog() {
    await this.router.navigate(['/']);
  }
}
