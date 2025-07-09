import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login-modal',
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-xs relative">
        <button (click)="close.emit()" class="absolute top-2 right-2 text-gray-400 hover:text-black">&times;</button>
        <h2 class="text-lg font-bold mb-6 text-center">Iniciar sesión</h2>
        <button (click)="loginWithGoogle.emit()" class="w-full flex items-center justify-center gap-2 px-4 py-2 mb-3 rounded bg-white border border-gray-300 hover:bg-gray-100 text-sm">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5"> Google
        </button>
        <button (click)="loginWithApple.emit()" class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded bg-black text-white hover:bg-gray-900 text-sm">
          <img src="https://www.svgrepo.com/show/303128/apple-logo.svg" alt="Apple" class="w-5 h-5"> Apple
        </button>
      </div>
    </div>
  `,
  standalone: true,
  styleUrls: []
})
export class LoginModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() loginWithGoogle = new EventEmitter<void>();
  @Output() loginWithApple = new EventEmitter<void>();
}
