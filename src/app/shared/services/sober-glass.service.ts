import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoberGlassService {

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
    localStorage.setItem('theme', this.isInverseTheme ? 'dark' : 'light');
  }

  public applyTheme() {
    const root = document.getElementsByTagName('body')[0];
    if (this.isInverseTheme) {
      root.style.setProperty('--bg', 'var( --user-inverse-bg)');
      root.style.setProperty('--color', 'var(--user-inverse-color)');
      root.style.setProperty('--link', 'var(--user-inverse-link)');
      root.style.setProperty('--colored', 'var(--user-inverse-colored)');
      root.style.setProperty('--linear-gradient', 'var(--user-inverse-linear-gradient)');
      root.style.setProperty('--button', 'var(--user-inverse-button)');
      root.style.setProperty('--edit-button', 'var(--user-inverse-edit-button)');
      root.style.setProperty('--edit-picture', 'var(--user-inverse-edit-picture)');
    } else {
      root.style.setProperty('--bg', 'var(--user-preferred-bg)');
      root.style.setProperty('--color', 'var(--user-preferred-color)');
      root.style.setProperty('--link', 'var(--user-preferred-link)');
      root.style.setProperty('--colored', 'var(--user-preferred-colored)');
      root.style.setProperty('--linear-gradient', 'var(--user-preferred-linear-gradient)');
      root.style.setProperty('--button', 'var(--user-preferred-button)');
      root.style.setProperty('--edit-button', 'var(--user-preferred-edit-button)');
      root.style.setProperty('--edit-picture', 'var(--user-preferred-edit-picture)');
    }
  }
}
