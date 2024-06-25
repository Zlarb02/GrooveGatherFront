import { Component, Input } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import type { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenuComponent, ProfileMenuComponent, SearchBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() pageTitle!: string;
  @Input() actualUser!: User;
}