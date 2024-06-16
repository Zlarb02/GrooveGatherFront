import { Component, inject } from '@angular/core';
import { SearchBarComponent } from '../../core/search-bar/search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectCardComponent } from '../../core/project-card/project-card.component';
import { ProjectService } from '../../shared/services/project.service';
import type { Project } from '../../shared/models/project.model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchBarComponent, ReactiveFormsModule, FormsModule, ProjectCardComponent, CommonModule, NgxPaginationModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchPlaceholder = `Chercher projet par nom, tags ou nom d'utilisateur`;

  filters: string[] = [];
  isSortedAsc = true; // State for sort order

  projects: Project[] = [];

  p = 1;
  itemsPerPage = 5;
  totalItems: number | undefined;

  projectService = inject(ProjectService);

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.totalItems = this.projects.length;
    });
  }


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
