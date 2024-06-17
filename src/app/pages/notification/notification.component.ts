import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../../core/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {

}
