import { CommonModule } from '@angular/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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


  ngOnInit() {
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.user.subscribe(value => this.user = value);
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
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('Edit name');
    // Logique pour éditer le nom

    this.isEditName = true;
  }

  validateName() {
    // Logique pour valider le nom
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('Validate name');

    this.isEditName = false;
  }

  editEmail() {
    // Logique pour éditer l'email
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('Edit email');

    this.isEditEmail = true;
  }

  validateEmail() {
    // Logique pour valider l'email
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('Validate email');

    this.isEditEmail = false;
  }

  changePassword() {
    // Logique pour changer le mot de passe
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('Change password');
  }

  deleteAccount() {
    // Logique pour supprimer le compte
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('Delete account');
  }
}
