import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token = new BehaviorSubject<string>(this.getFromLocalStorage('token'));
  private _user = new BehaviorSubject<User>({} as User);

  token = this._token.asObservable();
  user = this._user.asObservable();

  setToken(value: string) {
    this._token.next(value);
    this.setToLocalStorage('token', value);
    this.parseToken(value);
  }

  private setToLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  private getFromLocalStorage(key: string): string {
    return localStorage.getItem(key) || '';
  }

  clearToken() {
    this._token.next('');
    this._user.next({ name: '', mail: '', picture: '', isConnected: false });
    localStorage.removeItem('token');
  }

  private parseToken(token: string) {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this._user.next({
        name: payload.name,
        mail: payload.email, // Adjust the payload property name if necessary
        picture: payload.picture,
        isConnected: true
      });
    }
  }
}
