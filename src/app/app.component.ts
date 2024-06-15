import { Component, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
// biome-ignore lint/style/useImportType: <explanation>
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'GrooveGatherFront';

  constructor(private themeService: ThemeService) {
    // Appliquer le thème lors de la création du composant
    this.themeService.applyTheme();
  }

  ngOnInit(): void {
    // Vous pouvez également appliquer le thème ici si nécessaire
    this.themeService.applyTheme();
  }
}