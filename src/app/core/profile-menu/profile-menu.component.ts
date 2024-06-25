import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import type { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css'
})
export class ProfileMenuComponent {

  @Input()
  actualUser!: User;

  authService: AuthService = inject(AuthService);

}
