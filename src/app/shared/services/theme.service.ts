import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public isInverseTheme = false;
  public isGlassMorphism = true;

  constructor() {
    // Vérifie si le thème inversé (sombre/clair) est déjà activé
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      this.isInverseTheme = true;
    }

    // Vérifie si le thème glass morphisme/sobre est déjà activé
    const storedUITheme = localStorage.getItem('ui-theme');
    if (storedUITheme === 'sober') {
      this.isGlassMorphism = false;
    }

    this.applyTheme(); // Applique les thèmes initiaux au démarrage
  }

  toggleTheme(isChecked: boolean) {
    this.isInverseTheme = isChecked;
    this.applyTheme();
    // Stocker le thème sombre/clair dans localStorage
    localStorage.setItem('theme', this.isInverseTheme ? 'dark' : 'light');
  }

  toggleUITheme(isChecked: boolean) {
    this.isGlassMorphism = isChecked;
    this.applyTheme();
    // Stocker le thème sobre/glass morphisme dans localStorage
    localStorage.setItem('ui-theme', this.isGlassMorphism ? 'glass' : 'sober');
  }

  public applyTheme() {
    const root = document.getElementsByTagName('body')[0];

    // Appliquer le thème sombre/clair
    if (this.isInverseTheme && !this.isGlassMorphism) {
      console.table('Sobre inversé');

      root.style.setProperty('--sober-bg', 'var(--user-inverse-bg)');
      root.style.setProperty('--bg', 'var(--user-inverse-bg)');
      root.style.setProperty('--bg-or-glass', 'var(--user-inverse-bg)');

      root.style.setProperty('--color', 'var(--user-inverse-color)');
      root.style.setProperty('--color-on-glass', 'var(--user-inverse-color)');
      root.style.setProperty('--color-on-bg', 'var(--light-color)');
      root.style.setProperty('--color-on-btn', 'var(--user-inverse-color)');

      root.style.setProperty('--bg-inverse', 'var(--sober-bg-inverse)');
      root.style.setProperty('--bg-inverse-or-glass', 'var(--sober-bg-inverse)');

      root.style.setProperty('--colored', 'var(--user-inverse-colored)');
      root.style.setProperty('--link', 'var(--user-inverse-link)');

      root.style.setProperty('--title-brightness', '80%');

      root.style.setProperty('--linear-gradient', 'var(--user-inverse-linear-gradient)');

      root.style.setProperty('--menu', 'var(--user-preferred-button)');

      root.style.setProperty('--button', 'var(--user-inverse-button)');
      root.style.setProperty('--edit-button', 'var(--user-inverse-edit-button)');
      root.style.setProperty('--edit-picture', 'var(--user-inverse-edit-picture)');
    } else if (!this.isInverseTheme && !this.isGlassMorphism) {
      console.table('Sobre préféré');

      root.style.setProperty('--sober-bg', 'var(--user-preferred-bg)');
      root.style.setProperty('--bg', 'var(--user-preferred-bg)');
      root.style.setProperty('--bg-or-glass', 'var(--user-preferred-bg)');

      root.style.setProperty('--color', 'var(--user-preferred-color)');
      root.style.setProperty('--color-on-glass', 'var(--user-preferred-color)');
      root.style.setProperty('--color-on-bg', 'var(--light-color)');
      root.style.setProperty('--color-on-btn', 'var(--user-preferred-color)');

      root.style.setProperty('--bg-inverse', 'var(--sober-bg-inverse)');
      root.style.setProperty('--bg-inverse-or-glass', 'var(--sober-bg-inverse)');

      root.style.setProperty('--colored', 'var(--user-preferred-colored)');
      root.style.setProperty('--link', 'var(--user-preferred-link)');

      root.style.setProperty('--title-brightness', '80%');

      root.style.setProperty('--linear-gradient', 'var(--user-preferred-linear-gradient)');

      root.style.setProperty('--menu', 'var(--user-inverse-button)');

      root.style.setProperty('--button', 'var(--user-preferred-button)');
      root.style.setProperty('--edit-button', 'var(--user-preferred-edit-button)');
      root.style.setProperty('--edit-picture', 'var(--user-preferred-edit-picture)');
    }

    // Appliquer le thème glass morphisme/sobre
    if (this.isGlassMorphism && this.isInverseTheme) {
      console.table('Glass morphisme-inversé');

      root.style.setProperty('--sober-bg', 'var(--user-inverse-bg)');
      root.style.setProperty('--bg', 'var(--user-inverse-linear-gradient)');
      root.style.setProperty('--bg-or-glass', 'var(--glass)');

      root.style.setProperty('--color', 'var(--user-inverse-color)');
      root.style.setProperty('--color-on-glass', 'var(--user-inverse-color)');
      root.style.setProperty('--color-on-bg', 'var(--user-inverse-color)');
      root.style.setProperty('--color-on-btn', 'var(--user-preferred-color)');

      root.style.setProperty('--bg-inverse', 'var(--colored-bg-inverse)');
      root.style.setProperty('--bg-inverse-or-glass', 'var(--thick-glass)');

      root.style.setProperty('--colored', 'var(--glass)');
      root.style.setProperty('--link', 'var(--color)');

      root.style.setProperty('--title-brightness', '80%');

      root.style.setProperty('--linear-gradient', 'var(--user-inverse-linear-gradient)');

      root.style.setProperty('--menu', 'var(--user-inverse-button)');

      root.style.setProperty('--button', 'var(--user-preferred-button)');
      root.style.setProperty('--edit-button', 'var(--user-preferred-edit-button)');
      root.style.setProperty('--edit-picture', 'var(--user-preferred-edit-picture)');;
    }
    else if (this.isGlassMorphism) {
      console.table('Glass morphisme-préféré');


      root.style.setProperty('--sober-bg', 'var(--user-preferred-bg)');
      root.style.setProperty('--bg', 'var(--user-preferred-linear-gradient)');
      root.style.setProperty('--bg-or-glass', 'var(--glass)');

      root.style.setProperty('--color', 'var(--user-preferred-color)');
      root.style.setProperty('--color-on-glass', 'var(--user-inverse-color)');
      root.style.setProperty('--color-on-bg', 'var(--user-preferred-color)');
      root.style.setProperty('--color-on-btn', 'var(--user-inverse-color)');

      root.style.setProperty('--bg-inverse', 'var(--colored-bg-inverse)');
      root.style.setProperty('--bg-inverse-or-glass', 'var(--thick-glass)');

      root.style.setProperty('--colored', 'var(--glass)');
      root.style.setProperty('--link', 'var(--color)');

      root.style.setProperty('--title-brightness', '300%');

      root.style.setProperty('--linear-gradient', 'var(--user-preferred-linear-gradient)');

      root.style.setProperty('--menu', 'var(--user-preferred-button)')

      root.style.setProperty('--button', 'var(--user-inverse-button)');
      root.style.setProperty('--edit-button', 'var(--user-inverse-edit-button)');
      root.style.setProperty('--edit-picture', 'var(--user-inverse-edit-picture)');

    }
  }
}
