import {AfterViewInit, Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {BackButtonComponent} from '../../../../shared/components/back-button/back-button.component';
import {NextButtonComponent} from '../../../../shared/components/next-button/next-button.component';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AddressService} from '../../../../services/address/address.service';
import {Address} from '../../../../interfaces/address';
import {ActivatedRoute, Router} from '@angular/router';
import {SafeAreaService} from '../../../../services/safe-area/safe-area.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-edit',
  imports: [
    BackButtonComponent,
    NextButtonComponent,
    ReactiveFormsModule,
    MapMarker,
    GoogleMap,
    NgClass
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
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  safeAreaService = inject(SafeAreaService);

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
  isAddressVerified = signal<boolean | null>(null);
  isVerifying = signal(false);

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

            // Verificar la dirección
            this.verifyAddress();
          } else {
            this.selectedAddress.set(null);
            this.isAddressValid.set(false);
            this.isAddressVerified.set(null);
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

  verifyAddress() {
    const formValue = this.formGroup.getRawValue();
    if (formValue.latitude && formValue.longitude && formValue.address) {
      this.isVerifying.set(true);
      this.addressService.verifyAddress({
        latitude: formValue.latitude,
        longitude: formValue.longitude,
        address: formValue.address
      }).subscribe({
        next: (result) => {
          this.isAddressVerified.set(result.valid);
          this.isVerifying.set(false);
        },
        error: (err) => {
          console.error('Error verifying address:', err);
          this.isAddressVerified.set(false);
          this.isVerifying.set(false);
        }
      });
    }
  }

  save() {
    const userId = localStorage.getItem('userId');

    return this.isAddressValid() && this.formGroup.valid && this.isAddressVerified() === true
      ? () => {
        this.addressService.postAddress({
          ...this.formGroup.getRawValue(),
          user_id: userId,
          selected: true
        } as unknown as Address).subscribe({
          next: async (address: Address) => {
            console.log('Address saved:', address);
            this.formGroup.reset();
            this.formGroup.setErrors(null);
            this.selectedAddress.set(null);

            const from = this.activatedRoute.snapshot.queryParamMap.get('from') || '/';
            await this.router.navigateByUrl(from);
            window.scrollTo(0, 0);
          },
          error: (err) => {
            console.error('Error saving address:', err);
          }
        })
      }
      : () => {
      }
  }

  getButtonPositionClass(): string {
    return this.safeAreaService.getBottomButtonPosition();
  }

  scrollToInput(element: HTMLElement) {
    setTimeout(() => {
      // Detectar si el teclado ya está abierto
      const isKeyboardOpen = window.visualViewport ?
        window.visualViewport.height < window.innerHeight :
        false;

      // posición absoluta del elemento en la página
      const elementTop = element.getBoundingClientRect().top + window.scrollY;

      // Si el teclado ya está abierto, usar un offset menor para evitar scroll innecesario
      const offset = isKeyboardOpen ? 20 : 100;

      // Solo hacer scroll si el elemento no está visible o está muy cerca del borde
      const viewportTop = window.scrollY;
      // Usar siempre la altura completa de la ventana, no la reducida por el teclado
      const viewportHeight = window.innerHeight;
      const viewportBottom = viewportTop + viewportHeight;
      const elementBottom = elementTop + element.offsetHeight;

      // Verificar si el elemento ya está visible en el viewport completo
      const isElementVisible = elementTop >= viewportTop + offset &&
        elementBottom <= viewportBottom - 50;

      if (!isElementVisible) {
        window.scrollTo({
          top: elementTop - offset,
          behavior: 'smooth'
        });
      }
    }, 200);
  }
}
