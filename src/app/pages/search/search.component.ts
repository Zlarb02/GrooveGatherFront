import { Component, EventEmitter, Output, inject } from '@angular/core';
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
  searchPlaceholder = `Nom de projet, tag ou nom d'utilisateur`;

  filters: string[] = [];
  isSortedAsc = true; // State for sort order

  projects: Project[] = [];

  p = 1;
  itemsPerPage = 2;
  totalItems: number | undefined;

  projectService = inject(ProjectService);

  @Output() customEvent = new EventEmitter<string>();



  ngOnInit(): void {
    this.getProjects();
    this.sendPageNameToParent();
  }

  getProjects() {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.totalItems = this.projects.length;
    });
  }
  sendPageNameToParent() {
    this.customEvent.emit('Rechercher');
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

  sortOption = 'date'; // default sort option

  toggleSort() {
    this.isSortedAsc = !this.isSortedAsc; // Toggle sort order
    if (this.sortOption === 'date') {
      this.sortByDate();
    } else if (this.sortOption === 'popularity') {
      this.sortByPopularity();
    }
  }

  sortByDate() {
    if (this.isSortedAsc) {
      this.projects.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      this.projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }


  sortByPopularity() {
    if (this.isSortedAsc) {
      this.projects.sort((a, b) => a.likes - b.likes);
    } else {
      this.projects.sort((a, b) => b.likes - a.likes);
    }
  }

}
