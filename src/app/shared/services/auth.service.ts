import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsConnected = new BehaviorSubject<boolean>(this.getFromLocalStorage('userIsConnected') === 'true');
  private _name = new BehaviorSubject<string>(this.getFromLocalStorage('name'));
  private _email = new BehaviorSubject<string>(this.getFromLocalStorage('email'));
  private _picture = new BehaviorSubject<string>(this.getFromLocalStorage('picture'));

  userIsConnected = this._userIsConnected.asObservable();
  name = this._name.asObservable();
  email = this._email.asObservable();
  picture = this._picture.asObservable();

  setUserIsConnected(value: boolean) {
    this._userIsConnected.next(value);
    this.setToLocalStorage('userIsConnected', value.toString());
  }

  setName(value: string) {
    this._name.next(value);
    this.setToLocalStorage('name', value);
  }

  setEmail(value: string) {
    this._email.next(value);
    this.setToLocalStorage('email', value);
  }

  setPicture(value: string) {
    this._picture.next(value);
    this.setToLocalStorage('picture', value);
  }

  private setToLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  private getFromLocalStorage(key: string): string {
    return localStorage.getItem(key) || '';
  }

  clearUserData() {
    this.setUserIsConnected(false);
    this.setName('');
    this.setEmail('');
    this.setPicture('');
    localStorage.clear();
  }
}
