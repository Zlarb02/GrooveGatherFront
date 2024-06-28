import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { Router, RouterLink } from '@angular/router';
import type { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent, RouterLink],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css'
})
export class ProfileMenuComponent {

  @Input()
  user!: User;

  authService: AuthService = inject(AuthService);

  constructor(private router: Router) { }

  signOut() {
    this.authService.clearToken();
    this.router.navigate(['/']);
  }
}
