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
    document.head.appendChild(script);
  }

  renderButton() {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '674011661072-mvs1hadt0jgppkfv76b5tkeroohqtbij.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this),
        auto_select: true,
        itp_support: true
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
      console.error('Google script not loaded.');
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
}