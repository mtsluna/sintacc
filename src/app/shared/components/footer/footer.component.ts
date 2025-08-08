import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { DeleteAccountModalComponent } from '../delete-account-modal/delete-account-modal.component';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink,
    DeleteAccountModalComponent
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  isLoggedIn = false;
  showDeleteModal = false;

  ngOnInit() {
    this.listenToAuthState();
  }

  listenToAuthState() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user: User | null) => {
      this.isLoggedIn = !!user;
    });
  }

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }
}
