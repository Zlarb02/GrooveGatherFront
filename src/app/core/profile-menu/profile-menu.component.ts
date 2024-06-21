import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css'
})
export class ProfileMenuComponent {
  menuVisible = false;

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

}


// Dans votre composant TypeScript
// export class AppComponent {
//   menuVisible: boolean = false;

//   toggleMenu() {
//     this.menuVisible = !this.menuVisible;
//   }
// }
