import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private isInverseTheme = false;

  constructor() { }

  toggleTheme(isChecked: boolean) {
    this.isInverseTheme = isChecked;
    this.applyTheme();
  }

  private applyTheme() {
    const root = document.getElementsByTagName('body')[0];
    if (this.isInverseTheme) {
      root.style.setProperty('--bg', 'var(--user-inverse-bg)');
      root.style.setProperty('--color', 'var(--user-inverse-color)');
    } else {
      root.style.setProperty('--bg', 'var(--user-preferred-bg)');
      root.style.setProperty('--color', 'var(--user-preferred-color)');
    }
  }
}