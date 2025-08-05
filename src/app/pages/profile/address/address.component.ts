import {Component, inject, OnInit} from '@angular/core';
import {BackButtonComponent} from "../../../shared/components/back-button/back-button.component";
import {Address} from '../../../interfaces/address';
import {provideIcons} from '@ng-icons/core';
import {matAddRound} from '@ng-icons/material-icons/round';
import {NextButtonComponent} from '../../../shared/components/next-button/next-button.component';
import {NgClass} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AddressService} from '../../../services/address/address.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-address',
  imports: [
    BackButtonComponent,
    NextButtonComponent,
    NgClass
  ],
  providers: [
    provideIcons({
      matAddRound,
    })
  ],
  templateUrl: './address.component.html',
  standalone: true,
  styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {

  addressService = inject(AddressService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  selectedAddress: Address | undefined;

  addresses: Array<Address> = [];
  loadingAddresses: boolean = true;

  setSelectedAddress(address: Address) {
    this.addressService.selectAddress(address.id, address.user_id).subscribe({
      next: (next: Address) => {
        this.addresses = this.addresses.map(a => ({...a, selected: a.id === next.id}));
      }
    })
  }

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.loadingAddresses = true;
    const userId = localStorage.getItem('userId');
    this.addresses = userId ? await firstValueFrom(this.addressService.getAddresses(userId)) : [];
    this.loadingAddresses = false;
  }

  async navigateToAddAddress() {
    await this.router.navigate(['/profile/address/add'], {
      queryParams: {
        from: this.router.url
      }
    });
    window.scrollTo(0, 0);
  }
}
