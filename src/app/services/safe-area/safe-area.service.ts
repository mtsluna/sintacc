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
      const userAgent = navigator.userAgent;
      const isIOS = /iphone|ipad|ipod/i.test(userAgent);
      const isAndroid = /android/i.test(userAgent);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isPWA = (window.navigator as any).standalone || isStandalone;

      document.body.classList.remove('ios-safe-area', 'android-safe-area', 'mobile-safe-area');

      if (isIOS) {
        this.applyIOSSafeArea();
      } else if (isAndroid) {
        this.applyAndroidSafeArea();
      }

      if (isIOS || isAndroid) {
        document.body.classList.add('mobile-safe-area');
      }

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

    this.detectAndroidNavigationType();
    this.configureAndroidTheme();
  }

  /**
   * Directly detect Android navigation bar using Flutter injected variables
   * @returns boolean indicating if navigation bar is present
   */
  private detectAndroidNavigationBarDirect(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      // Método 1: Usar variables inyectadas desde Flutter (más confiable)
      if ((window as any).flutterAppInfo) {
        const flutterInfo = (window as any).flutterAppInfo;
        console.log('Flutter App Info:', flutterInfo);

        if (flutterInfo.platform === 'android' && flutterInfo.hasNavigationBar !== undefined) {
          console.log('Using Flutter navigation bar info:', flutterInfo.hasNavigationBar);
          return flutterInfo.hasNavigationBar;
        }
      }

      // Método 2: Fallback - Comparar alturas de pantalla si Flutter info no está disponible
      const screenHeight = window.screen.availHeight || window.screen.height;
      const windowHeight = window.innerHeight;
      const heightDifference = screenHeight - windowHeight;

      console.log('Fallback detection:', {
        screenHeight,
        windowHeight,
        heightDifference
      });

      return heightDifference > 60;

    } catch (error) {
      console.error('Error detecting navigation bar:', error);
      // Fallback conservador: asumir que hay navigation bar para estar seguro
      return true;
    }
  }

  private detectAndroidNavigationType(): void {
    const screenHeight = window.screen.height;
    const windowHeight = window.innerHeight;
    const navBarHeight = screenHeight - windowHeight;

    if (navBarHeight > 60) {
      document.body.classList.add('android-button-navigation');
      document.documentElement.style.setProperty('--nav-bar-height', `${navBarHeight}px`);
    } else {
      document.body.classList.add('android-gesture-navigation');
    }
  }

  private configureAndroidTheme(): void {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDarkMode) {
      document.body.classList.add('android-status-bar-dark', 'android-nav-bar-dark');
    }

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
    if ('virtualKeyboard' in navigator) {
      (navigator as any).virtualKeyboard.addEventListener('geometrychange', (event: any) => {
        const { height } = event.target.boundingRect;
        document.documentElement.style.setProperty('--keyboard-height', `${height}px`);
      });
    }
  }

  /**
   * Get bottom positioning class for floating buttons based on device and navigation type
   * @returns CSS class string for bottom positioning
   */
  getBottomButtonPosition(): string {
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    if ((window as any).flutterAppInfo) {
      const flutterInfo = (window as any).flutterAppInfo;

      if (flutterInfo.platform === 'android') {
        const hasNavigationBar = flutterInfo.hasNavigationBar;
        console.log('Flutter - Navigation bar detected:', hasNavigationBar);

        if (hasNavigationBar) {
          return 'bottom-16';
        } else {
          return 'bottom-8';
        }
      } else if (flutterInfo.platform === 'ios') {
        return 'bottom-8';
      }
    }

    // Fallback para detección regular de navegador
    if (isAndroid) {
      const hasNavigationBar = this.detectAndroidNavigationBarDirect();
      console.log('Browser - Navigation bar detected:', hasNavigationBar);

      if (hasNavigationBar) {
        return 'bottom-16';
      } else {
        return 'bottom-8';
      }
    } else if (isIOS) {
      return 'bottom-8';
    }

    return 'bottom-8';
  }

  /**
   * Get bottom positioning styles for floating buttons
   * @returns Object with CSS styles for bottom positioning
   */
  getBottomButtonStyles(): { [key: string]: string } {
    // Si tenemos info de Flutter, usarla directamente
    if ((window as any).flutterAppInfo) {
      const flutterInfo = (window as any).flutterAppInfo;

      if (flutterInfo.platform === 'android') {
        const hasNavigationBar = flutterInfo.hasNavigationBar;

        if (hasNavigationBar) {
          return {
            'bottom': 'calc(max(env(safe-area-inset-bottom, 0px), 48px) + 32px)'
          };
        } else {
          return {
            'bottom': 'calc(max(env(safe-area-inset-bottom, 0px), 16px) + 32px)'
          };
        }
      } else if (flutterInfo.platform === 'ios') {
        return {
          'bottom': 'calc(env(safe-area-inset-bottom, 0px) + 32px)'
        };
      }
    }

    // Fallback para detección regular de navegador
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    if (isAndroid) {
      const hasNavigationBar = this.detectAndroidNavigationBarDirect();

      if (hasNavigationBar) {
        return {
          'bottom': 'calc(max(env(safe-area-inset-bottom, 0px), 48px) + 32px)'
        };
      } else {
        return {
          'bottom': 'calc(max(env(safe-area-inset-bottom, 0px), 16px) + 32px)'
        };
      }
    } else if (isIOS) {
      return {
        'bottom': 'calc(env(safe-area-inset-bottom, 0px) + 32px)'
      };
    }

    return {
      'bottom': '32px'
    };
  }
}
