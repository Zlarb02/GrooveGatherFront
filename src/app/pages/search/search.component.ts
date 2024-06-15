import { Component } from '@angular/core';
import { SearchBarComponent } from '../../core/search-bar/search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchBarComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  onSubmit(searchForm: any) {
    if (searchForm.valid) {
      console.table(searchForm.value);
    }
  }
}
