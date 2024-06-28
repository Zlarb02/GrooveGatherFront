import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
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

  user: User = { name: '', mail: '', picture: '', isConnected: false };

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
        break;
      case '/search':
        this.currentPageTitle = 'Rechercher';
        break;
      case '/landing-page':
        this.currentPageTitle = 'landingPage';
        break;
      default:
        this.currentPageTitle = 'GrooveGather';
    }
    if (this.currentPageTitle === 'landingPage') {
      this.landingPage = true;
    } else {
      this.landingPage = false;
    }
  }
}
