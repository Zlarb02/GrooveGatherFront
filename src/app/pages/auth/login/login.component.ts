import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, type AfterViewInit, type OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { Api } from '../../../shared/models/api';
import type { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';

declare global {
  interface Window {    
    google: any;
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule], // Use ReactiveFormsModule instead of FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../signupLogin.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;

  user: User | null = {
    email: "", password: "", repeatedPassword: "", role: 0, subscription_level: 0
  };

  responseMessage = '';
  googleUserExist = false;

  userExists$: Subject<boolean> = new Subject<boolean>();

  authService = inject(AuthService);
  http = inject(HttpClient); // Using inject for HttpClient
  api = new Api();
  baseUrl = this.api.local;

  constructor(private fb: FormBuilder, private router: Router) { // Keep Router injection in constructor
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

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

  handleCredentialResponse(response: any) {
    this.authService.setToken(response.credential);
    this.authService.fetchUserInfoFromGoogleToken(response.credential);
  }

  signOut() {
    this.authService.clearAllTokenCookies();
    this.router.navigate(['/']);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      console.log('Form Value:', formValue);
      // Votre logique d'authentification ici
      this.postUser().then(() => {
        // Handle post-submit actions
      });
    } else {
      console.log('Form is invalid');
    }
  }

  postUser(): Promise<void> {
    const url = `${this.baseUrl}/users/login`;

    return new Promise((resolve, reject) => {
      this.http.post(url, this.user, { withCredentials: true }).subscribe({
        next: (response: any) => {
          console.table('User successfully logged in', response);
          this.responseMessage = 'User successfully logged in';
          if (this.user) {
            this.authService.fetchUserInfo(this.user.email);
          }
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
