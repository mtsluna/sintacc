import {AfterViewInit, Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {BackButtonComponent} from '../../../../shared/components/back-button/back-button.component';
import {NextButtonComponent} from '../../../../shared/components/next-button/next-button.component';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AddressService} from '../../../../services/address/address.service';
import {Address} from '../../../../interfaces/address';

@Component({
  selector: 'app-edit',
  imports: [
    BackButtonComponent,
    NextButtonComponent,
    ReactiveFormsModule,
    MapMarker,
    GoogleMap
  ],
  templateUrl: './address-edit.component.html',
  styleUrl: './address-edit.component.scss'
})
export class AddressEditComponent implements AfterViewInit {
  @ViewChild('addressInput') addressInput!: ElementRef<HTMLInputElement>;
  formGroup = new FormGroup({
    address: new FormControl('', {nonNullable: true}),
    detail: new FormControl(''),
    reference: new FormControl(''),
    latitude: new FormControl(0),
    longitude: new FormControl(0),
  })

  addressService = inject(AddressService);

  center: google.maps.LatLngLiteral = {
    lat: this.formGroup.get('latitude')?.value === 0
      ? -32.889728248360136
      : +(this.formGroup.get('latitude')?.value || 0),
    lng: this.formGroup.get('longitude')?.value === 0
      ? -68.84455365369566
      : +(this.formGroup.get('longitude')?.value || 0)
  };

  isAddressValid = signal(false);
  selectedAddress = signal<string | null>(null);
  isGoogleReady = signal(false);

  ngAfterViewInit() {
    this.formGroup.setErrors({addressMismatch: true});

    const waitForGoogle = setInterval(() => {
      if ((window as any).google && google.maps && google.maps.places) {
        clearInterval(waitForGoogle);
        this.isGoogleReady.set(true);

        const autocomplete = new google.maps.places.Autocomplete(
          this.addressInput.nativeElement,
          {
            types: ['geocode'],
            componentRestrictions: {country: 'ar'}
          }
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          if (place.geometry && place.formatted_address && place.geometry.location) {
            this.selectedAddress.set(place.formatted_address);
            this.isAddressValid.set(true);

            this.formGroup.patchValue({
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              address: place.formatted_address
            })

            this.center = {
              lat: +(this.formGroup.get('latitude')?.value || 0),
              lng: +(this.formGroup.get('longitude')?.value || 0)
            };
          } else {
            this.selectedAddress.set(null);
            this.isAddressValid.set(false);
          }


        });
      }
    }, 100);

    this.formGroup.valueChanges.subscribe(value => {
      if (this.selectedAddress() !== value.address) {
        this.formGroup.get('address')?.setErrors({addressMismatch: true});
      }
    })
  }

  save() {
    return this.isAddressValid() && this.formGroup.valid
      ? () => {
        this.addressService.postAddress({
          ...this.formGroup.getRawValue(),
          user_id: '79f72af8-4aac-46da-8a49-c2314caebb13',
          selected: false
        } as unknown as Address).subscribe({
          next: (address: Address) => {
            console.log('Address saved:', address);
            this.formGroup.reset();
            this.formGroup.setErrors(null);
            this.selectedAddress.set(null);
          },
          error: (err) => {
            console.error('Error saving address:', err);
          }
        })
      }
      : () => {
      }
  }
}
