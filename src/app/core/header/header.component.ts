import { Component, Input } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenuComponent, ProfileMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() pageTitle!: string;
}