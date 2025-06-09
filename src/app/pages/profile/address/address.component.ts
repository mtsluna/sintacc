import { Component } from '@angular/core';
import {BackButtonComponent} from "../../../shared/components/back-button/back-button.component";
import {Address} from '../../../interfaces/address';
import {provideIcons} from '@ng-icons/core';
import {matAddRound} from '@ng-icons/material-icons/round';
import {NextButtonComponent} from '../../../shared/components/next-button/next-button.component';
import {NgClass} from '@angular/common';

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

  selectedAddress: Address = {
    street: 'Avenida Paulista',
    number: '1000',
    extraInformation: '',
    observation: 'Esquina com a Rua da Consolação',
    latitude: '-23.5617',
    longitude: '-46.6552',
    city: 'São Paulo'
  }

  addresses: Array<Address> = [
    {
      street: 'Rua das Flores',
      number: '123',
      extraInformation: 'Apto 45',
      observation: 'Próximo ao mercado',
      latitude: '-23.5505',
      longitude: '-46.6333',
      city: 'São Paulo'
    },
    this.selectedAddress
  ]

  setSelectedAddress(address: Address) {
    this.selectedAddress = address;
  }
}
