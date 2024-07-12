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
  isChangePictureModalOpen = false;
  newPicture = '';

  avatars = [
    { url: 'https://cdn.pixabay.com/photo/2024/06/25/19/44/man-8853455_1280.png' },
    { url: 'https://cdn.pixabay.com/photo/2024/06/10/22/40/ai-generated-8821554_1280.png' },
    { url: 'https://cdn.pixabay.com/photo/2024/06/10/22/40/ai-generated-8821552_1280.png' },
    { url: 'https://cdn.pixabay.com/photo/2024/06/15/01/51/david-8830880_1280.png' },
    { url: 'https://cdn.pixabay.com/photo/2024/05/26/21/03/ai-generated-8789500_1280.png' },
    { url: 'https://cdn.pixabay.com/photo/2024/06/30/19/58/ai-generated-8863878_1280.png' },
    { url: 'https://cdn.pixabay.com/photo/2024/06/30/19/59/ai-generated-8863879_1280.png' },
    { url: 'https://cdn.pixabay.com/photo/2024/07/03/19/26/vincent-van-gogh-8870776_1280.png' },
    { url: 'https://cdn.pixabay.com/photo/2024/07/03/19/36/mona-lisa-8870805_1280.png' },
    { url: 'https://cdn.pixabay.com/photo/2024/06/30/19/57/ai-generated-8863876_1280.png' },
    { url: 'https://cdn.pixabay.com/photo/2024/06/30/19/57/ai-generated-8863877_1280.png' },
    { url: 'https://cdn.pixabay.com/photo/2024/06/22/20/09/ai-generated-8846960_1280.png' },
    { url: 'https://cdn.pixabay.com/photo/2024/06/22/20/10/ai-generated-8846961_1280.png' }
  ];



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

  openChangePictureModal() {
    this.isChangePictureModalOpen = true;
  }

  closeChangePictureModal() {
    this.isChangePictureModalOpen = false;
  }

  updatePreview() {
    // Cette méthode met à jour l'aperçu de l'image lorsque l'utilisateur saisit un lien
  }

  selectAvatar(url: string) {
    this.newPicture = url;
  }

  changePicture() {
    this.http.patch<User>(`https://groovegather-api.olprog-a.fr/api/v1/users?id=${this.user?.id}`, {
      picture: this.newPicture
    }).pipe(
      tap(response => {
        this.authService.setUser(response);
        this.closeChangePictureModal();
      }),
      catchError(error => {
        alert('Failed to update picture. Please try again.');
        return throwError(error);
      })
    ).subscribe();
  }

  deleteAccount() {
    this.http.delete(`https://groovegather-api.olprog-a.fr/api/v1/users?id=${this.user?.id}`)
  }
}

