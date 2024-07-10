import { CommonModule } from '@angular/common';
// biome-ignore lint/style/useImportType: <explanation>
import { HttpClient } from '@angular/common/http';
import { Component, type OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import type { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user!: User | null;

  authService = inject(AuthService);
  router: Router = inject(Router);
  isEditName = false;
  isEditEmail = false;
  nameInput = this.user?.name;
  mailInput = this.user?.email;

  isChangePasswordModalOpen = false;
  newPassword = '';
  confirmPassword = '';

  http = inject(HttpClient);


  ngOnInit() {
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.user.subscribe(value => this.user = value);
    this.nameInput = this.user?.name;
    this.mailInput = this.user?.email;
  }

  signOut() {
    this.authService.clearToken();
    this.router.navigate(['/home']);
  }

  editPicture() {
    // Logique pour éditer la photo de profil
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('Edit picture');
  }

  editName() {
    this.isEditName = true;
  }

  validateName() {
    this.http.patch<User>(`https://groovegather-api.olprog-a.fr/api/v1/users?id=${this.user?.id}`, {
      name: this.nameInput
    }).pipe(
      tap(response => {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log('Name updated successfully', response);
        // Mettre à jour les informations de l'utilisateur dans AuthService
        this.authService.setUser(response);
        this.isEditName = false;
      }),
      catchError(error => {
        console.error('Error updating name', error);
        alert('Failed to update name. Please try again.');
        return throwError(error);
      })
    ).subscribe();
  }

  editEmail() {
    this.isEditEmail = true;
  }

  validateEmail() {
    this.http.patch(`https://groovegather-api.olprog-a.fr/api/v1/users?id=${this.user?.id}`, {
      email: this.mailInput
    }).pipe(
      tap(response => {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log('Email updated successfully', response);
        // Récupérer les nouvelles valeurs depuis le backend
        const updatedUser: User = response as User;
        this.authService.setUser(updatedUser);
        this.isEditEmail = false;
      }),
      catchError(error => {
        console.error('Error updating email', error);
        alert('Failed to update email. Please try again.');
        return throwError(error);
      })
    ).subscribe();
  }

  openChangePasswordModal() {
    this.isChangePasswordModalOpen = true;
  }

  closeChangePasswordModal() {
    this.isChangePasswordModalOpen = false;
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    this.http.patch(`https://groovegather-api.olprog-a.fr/api/v1/users?id=${this.user?.id}`, {
      "password": `${this.newPassword}`,
      "repeatedPassword": `${this.confirmPassword}`
    }).pipe(
      tap(response => {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log('Password changed successfully', response);
        this.closeChangePasswordModal();
      }),
      catchError(error => {
        console.error('Error changing password', error);
        alert('Failed to change password. Please try again.');
        return throwError(error);
      })
    ).subscribe();
  }

  deleteAccount() {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('Delete account');
    // Logique pour supprimer le compte
  }
}