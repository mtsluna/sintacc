import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../constants/api';
import {Address} from '../../interfaces/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  httpClient = inject(HttpClient);

  constructor() { }

  getAddresses(userId?: string) {
    return this.httpClient.get<Address[]>(`${API_URL}/api/addresses/user/${userId}`);
  }

  postAddress(address: Address) {
    return this.httpClient.post<Address>(`${API_URL}/api/addresses`, address);
  }

  selectAddress(addressId: string, userId: string) {
    return this.httpClient.post<Address>(`${API_URL}/api/addresses/${addressId}/select`, {
      user_id: userId
    });
  }

  getSelectedAddress(userId: string) {
    return this.httpClient.get<Address>(`${API_URL}/api/addresses/user/${userId}/selected`);
  }

  verifyAddress(address: { latitude: number, longitude: number, address: string }) {
    return this.httpClient.post<{ valid: boolean }>(`${API_URL}/api/addresses/verify`, address);
  }
}
