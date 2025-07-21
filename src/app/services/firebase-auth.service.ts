import {Injectable} from '@angular/core';
import {initializeApp} from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signInWithRedirect,
  UserCredential
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCbMbRabJtR-6thij8RMlYUyK6hS6a-XmQ',
  authDomain: 'barsac-app-793fe.firebaseapp.com',
  projectId: 'barsac-app-793fe',
  appId: '1:118857433538:web:e84e6b1fa82fae474a965b',
};

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private app = initializeApp(firebaseConfig);
  public auth = getAuth(this.app);

  async signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  async signInWithApple(): Promise<UserCredential | null> {
    const provider = new OAuthProvider('apple.com');
    if (/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)) {
      await signInWithRedirect(this.auth, provider);
      return null;
    } else {
      return signInWithPopup(this.auth, provider);
    }
  }

  async signInWithPhone(phoneNumber: string, appVerifier: any): Promise<string> {
    const provider = new PhoneAuthProvider(this.auth);
    return await provider.verifyPhoneNumber(phoneNumber, appVerifier);
  }

  async signInWithPhoneCode(verificationId: string, smsCode: string): Promise<UserCredential> {
    const credential = PhoneAuthProvider.credential(verificationId, smsCode);
    return signInWithCredential(this.auth, credential);
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  async signOut() {
    return this.auth.signOut();
  }

  async getIdToken(): Promise<string | null> {
    if (!this.auth.currentUser) return null;
    return await this.auth.currentUser.getIdToken();
  }
}
