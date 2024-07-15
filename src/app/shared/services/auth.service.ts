// biome-ignore lint/style/useImportType: <explanation>
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token = new BehaviorSubject<string | null>(this.getFromLocalStorage('token'));
  private _user = new BehaviorSubject<User | null>(null);

  token = this._token.asObservable();
  user = this._user.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getFromLocalStorage('token');
    const storedUser = this.getFromLocalStorage('user');
    if (token) {
      this.parseToken(token);
    }
    if (storedUser) {
      this._user.next(JSON.parse(storedUser));
    }
  }

  setToken(value: string) {
    this._token.next(value);
    this.setToLocalStorage('token', value);
    this.parseToken(value);
  }

  setUser(user: User | null) {
    this._user.next(user);
    this.user = this._user.asObservable();
    if (user) {
      this.setToLocalStorage('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
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
    this._user.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private parseToken(token: string) {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user: User = {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          id: -1,
          password: '',
          description: 'No description',
          role: -1,
          subscription_level: -1,
          genres: []
        };
        this.setUser(user);
      } catch (e) {
        console.error('Invalid token format', e);
        this.clearToken();
      }
    } else {
      this.clearToken();
    }
  }

  fetchUserInfo(email: string) {
    this.http.get<User>(`http://localhost:8080/api/v1/users/user?email=${email}`, { withCredentials: false })
      .subscribe(user => {
        this.setUser(user);
      }, error => {
        console.error('Failed to fetch user info', error);
        this.clearToken();
      });
  }
}
