import { CommonModule } from '@angular/common';
import { Component, type AfterViewInit, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import type { Subscription } from 'rxjs';

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    google: any;
  }
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})

export class AuthComponent implements AfterViewInit {
  userIsConnected!: boolean;
  name = '';
  email = '';
  picture = '';

  authService = inject(AuthService);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.subscriptions.push(
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      this.authService.name.subscribe(name => this.name = name),
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      this.authService.email.subscribe(email => this.email = email),
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      this.authService.picture.subscribe(picture => this.picture = picture)
    );
  }

  ngAfterViewInit() {
    this.initializeGoogleSignIn();
  }

  ngOnDestroy() {
    // biome-ignore lint/complexity/noForEach: <explanation>
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
        login_uri: "/profile",
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
    const data = JSON.parse(atob(response.credential.split('.')[1]));
    this.authService.setUserIsConnected(true);
    this.authService.setName(data.name);
    this.authService.setEmail(data.email);
    this.authService.setPicture(data.picture);
  }
  signOut() {
    this.authService.clearUserData();
  }
}