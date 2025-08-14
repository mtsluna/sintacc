import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SafeAreaService {

  constructor() {
    this.initializeSafeArea();
  }

  private initializeSafeArea(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isPWA = (window.navigator as any).standalone || isStandalone;

      // Remover clases existentes
      document.body.classList.remove('ios-safe-area', 'android-safe-area', 'mobile-safe-area');

      if (isIOS) {
        this.applyIOSSafeArea();
      } else if (isAndroid) {
        this.applyAndroidSafeArea();
      }

      // Aplicar clase general para móviles
      if (isIOS || isAndroid) {
        document.body.classList.add('mobile-safe-area');
      }

      // Configuraciones específicas para PWA
      if (isPWA) {
        this.configurePWASafeArea();
      }
    }
  }

  private applyIOSSafeArea(): void {
    document.body.classList.add('ios-safe-area');
  }

  private applyAndroidSafeArea(): void {
    document.body.classList.add('android-safe-area');

    // Detectar tipo de navegación en Android
    this.detectAndroidNavigationType();

    // Configurar colores según el tema del sistema
    this.configureAndroidTheme();
  }

  private detectAndroidNavigationType(): void {
    // Detectar si usa gesture navigation o button navigation
    const screenHeight = window.screen.height;
    const windowHeight = window.innerHeight;
    const navBarHeight = screenHeight - windowHeight;

    if (navBarHeight > 60) {
      // Probablemente tiene button navigation
      document.body.classList.add('android-button-navigation');
      document.documentElement.style.setProperty('--nav-bar-height', `${navBarHeight}px`);
    } else {
      // Probablemente usa gesture navigation
      document.body.classList.add('android-gesture-navigation');
    }
  }

  private configureAndroidTheme(): void {
    // Detectar tema del sistema
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDarkMode) {
      document.body.classList.add('android-status-bar-dark', 'android-nav-bar-dark');
    }

    // Escuchar cambios en el tema
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (e.matches) {
          document.body.classList.add('android-status-bar-dark', 'android-nav-bar-dark');
        } else {
          document.body.classList.remove('android-status-bar-dark', 'android-nav-bar-dark');
        }
      });
    }
  }

  private configurePWASafeArea(): void {
    // Configuraciones específicas para PWA
    if ('virtualKeyboard' in navigator) {
      // Manejar teclado virtual en Android
      (navigator as any).virtualKeyboard.addEventListener('geometrychange', (event: any) => {
        const { height } = event.target.boundingRect;
        document.documentElement.style.setProperty('--keyboard-height', `${height}px`);
      });
    }
  }

  // Métodos públicos para configuración manual
  public setStatusBarColor(color: string): void {
    document.documentElement.style.setProperty('--safe-area-color', color);
  }

  public setNavigationBarColor(color: string): void {
    document.documentElement.style.setProperty('--safe-area-bottom-color', color);
  }

  public forceAndroidButtonNavigation(): void {
    document.body.classList.remove('android-gesture-navigation');
    document.body.classList.add('android-button-navigation');
  }

  public forceAndroidGestureNavigation(): void {
    document.body.classList.remove('android-button-navigation');
    document.body.classList.add('android-gesture-navigation');
  }

  // Método para refrescar la configuración
  public refresh(): void {
    this.initializeSafeArea();
  }
}
