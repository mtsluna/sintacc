import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { FirebaseAuthService } from '../../../services/firebase-auth.service';
import { RecaptchaVerifier } from 'firebase/auth';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { UserService } from '../../../services/user.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-login-modal',
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-xs relative">
        <button (click)="close.emit()" class="absolute top-4 right-4 text-gray-400 hover:text-black">&times;</button>
        <h2 class="text-lg font-bold mb-6 text-center">Iniciar sesión</h2>
        <div class="my-4"></div>
        @if (step === 'phone') {
          <input type="tel" [(ngModel)]="phoneNumber" placeholder="Teléfono"
                 mask="00 0 000 000-0000" class="w-full outline-black px-3 py-2 border rounded mb-2" prefix="+" [showMaskTyped]="true" />
          <label class="block text-xs text-center text-gray-500 mb-1">Ingresa tu número de telefono para recibir el código de verificación. Ejemplo: +54 9 261 510-9127.</label>
          <div id="recaptcha-container" class="mb-2"></div>
          <div class="my-4"></div>
          <button (click)="sendCode()" class="w-full px-4 py-2 rounded bg-black text-white hover:bg-black text-sm">Continuar</button>
        }
        @else {
          <div class="flex gap-2 justify-center mb-2">
            @for (input of [0,1,2,3,4,5]; track input) {
              <input maxlength="1" type="number"
                class="w-9 h-9 text-center border rounded text-lg font-mono outline-black"
                [value]="smsCode[input] || ''"
                (input)="onDigitInput($event, input)"
                (keydown)="onDigitKeydown($event, input)"
                [autofocus]="input === 0"
                (paste)="onPaste($event)"
              />
            }
          </div>
          <label class="block text-xs text-center text-gray-500 mb-1">Ingresa el código que recibiste por SMS. ¿Necesitas cambiar el número de teléfono?<div class="text-xs text-gray-500 mb-2 cursor-pointer underline" (click)="step = 'phone'">
            Haz clic aquí
          </div></label>
          <div class="my-4"></div>
          <button (click)="confirmCode()" class="w-full px-4 py-2 rounded bg-black text-white hover:bg-black text-sm">Continuar</button>
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
    FormsModule,
    NgxMaskDirective
  ],
  providers: [
    provideNgxMask()
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
  userService = inject(UserService);
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
    this.firebaseAuth.signInWithPhone(`+${this.phoneNumber}`, this.appVerifier)
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
        // Get ID token
        const idToken = await this.firebaseAuth.getIdToken();
        if (idToken) {
          const { id } = await firstValueFrom(this.userService.registerUser(idToken));

          localStorage.setItem('userId', id);
        }
        this.close.emit();
      }
    } catch (err: any) {
      this.error = err.message || 'Error al verificar el código.';
    }
  }

  onDigitInput(event: any, index: number) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    let codeArr = this.smsCode.split('');
    codeArr[index] = value;
    this.smsCode = codeArr.join('').slice(0, 6);
    // Move to next input if a digit is entered
    if (value && index < 5) {
      const nextInput = event.target.parentElement.querySelectorAll('input')[index + 1];
      if (nextInput) nextInput.focus();
    }
  }

  onDigitKeydown(event: any, index: number) {
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
      const prevInput = event.target.parentElement.querySelectorAll('input')[index - 1];
      if (prevInput) prevInput.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') || '';
    const digits = pasteData.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length) {
      this.smsCode = digits.join('');
      const inputs = (event.target as HTMLInputElement).parentElement?.querySelectorAll('input');
      digits.forEach((digit, idx) => {
        if (inputs && inputs[idx]) {
          (inputs[idx] as HTMLInputElement).value = digit;
        }
      });
      event.preventDefault();
    }
  }
}
