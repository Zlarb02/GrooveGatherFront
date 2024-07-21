import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatOption } from '@angular/material/autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { map, startWith } from 'rxjs';
import { ProjectCardComponent } from '../../core/project-card/project-card.component';
import { SearchBarComponent } from '../../core/search-bar/search-bar.component';
import type { Genre } from '../../shared/models/genre';
import { genresList } from '../../shared/models/genres-list';
import type { Project } from '../../shared/models/project.model';
import type { skillName } from '../../shared/models/skill-name';
import { SkillNamesList } from '../../shared/models/skill-names-list';
import { ProjectService } from '../../shared/services/project.service';

interface Filter {
  value: skillName | Genre;
  class: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchBarComponent, ReactiveFormsModule, FormsModule, ProjectCardComponent, CommonModule, NgxPaginationModule, MatAutocomplete, MatOption, MatAutocompleteModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchPlaceholder = "Nom de projet ou mot-clé";

  filters: Filter[] = [];
  skillsPossibles = SkillNamesList;
  filteredSkills: string[] = [];

  genresPossibles = ['pop', 'rock']
  filteredGenres: string[] = [];

  isSortedAsc = true; // State for sort order
  sortOption = 'date'; // default sort option

  projects: Project[] = [];
  genres = genresList;

  showMore = false;

  p = 1;
  itemsPerPage = 6;
  totalItems: number | undefined;

  // Ajout des contrôles de formulaire pour l'autocomplétion
  skillControlPresent = new FormControl();
  skillControlMissing = new FormControl();
  genreControl = new FormControl();

  projectService = inject(ProjectService);

  // New properties for filter values
  skillPresentFilters: string[] = [];
  skillMissingFilters: string[] = [];
  genreFilters: string[] = [];

  ngOnInit(): void {
    this.getProjects();
    this.setupAutocomplete();
    this.listenFiltersEntries();
  }

  getProjects() {
    const sortDirection = this.isSortedAsc ? 'asc' : 'desc';
    const filters = {
      skillPresent: this.skillPresentFilters,
      skillMissing: this.skillMissingFilters,
      genre: this.genreFilters
    };

    this.projectService.getProjects(this.sortOption, sortDirection, filters).subscribe((projects) => {
      this.projects = projects;
      this.totalItems = this.projects.length;
    });
  }

  listenFiltersEntries(): void {
    this.skillControlPresent.valueChanges.subscribe(value => {
      if (this.filteredSkills.includes(value)) {
        this.addFilter(value, 'skillPresent');
        this.skillControlPresent.reset();
      }
    });

    this.skillControlMissing.valueChanges.subscribe(value => {
      if (this.filteredSkills.includes(value)) {
        this.addFilter(value, 'skillMissing');
        this.skillControlMissing.reset();
      }
    });

    this.genreControl.valueChanges.subscribe(value => {
      if (this.genres.includes(value)) {
        this.addFilter(value, 'genre');
        this.genreControl.reset();
      }
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const skillPresentValue = this.skillControlPresent.value;
      const skillMissingValue = this.skillControlMissing.value;
      const genreValue = this.genreControl.value;

      if (skillPresentValue && this.filteredSkills.includes(skillPresentValue)) {
        this.addFilter(skillPresentValue, 'skillPresent');
        this.skillControlPresent.reset();
      }

      if (skillMissingValue && this.filteredSkills.includes(skillMissingValue)) {
        this.addFilter(skillMissingValue, 'skillMissing');
        this.skillControlMissing.reset();
      }

      if (genreValue && this.genres.includes(genreValue)) {
        this.addFilter(genreValue, 'genre');
        this.genreControl.reset();
      }

      event.preventDefault(); // Prevent form submission on Enter
    }
  }

  addFilter(value: skillName | Genre, type: 'skillPresent' | 'skillMissing' | 'genre') {
    const filterClass = {
      skillPresent: 'filter-skill-present',
      skillMissing: 'filter-skill-missing',
      genre: 'filter-genre'
    }[type];

    const filter: Filter = { value, class: filterClass };

    if (!this.filters.some(f => f.value === value && f.class === filterClass)) {
      this.filters.unshift(filter);

      // Update the filters arrays
      if (type === 'skillPresent') {
        this.skillPresentFilters.push(value as string);
      } else if (type === 'skillMissing') {
        this.skillMissingFilters.push(value as string);
      } else if (type === 'genre') {
        this.genreFilters.push(value as string);
      }

      this.getProjects(); // Fetch projects with updated filters
    }
  }

  removeFilter(index: number): void {
    const removedFilter = this.filters.splice(index, 1)[0];

    // Remove the filter from the corresponding filters array
    if (removedFilter.class === 'filter-skill-present') {
      this.skillPresentFilters = this.skillPresentFilters.filter(f => f !== removedFilter.value);
    } else if (removedFilter.class === 'filter-skill-missing') {
      this.skillMissingFilters = this.skillMissingFilters.filter(f => f !== removedFilter.value);
    } else if (removedFilter.class === 'filter-genre') {
      this.genreFilters = this.genreFilters.filter(f => f !== removedFilter.value);
    }

    this.getProjects(); // Fetch projects with updated filters
  }

  setupAutocomplete(): void {
    this.skillControlPresent.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterSkills(value))
      )
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      .subscribe(skills => this.filteredSkills = skills);

    this.skillControlMissing.valueChanges
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
    const filterValue = value ? value.toLowerCase() : '';
    return this.skillsPossibles.filter(skill => skill.toLowerCase().includes(filterValue));
  }

  private _filterGenres(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.genres.filter(genre => genre.toLowerCase().includes(filterValue));
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
    this.getProjects(); // Fetch projects with updated sort order
  }

  // Sorting functions remain unchanged
  sortByDate() {
    // Sorting handled by back-end
  }

  sortByPopularity() {
    // Sorting handled by back-end
  }
}
