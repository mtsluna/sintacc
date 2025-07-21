import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../interfaces/user';
import {API_URL} from '../constants/api';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  registerUser(idToken: string): Observable<User> {
    return this.http.post<User>(`${API_URL}/api/users`, {}, {
      headers: { 'x-id-token': idToken }
    });
  }
}

