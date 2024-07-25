import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { Api } from '../../../shared/models/api';
import type { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../signupLogin.css']
})
export class SignupComponent {
  user: User | null = {
    name: "",
    email: "", password: "", repeatedPassword: "", role: 0, subscription_level: 0
  };
  responseMessage = '';
  googleUserExist = false;

  errorMessage = '';

  userExists$: Subject<boolean> = new Subject<boolean>();



  authService = inject(AuthService);
  router: Router = inject(Router);
  http = inject(HttpClient);
  api = new Api();
  baseUrl = this.api.prod;

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
    this.authService.fetchUserInfoFromGoogleToken(response.credential); // Utiliser le token Google comme password pour le fetch
  }
  signOut() {
    this.authService.clearAllTokenCookies();
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.errorMessage = ''; // Réinitialiser le message d'erreur

    // Vérifications de base des champs
    if (!this.user?.name) {
      this.errorMessage += 'Le nom est requis. ';
    }
    if (!this.user?.email) {
      this.errorMessage += "L'email est requise. ";
    }
    if (!this.user?.password) {
      this.errorMessage += 'Le mot de passe est requis. ';
    }

    // Vérification des mots de passe identiques
    if (this.user?.password !== this.user?.repeatedPassword) {
      this.errorMessage += 'Les mots de passe ne correspondent pas.';
    }

    // Si le message d'erreur n'est pas vide, ne pas soumettre le formulaire
    if (this.errorMessage) {
      return;
    }

    // Si aucune erreur, procéder à l'envoi des données utilisateur
    this.postUser().then(() => {
      // Logique après l'enregistrement de l'utilisateur, par exemple, redirection
      this.router.navigate(['/search']);
    });
  }


  postUser(): Promise<void> {
    const url = `${this.baseUrl}/users/register`;

    return new Promise((resolve, reject) => {
      this.http.post(url, this.user, { withCredentials: false }).subscribe({
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        next: (response: any) => {
          console.table('User successfully logged in', response);
          this.responseMessage = 'User successfully logged in';


          const url = `${this.baseUrl}/users/login`;

          this.http.post(url, this.user, { withCredentials: true }).subscribe({
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

          resolve();

          this.router.navigate(['/search']);
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
