import {Component, inject} from '@angular/core';
import {BackButtonComponent} from "../../../shared/components/back-button/back-button.component";
import {Address} from '../../../interfaces/address';
import {provideIcons} from '@ng-icons/core';
import {matAddRound} from '@ng-icons/material-icons/round';
import {NextButtonComponent} from '../../../shared/components/next-button/next-button.component';
import {NgClass} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AddressService} from '../../../services/address/address.service';

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
export class AddressComponent {

  addressService = inject(AddressService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  selectedAddress: Address | undefined;

  addresses: Array<Address> = [];

  setSelectedAddress(address: Address) {
    this.addressService.selectAddress(address.id, address.user_id).subscribe({
      next: (next: Address) => {
        this.addresses = this.addresses.map(a => ({...a, selected: a.id === next.id}));
      }
    })
  }

  constructor() {

    this.activatedRoute.data.subscribe({
      next: (data) => {
        this.addresses = data['addresses'] || [];
        this.selectedAddress = this.addresses[0];
      },
      error: (err) => {
        console.error('Error loading catalog data:', err);
      }
    })
  }

  async navigateToAddAddress() {
    await this.router.navigate(['/profile/address/add'], {
      queryParams: {
        from: this.activatedRoute.snapshot.queryParamMap.get('from') || '/'
      }
    });
  }
}
