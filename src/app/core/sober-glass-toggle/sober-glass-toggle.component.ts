import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { ThemeService } from '../../shared/services/theme.service';

@Component({
  selector: 'app-sober-glass-toggle',
  standalone: true,
  templateUrl: './sober-glass-toggle.component.html',
  styleUrl: './sober-glass-toggle.component.css',
  imports: [CommonModule],
})
export class SoberGlassToggleComponent {

  isChecked = false;
  isSunglasses = true;

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    // Initialisation de l'état de la case à cocher en fonction du thème actuel
    this.isChecked = this.themeService.isGlassMorphism;
    this.isSunglasses = this.themeService.isGlassMorphism;
  }

  toggleUITheme() {
    this.isChecked = !this.isChecked;
    this.themeService.toggleUITheme(this.isChecked);
  }

}
