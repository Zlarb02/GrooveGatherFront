import { Component, inject, type OnInit } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import type { Subscription } from 'rxjs';
import { FooterComponent } from './core/footer/footer.component';
import { HeaderComponent } from './core/header/header.component';
import type { User } from './shared/models/user.model';
import { AuthService } from './shared/services/auth.service';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'GrooveGatherFront';
  currentPageTitle = '';
  actualUser: User = { name: '', mail: '', picture: '', isConnected: false };

  userIsConnected = false;

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
      this.authService.userIsConnected.subscribe(isConnected => this.actualUser.isConnected = isConnected),
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      this.authService.name.subscribe(name => this.actualUser.name = name),
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      this.authService.email.subscribe(email => this.actualUser.mail = email),
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      this.authService.picture.subscribe(picture => this.actualUser.picture = picture)
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
      default:
        this.currentPageTitle = 'GrooveGather';
    }
  }
}
