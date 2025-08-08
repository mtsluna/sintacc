import { Component, EventEmitter, Output, inject, OnInit, OnDestroy } from '@angular/core';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account-modal',
  templateUrl: './delete-account-modal.component.html',
  standalone: true,
  imports: [],
  styleUrls: []
})
export class DeleteAccountModalComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  firebaseAuth = inject(FirebaseAuthService);
  router = inject(Router);

  isLoading = false;
  error = '';

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }

  closeModal() {
    document.body.style.overflow = 'auto';
    this.close.emit();
  }

  async deleteAccount() {
    this.isLoading = true;
    this.error = '';

    try {
      localStorage.removeItem('userId');

      await this.firebaseAuth.deleteCurrentUser();

      this.closeModal();

      this.router.navigate(['/']);

    } catch (err: any) {
      this.error = err.message || 'Error al eliminar la cuenta. Inténtalo de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }
}
