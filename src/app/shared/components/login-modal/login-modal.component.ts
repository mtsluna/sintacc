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
    <div class="fixed inset-0 z-2000 flex items-center justify-center bg-black/30 backdrop-blur-sm">
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
          <button (click)="sendCode()" class="w-full flex justify-center px-4 py-2 rounded bg-black text-white hover:bg-black text-sm">
            @if (isLoading) {
              <svg aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-shadow-stone-950 fill-stone-950" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            } @else {
              Continuar
            }
          </button>
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
          <button (click)="confirmCode()" class="w-full flex justify-center px-4 py-2 rounded bg-black text-white hover:bg-black text-sm">
            @if (isLoading) {
              <svg aria-hidden="true" class="w-5 h-5 text-gray-200 animate-spin dark:text-shadow-stone-950 fill-stone-950" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
            } @else {
              Continuar
            }
          </button>
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
  isLoading: boolean = false;

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

  async sendCode() {
    if (!this.phoneNumber) {
      this.error = 'Ingresa un número de teléfono válido.';
      return;
    }
    this.error = '';
    this.isLoading = true;
    try {
      const verificationId = await this.firebaseAuth.signInWithPhone(`+${this.phoneNumber}`, this.appVerifier);
      this.verificationId = verificationId;
      setTimeout(() => {
        this.step = 'code';
        this.isLoading = false;
      }, 2000);
    } catch (err: any) {
      this.error = err.message || 'Error al enviar el código.';
      this.isLoading = false;
    }
  }

  async confirmCode() {
    if (!this.smsCode) {
      this.error = 'Ingresa el código SMS.';
      return;
    }
    this.isLoading = true;
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
        this.isLoading = false;
      }
    } catch (err: any) {
      this.error = err.message || 'Error al verificar el código.';
      this.isLoading = false;
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
