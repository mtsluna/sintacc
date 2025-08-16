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
}
