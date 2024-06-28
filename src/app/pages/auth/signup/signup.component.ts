import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../signupLogin.css']
})
export class SignupComponent {
  user!: User;

  authService = inject(AuthService);
  router: Router = inject(Router);

  ngOnInit() {
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.user.subscribe(user => this.user = user);
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
    this.router.navigate(['/search']);
  }

  signOut() {
    this.authService.clearToken();
    this.router.navigate(['/']);
  }
}
