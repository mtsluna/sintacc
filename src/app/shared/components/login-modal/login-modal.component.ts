import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { RecaptchaVerifier } from 'firebase/auth';

@Component({
  selector: 'app-login-modal',
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-xs relative">
        <button (click)="close.emit()" class="absolute top-2 right-2 text-gray-400 hover:text-black">&times;</button>
        <h2 class="text-lg font-bold mb-6 text-center">Iniciar sesión</h2>
        <div class="my-4 border-t"></div>
        @if (step === 'phone') {
          <input type="tel" [(ngModel)]="phoneNumber" placeholder="Teléfono"
                 class="w-full px-3 py-2 border rounded mb-2"/>
          <div id="recaptcha-container" class="mb-2"></div>
          <button (click)="sendCode()" class="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Continuar</button>
        }
        @else {
          <input type="text" [(ngModel)]="smsCode" placeholder="Código SMS"
                 class="w-full px-3 py-2 border rounded mb-2"/>
          <button (click)="confirmCode()" class="w-full px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm">Continuar</button>
        }
        @if (error) {
          <div class="text-red-500 text-xs mt-2">{{ error }}</div>
        }
      </div>
    </div>
    <div
      id="recaptcha-container"
      class="justify-center flex"
    ></div>
  `,
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: []
})
export class LoginModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() loginWithPhone = new EventEmitter<{ phoneNumber: string, smsCode?: string, appVerifier?: any }>();

  phoneNumber: string = '';
  smsCode: string = '';
  step: 'phone' | 'code' = 'phone';
  error: string = '';
  appVerifier: any;
  firebaseAuth = inject(FirebaseAuthService);
  verificationId: string = '';

  ngOnInit() {
    // Preload reCAPTCHA when modal is initialized
    if (!this.appVerifier) {
      this.appVerifier = new RecaptchaVerifier(
        this.firebaseAuth.auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response: any) => {
            // reCAPTCHA solved
          }
        }
      );
      this.appVerifier.render();
    }
  }

  sendCode() {
    if (!this.phoneNumber) {
      this.error = 'Ingresa un número de teléfono válido.';
      return;
    }
    this.error = '';
    this.firebaseAuth.signInWithPhone(this.phoneNumber, this.appVerifier)
      .then((verificationId: string) => {
        this.verificationId = verificationId;
        setTimeout(() => {
          this.step = 'code';
        }, 2000);
      })
      .catch((err: any) => {
        this.error = err.message || 'Error al enviar el código.';
      });
  }

  async confirmCode() {
    if (!this.smsCode) {
      this.error = 'Ingresa el código SMS.';
      return;
    }
    this.error = '';
    if (!this.verificationId) {
      this.error = 'No se pudo obtener el verificationId. Intenta reenviar el código.';
      return;
    }
    try {
      const result = await this.firebaseAuth.signInWithPhoneCode(this.verificationId, this.smsCode);
      if (result) {
        this.close.emit();
      }
    } catch (err: any) {
      this.error = err.message || 'Error al verificar el código.';
    }
  }
}
