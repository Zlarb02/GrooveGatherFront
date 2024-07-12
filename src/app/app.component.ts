import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import type { Subscription } from 'rxjs';
import { FooterComponent } from './core/footer/footer.component';
import { HeaderComponent } from './core/header/header.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import type { User } from './shared/models/user.model';
import { AuthService } from './shared/services/auth.service';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, HeaderComponent, RouterOutlet, FooterComponent, LandingPageComponent],
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'GrooveGatherFront';

  landingPage = true;

  currentPageTitle = '';

  user: User | null = {
    name: '', email: '', picture: '',
    id: -1,
    password: '',
    description: '',
    role: -1,
    subscription_level: -1,
    genres: []
  };

  private subscriptions: Subscription[] = [];

  themeService = inject(ThemeService);
  authService = inject(AuthService);

  constructor(private router: Router) {
    this.themeService.applyTheme();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPageTitle = this.router.url;
        this.definePageTitle(this.currentPageTitle);
      }
    });
  }

  ngOnInit(): void {
    this.themeService.applyTheme();
    this.authSubscriptions();
  }

  authSubscriptions() {
    this.subscriptions.push(
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      this.authService.user.subscribe(user => this.user = user),
    );
  }

  definePageTitle(pageTitle: string) {
    switch (pageTitle) {
      case '/':
        this.currentPageTitle = '';
        if (this.user?.name) {

          this.router.navigate(['/search']);
        } else {
          this.router.navigate(['/landing-page']);
        }
        break;
      case '/home':
        this.currentPageTitle = '';
        if (this.user?.name) {
          this.router.navigate(['/profile']);
        }
        break;
      case '/search':
        this.currentPageTitle = 'Rechercher';
        break;
      case '/landing-page':
        this.currentPageTitle = " ";
        break;
      case '/best-practices':
        this.currentPageTitle = 'Bonnes pratiques';
        break;
      case '/signup':
        this.currentPageTitle = "S'inscrire";
        break;
      case '/login':
        this.currentPageTitle = 'Se connecter';
        break;
      case '/profile':
        this.currentPageTitle = 'Mon profil';
        break;
      case '/settings':
        this.currentPageTitle = 'Paramètres';
        break;
      case '/my-projects':
        this.currentPageTitle = 'Mes projets';
        break;
      case '/create-project':
        this.currentPageTitle = 'Créer un projet';
        if (!this.user?.name) {
          this.router.navigate(['/login']);
        }
        break;
      case '/notification':
        this.currentPageTitle = 'Notifications';
        if (!this.user?.name) {
          this.router.navigate(['/login']);
        }
        break;
      case '/messages':
        this.currentPageTitle = 'Messagerie';
        if (!this.user?.name) {
          this.router.navigate(['/login']);
        }
        break;
      default:
        this.currentPageTitle = '';
    }
    if (this.currentPageTitle === " ") {
      this.landingPage = true;
    } else {
      this.landingPage = false;
    }
  }
}
