// biome-ignore lint/style/useImportType: <explanation>
import { Component, ViewChild, type ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @ViewChild('ham') ham!: ElementRef;

  closeMenu() {
    this.ham.nativeElement.classList.remove('active');
  }
}
