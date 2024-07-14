import { Component } from '@angular/core';
import { SoberGlassToggleComponent } from '../../core/sober-glass-toggle/sober-glass-toggle.component';
import { ThemeToggleComponent } from '../../core/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [ThemeToggleComponent, SoberGlassToggleComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {

}
