import {Component, inject, OnInit, Renderer2, Inject, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {NextButtonComponent} from '../../shared/components/next-button/next-button.component';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {
  matCheckCircleOutlineRound,
  matCancelRound
} from '@ng-icons/material-icons/round';
import {NgClass} from '@angular/common';
import {DOCUMENT} from '@angular/common';
import {SafeAreaService} from '../../services/safe-area/safe-area.service';

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
export class ConfirmationComponent implements OnInit, OnDestroy {
  status!: string | undefined;
  cart!: string | null
  isLoading = false;
  route = inject(ActivatedRoute);

  safeAreaService = inject(SafeAreaService);

  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.queryParamMap.subscribe(params => {
      this.status = params.get('status') || undefined;
      this.cart = params.get('cart');
      localStorage.removeItem('cart');
      this.isLoading = false;
      this.document.body.style.setProperty('--safe-area-color', this.status === 'approved' ? 'var(--color-green-300)' : 'var(--color-red-300)');
    });
  }

  ngOnDestroy(): void {
    this.document.body.style.setProperty('--safe-area-color', '#fff');
  }

  async goToCatalog() {
    await this.router.navigate(['/']);
    window.scrollTo(0, 0);
  }

  getButtonPositionClass(): string {
    return this.safeAreaService.getBottomButtonPosition();
  }
}
