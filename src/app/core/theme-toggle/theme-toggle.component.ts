import { Component, type OnInit } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css'],
  standalone: true
})
export class ThemeToggleComponent implements OnInit {

  isChecked = false;

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    // Initialisation de l'état de la case à cocher en fonction du thème actuel
    this.isChecked = this.themeService.isInverseTheme;
  }

  toggleTheme() {
    this.isChecked = !this.isChecked;
    this.themeService.toggleTheme(this.isChecked);
  }

}
