import { Component, Input } from '@angular/core';
import { SearchComponent } from '../../pages/search/search.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [SearchComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Input()
  placeholder = "search";
}
