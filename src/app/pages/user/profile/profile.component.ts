import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userIsConnected!: boolean;
  name = '';
  email = '';
  picture = '';

  authService = inject(AuthService);
  router: Router = inject(Router);

  ngOnInit() {
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.userIsConnected.subscribe(value => this.userIsConnected = value);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.name.subscribe(value => this.name = value);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.email.subscribe(value => this.email = value);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.picture.subscribe(value => this.picture = value);

    if (!this.name)

      this.router.navigate(['/login']);
  }
}
