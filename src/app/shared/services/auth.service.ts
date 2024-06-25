import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token = new BehaviorSubject<string>(this.getFromLocalStorage('token'));
  private _userIsConnected = new BehaviorSubject<boolean>(!!this.getFromLocalStorage('token'));
  private _name = new BehaviorSubject<string>('');
  private _email = new BehaviorSubject<string>('');
  private _picture = new BehaviorSubject<string>('');

  token = this._token.asObservable();
  userIsConnected = this._userIsConnected.asObservable();
  name = this._name.asObservable();
  email = this._email.asObservable();
  picture = this._picture.asObservable();

  setToken(value: string) {
    this._token.next(value);
    this.setToLocalStorage('token', value);
    this._userIsConnected.next(!!value);
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
    this._userIsConnected.next(false);
    this._name.next('');
    this._email.next('');
    this._picture.next('');
    localStorage.removeItem('token');
  }

  private parseToken(token: string) {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this._name.next(payload.name);
      this._email.next(payload.email);
      this._picture.next(payload.picture);
    }
  }
}
