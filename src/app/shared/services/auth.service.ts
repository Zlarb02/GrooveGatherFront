import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token = new BehaviorSubject<string>(this.getFromLocalStorage('token'));
  private _user = new BehaviorSubject<User>({} as User);

  token = this._token.asObservable();
  user = this._user.asObservable();

  constructor() {
    const token = this.getFromLocalStorage('token');
    if (token) {
      this.parseToken(token);
    }
  }

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
    this._user.next({
      name: '', mail: '', picture: '',
      id: -1,
      password: '',
      description: '',
      role: -1,
      subscription_level: -1,
      genres: []
    });
    localStorage.removeItem('token');
  }

  private parseToken(token: string) {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this._user.next({
          name: payload.name,
          mail: payload.email, // Adjust the payload property name if necessary
          picture: payload.picture,
          id: -1,
          password: '',
          description: '',
          role: -1,
          subscription_level: -1,
          genres: []
        });
      } catch (e) {
        console.error('Invalid token format', e);
        this.clearToken(); // Clear token if parsing fails
      }
    } else {
      this._user.next({
        name: '', mail: '', picture: '',
        id: -1,
        password: '',
        description: '',
        role: -1,
        subscription_level: -1,
        genres: []
      });
    }
  }
}
