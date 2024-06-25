import { Component } from '@angular/core';
import { AboutUsComponent } from '../../pages/about-us/about-us.component';
import { HomeComponent } from '../../pages/home/home.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

}
