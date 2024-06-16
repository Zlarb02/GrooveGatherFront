import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public isInverseTheme = false;

  constructor() {
    // Au démarrage, vérifie si le thème inversé est déjà activé (par exemple, via le localStorage)
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      this.isInverseTheme = true;
    }
    this.applyTheme(); // Appliquer le thème initial au démarrage
  }

  toggleTheme(isChecked: boolean) {
    this.isInverseTheme = isChecked;
    this.applyTheme();
    // Stocker le thème dans localStorage pour persister entre les sessions
    //localStorage.setItem('theme', this.isInverseTheme ? 'dark' : 'light');
  }

  public applyTheme() {
    const root = document.getElementsByTagName('body')[0];
    if (this.isInverseTheme) {
      root.style.setProperty('--bg', 'var( --user-inverse-bg)');
      root.style.setProperty('--color', 'var(--user-inverse-color)');
    } else {
      root.style.setProperty('--bg', 'var(--user-preferred-bg)');
      root.style.setProperty('--color', 'var(--user-preferred-color)');
    }
  }
}
