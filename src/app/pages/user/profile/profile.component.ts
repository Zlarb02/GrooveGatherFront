import { CommonModule } from '@angular/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import type { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user!: User | null;

  authService = inject(AuthService);
  router: Router = inject(Router);

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
  }

  editEmail() {
    // Logique pour éditer l'email
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('Edit email');
  }

  changePassword() {
    // Logique pour changer le mot de passe
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log('Change password');
  }

}
