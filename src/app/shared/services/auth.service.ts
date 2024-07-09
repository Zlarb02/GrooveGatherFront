import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token = new BehaviorSubject<string | null>(this.getFromLocalStorage('token'));
  private _user = new BehaviorSubject<User | null>(null); // Définition de _user comme BehaviorSubject<User | null>

  token = this._token.asObservable();
  user = this._user.asObservable();

  constructor() {
    const token = this.getFromLocalStorage('token');
    const storedUser = this.getFromLocalStorage('user');
    if (token) {
      this.parseToken(token);
    }
    if (storedUser) {
      this._user.next(JSON.parse(storedUser)); // Initialisation de _user depuis le localStorage
    }
  }

  setToken(value: string) {
    this._token.next(value);
    this.setToLocalStorage('token', value);
    this.parseToken(value);
  }

  setUser(user: User | null) {
    this._user.next(user)// Mise à jour de _user avec la valeur fournie
    this.user = this._user.asObservable();
    if (user) {
      this.setToLocalStorage('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user'); // Suppression du user du localStorage si user est null
    }
  }

  private setToLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  private getFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  clearToken() {
    this._token.next('');
    this._user.next(null); // Réinitialisation de _user à null
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Suppression du user du localStorage
  }

  private parseToken(token: string) {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user: User = {
          name: payload.name,
          email: payload.email, // Ajuster si nécessaire
          picture: payload.picture,
          id: -1,
          password: '',
          description: 'No description',
          role: -1,
          subscription_level: -1,
          genres: []
        };
        this.setUser(user); // Utilisation de setUser pour mettre à jour _user et localStorage
      } catch (e) {
        console.error('Invalid token format', e);
        this.clearToken();
      }
    } else {
      this.clearToken();
    }
  }
}
