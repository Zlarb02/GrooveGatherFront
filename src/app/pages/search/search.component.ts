import { Component, inject } from '@angular/core';
import { SearchBarComponent } from '../../core/search-bar/search-bar.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectCardComponent } from '../../core/project-card/project-card.component';
import { ProjectService } from '../../shared/services/project.service';
import type { Project } from '../../shared/models/project.model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import type { skillName } from '../../shared/models/skill-name';
import { SkillNamesList } from '../../shared/models/skill-names-list';
import { MatAutocomplete, MatOption, MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs';
import { genresList } from '../../shared/models/genres-list';
import type { Genre } from '../../shared/models/genre';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchBarComponent, ReactiveFormsModule, FormsModule, ProjectCardComponent, CommonModule, NgxPaginationModule, MatAutocomplete, MatOption, MatAutocompleteModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchPlaceholder = `Nom de projet, tag ou nom d'utilisateur`;

  filters: (skillName | Genre)[] = ['Guitare 12 cordes', 'Batterie acoustique', 'Basse fretless', 'Pop psychédélique', 'Hip-hop australien'];

  skillsPossibles = SkillNamesList;
  filteredSkills: string[] = [];

  genresPossibles = ['pop', 'rock']
  filteredGenres: string[] = [];

  isSortedAsc = true; // State for sort order

  projects: Project[] = [];

  genres = genresList;

  showMore = false;


  p = 1;
  itemsPerPage = 2;
  totalItems: number | undefined;

  // Ajout des contrôles de formulaire pour l'autocomplétion
  skillControl = new FormControl();
  genreControl = new FormControl();

  projectService = inject(ProjectService);


  ngOnInit(): void {
    this.getProjects();
    this.setupAutocomplete();
  }

  getProjects() {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.totalItems = this.projects.length;
    });
  }

  removeFilter(index: number): void {
    // Supprime le filtre à l'index spécifié
    this.filters.splice(index, 1);
  }

  setupAutocomplete(): void {
    this.skillControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterSkills(value))
      )
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      .subscribe(skills => this.filteredSkills = skills);

    this.genreControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGenres(value))
      )
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      .subscribe(genres => this.filteredGenres = genres);
  }


  private _filterSkills(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.skillsPossibles.filter(skill => skill.toLowerCase().includes(filterValue));
  }

  private _filterGenres(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.genresPossibles.filter(genre => genre.toLowerCase().includes(filterValue));
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
