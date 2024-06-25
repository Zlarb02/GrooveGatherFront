import { CommonModule } from '@angular/common';
import { Component, inject, type AfterViewInit, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  name = '';
  email = '';
  picture = '';
  userIsConnected = false;

  authService = inject(AuthService);
  router: Router = inject(Router);

  ngOnInit() {
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.userIsConnected.subscribe(isConnected => this.userIsConnected = isConnected);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.name.subscribe(name => this.name = name);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.email.subscribe(email => this.email = email);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.picture.subscribe(picture => this.picture = picture);
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
    this.router.navigate(['/']);
  }

  signOut() {
    this.authService.clearToken();
    this.router.navigate(['/']);

  }
}
