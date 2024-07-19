// biome-ignore lint/style/useImportType: <explanation>
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Api } from '../models/api';
import type { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token = new BehaviorSubject<string | null>(this.getFromLocalStorage('token'));
  private _user = new BehaviorSubject<User | null>(null);

  token = this._token.asObservable();
  user = this._user.asObservable();
  responseMessage = '';

  api = new Api();
  baseUrl = this.api.local;

  router: Router = inject(Router);

  constructor(private http: HttpClient) {
  }

  setToken(value: string) {
    this._token.next(value);
    this.parseToken(value);
  }

  setUser(user: User | null) {
    this._user.next(user);
    this.user = this._user.asObservable();
    if (user?.name) {
      this.router.navigate(['/profile']);
    }
  }

  private setToLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  private getFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  clearAllTokenCookies() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, ...rest] = cookie.split('=');
      if (name.trim() === 'token') {
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    }
    this._user.next(null);
  }


  private generatePassword(): string {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let password = "";
    let hasUpperCase = false;
    let hasNumber = false;
    let hasSymbol = false;

    while (password.length < length || !hasUpperCase || !hasNumber || !hasSymbol) {
      const char = charset.charAt(Math.floor(Math.random() * charset.length));
      password += char;

      if (char.match(/[A-Z]/)) hasUpperCase = true;
      if (char.match(/[0-9]/)) hasNumber = true;
      if (char.match(/[!@#$%^&*()_+~`|}{[\]:;?><,./-]/)) hasSymbol = true;
    }

    return password;
  }
  private parseToken(token: string) {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const password = this.generatePassword();
        const user: User = {
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          password: password,
          repeatedPassword: password,
          description: 'No description'
        };
        this.setUser(user);
      } catch (e) {
        console.error('Invalid token format', e);
        this.clearAllTokenCookies();
      }
    } else {
      this.clearAllTokenCookies();
    }
  }

  fetchUserInfo(email: string) {
    this.http.get<User>(`${this.baseUrl}/users/user?email=${email}`, { withCredentials: false })
      .subscribe(user => {
        this.setUser(user);
      }, error => {
        console.error('Failed to fetch user info', error);
        this.clearAllTokenCookies();
      });
  }

  register(user: User): Promise<void> {
    const url = `${this.baseUrl}/users/register`;

    return new Promise((resolve, reject) => {
      this.http.post(url, user, { withCredentials: false }).subscribe({
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        next: (response: any) => {
          console.table('User successfully logged in', response);
          this.responseMessage = 'User successfully logged in';


          const url = `${this.baseUrl}/users/login`;

          this.http.post(url, user, { withCredentials: true }).subscribe({
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            next: (response: any) => {
              console.table('User successfully logged in', response);
              this.responseMessage = 'User successfully logged in';
              if (user) {
                this.fetchUserInfo(user.email);
              }
              resolve();
            },
            error: (error) => {
              console.error('Error logging in user', error);
              this.responseMessage = `Error logging in user: ${error.message}`;
              this.clearAllTokenCookies();
              this._user.next(null);
              reject();
            },
            complete: () => {
              console.table('Request completed');
            }
          });

          resolve();

          this.router.navigate(['/search']);
        },
        error: (error) => {
          console.error('Error logging in user', error);
          this.responseMessage = `Error logging in user: ${error.message}`;
          this.clearAllTokenCookies();
          this._user.next(null);
          reject();
        },
        complete: () => {
          console.table('Request completed');
        }
      });
    });
  }

  fetchUserInfoFromGoogleToken(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.email;
      let password = this.getFromLocalStorage(email);

      if (!password) {
        password = this.generatePassword();
        this.setToLocalStorage(email, password);
      }

      const user: User = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        password: password,
        repeatedPassword: password,
        description: 'No description'
      };

      this.http.get<User>(`${this.baseUrl}/users/user?email=${email}`, { withCredentials: false })
        .subscribe(
          userFetched => {
            this.login(user);
            this.setUser(user);
          },
          error => {
            this.register(user);
            console.error('Failed to fetch user info from token', error);

            this.clearAllTokenCookies();
          }
        );
    } catch (e) {
      console.error('Invalid token format', e)
      this.clearAllTokenCookies();
    }
  }


  fetchUserInfoFromJwtToken(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.email;

      this.http.get<User>(`${this.baseUrl}/users/user?email=${email}`, { withCredentials: false })
        .subscribe(
          user => {
            this.setUser(user);
          },
          error => {
            console.error('Failed to fetch user info from token', error);

            this.clearAllTokenCookies();
          }
        );
    } catch (e) {
      console.error('Invalid token format', e)
      this.clearAllTokenCookies();
    }
  }

  login(user: User): Promise<void> {
    const url = `${this.baseUrl}/users/login`;

    return new Promise((resolve, reject) => {
      this.http.post(url, user, { withCredentials: true }).subscribe({
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        next: (response: any) => {
          console.table('User successfully logged in', response);
          this.responseMessage = 'User successfully logged in';

          this.fetchUserInfo(user.email);

          resolve();
        },
        error: (error) => {
          console.error('Error logging in user', error);
          this.responseMessage = `Error logging in user: ${error.message}`;
          this.clearAllTokenCookies();
          this._user.next(null);
          reject();
        },
        complete: () => {
          console.table('Request completed');
        }
      });
    });
  }



  validateToken(token: string) {
    this.http.get<User>(`${this.baseUrl}/users/logMe?token=${token}`)
      .subscribe(
        user => {
          this.setUser(user);
        },
        error => {
          console.error('Invalid token', error);

          this.clearAllTokenCookies();
        }
      );
  }
}
