import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentPage = '';
  definePageTitle(pageTitle: string) {
    console.table(`Page changed: ${pageTitle}`);
    switch (pageTitle) {
      case '/':
        this.currentPage = 'home';
        break;
      case '/search':
        this.currentPage = 'search';
        break;
      case '/create-project':
        this.currentPage = 'create';
        break;
      case '/notifications':
        this.currentPage = 'notif';
        break;
      case '/messages':
        this.currentPage = 'message';
        break;
      default:
        this.currentPage = '';
    }
  }
}
