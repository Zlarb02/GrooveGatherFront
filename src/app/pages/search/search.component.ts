import { Component } from '@angular/core';
import { SearchBarComponent } from '../../core/search-bar/search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '../../core/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchBarComponent, ReactiveFormsModule, FormsModule, ThemeToggleComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchPlaceholder = `Chercher projet par nom, tags ou nom d'utilisateur`;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  filters: any[] = [];
  isSortedAsc = true; // State for sort order

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onSearch(searchForm: any) {
    if (searchForm.valid) {
      console.table(searchForm.value);
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onSelectFilters(filters: any) {
    if (filters.valid) {
      console.table(filters.value);
    }
  }

  toggleSort() {
    this.isSortedAsc = !this.isSortedAsc; // Toggle sort order
    // Logic to fetch projects based on new sort order can be added here
    if (this.isSortedAsc) {
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log('Sorting by ascending order');
      // Fetch projects sorted by ascending order
    } else {
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log('Sorting by descending order');
      // Fetch projects sorted by descending order
    }
  }
}
