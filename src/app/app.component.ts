import { Component, inject, type OnInit } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme.service';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';

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

  userIsConnected = false;

  themeService = inject(ThemeService)

  constructor(private router: Router) {
    // Appliquer le thème lors de la création du composant
    this.themeService.applyTheme();

    // S'abonner aux événements de navigation du router
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPageTitle = this.router.url;
        this.definePageTitle(this.currentPageTitle);
      }
    });
  }

  ngOnInit(): void {
    // Vous pouvez également appliquer le thème ici si nécessaire
    this.themeService.applyTheme();
  }

  definePageTitle(pageTitle: string) {
    console.table(`Page changed: ${pageTitle}`);
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
