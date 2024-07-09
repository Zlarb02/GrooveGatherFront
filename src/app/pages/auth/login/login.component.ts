import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, type AfterViewInit, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import type { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    google: any;
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../signupLogin.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  user: User | null = {
    email: "", password: "", repeatedPassword: "", role: 0, subscription_level: 0
  };
  responseMessage = '';
  googleUserExist = false;

  userExists$: Subject<boolean> = new Subject<boolean>();

  authService = inject(AuthService);
  router: Router = inject(Router);
  http = inject(HttpClient);

  ngOnInit() {
    this.authService.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngAfterViewInit() {
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.renderButton();
    };
    script.onerror = () => {
      console.error('Failed to load the Google script. Retrying...');
      setTimeout(() => this.initializeGoogleSignIn(), 3000); // Retry after 3 seconds
    };
    document.head.appendChild(script);
  }

  renderButton() {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '674011661072-mvs1hadt0jgppkfv76b5tkeroohqtbij.apps.googleusercontent.com',
        auto_select: true,
        itp_support: true,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        callback: (response: any) => this.handleCredentialResponse(response),
      });

      window.google.accounts.id.renderButton(
        document.querySelector('.g_id_signin'),
        {
          type: 'standard',
          shape: 'pill',
          theme: 'outline',
          text: 'signin_with',
          size: 'large',
          logo_alignment: 'left'
        }
      );
    } else {
      console.error('Google script not loaded. Retrying...');
      setTimeout(() => this.renderButton(), 3000); // Retry after 3 seconds
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  handleCredentialResponse(response: any) {
    this.authService.setToken(response.credential);
    this.googleLogIn();
    this.router.navigate(['/search']);
  }

  signOut() {
    this.authService.clearToken();
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.postUser(false).then(() => {
    });
    this.router.navigate(['/search']);
  }

  googleLogIn() {
    this.getGoogleUserWhereMailIs();
    this.userExists$.subscribe(userExists => {
      this.googleUserExist = userExists;
      if (userExists) {
        this.responseMessage = 'User already exists. Please login.';
      } else {
        this.postUser(true).then(() => {
          this.authService.setUser(this.user);
        });
      }
    });
  }

  getGoogleUserWhereMailIs() {
    this.http.get(`https://groovegather-api.olprog-a.fr/api/v1/users/google?email=${this.user?.email}`).subscribe({
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      next: (response: any) => {
        console.table('User already exists', response);
        this.responseMessage = 'User exists';
        this.userExists$.next(true);
      },
      error: (error) => {
        if (error.status === 404) {
          this.userExists$.next(false);
        } else {
          console.error('Error checking user existence', error);
          this.responseMessage = `Error checking user existence: ${error.message}`;
        }
      },
      complete: () => {
        console.table('Request completed');
      }
    });
  }

  postUser(isGoogle: boolean): Promise<void> {
    let url = 'https://groovegather-api.olprog-a.fr/api/v1/users';
    if (isGoogle) {
      url += '?isGoogle=true';
    }
    return new Promise((resolve, reject) => {
      this.http.post(url, this.user).subscribe({
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        next: (response: any) => {
          console.table('User successfully logged in', response);
          this.responseMessage = 'User successfully logged in';

          this.authService.setUser(response);
          resolve();
        },
        error: (error) => {
          console.error('Error logging in user', error);
          this.responseMessage = `Error logging in user: ${error.message}`;
          reject();
        },
        complete: () => {
          console.table('Request completed');
        }
      });
    });
  }
}
