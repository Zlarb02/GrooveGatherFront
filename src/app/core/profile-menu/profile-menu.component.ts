import { CommonModule } from '@angular/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { Router, RouterLink } from '@angular/router';
import type { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';
import { SoberGlassToggleComponent } from '../sober-glass-toggle/sober-glass-toggle.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent, RouterLink, SoberGlassToggleComponent],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css'
})
export class ProfileMenuComponent {

  @Input()
  user!: User | null;

  @ViewChild('toggleMenu') toggleMenu!: ElementRef;
  authService: AuthService = inject(AuthService);

  constructor(private router: Router) { }

  signOut() {
    this.authService.clearAllTokenCookies();
    this.router.navigate(['/home']);
    this.closeMenu(); // Close menu after signing out
  }

  closeMenu() {
    this.toggleMenu.nativeElement.checked = false;
  }
}
