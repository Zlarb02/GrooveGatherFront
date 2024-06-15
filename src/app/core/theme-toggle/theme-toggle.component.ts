import { Component, OnInit } from '@angular/core';
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
  }

  toggleTheme() {
    this.isChecked = !this.isChecked;
    this.themeService.toggleTheme(this.isChecked);
  }

}