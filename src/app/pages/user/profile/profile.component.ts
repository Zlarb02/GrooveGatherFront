import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user!: User;

  authService = inject(AuthService);
  router: Router = inject(Router);

  ngOnInit() {
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.user.subscribe(value => this.user = value);

    // if (!this.name)

    //   this.router.navigate(['/login']);
  }
}
