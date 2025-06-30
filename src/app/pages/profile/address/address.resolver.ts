import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {AddressService} from '../../../services/address/address.service';
import {Address} from '../../../interfaces/address';

export const addressResolver: ResolveFn<Array<Address>>
  = async (route, _) => {

  const addressService = inject(AddressService);

  return await firstValueFrom(addressService.getAddresses('79f72af8-4aac-46da-8a49-c2314caebb13'))
};
