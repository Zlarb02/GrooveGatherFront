import { Component, inject, type OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

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

  ngOnInit() {
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.userIsConnected.subscribe(value => this.userIsConnected = value);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.name.subscribe(value => this.name = value);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.email.subscribe(value => this.email = value);
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    this.authService.picture.subscribe(value => this.picture = value);

    console.table(this.userIsConnected)
  }
}
