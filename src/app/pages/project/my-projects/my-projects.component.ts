import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProjectCardComponent } from '../../../core/project-card/project-card.component';
import { genresList } from '../../../shared/models/genres-list';
import type { Project } from '../../../shared/models/project.model';
import { ProjectService } from '../../../shared/services/project.service';

@Component({
  selector: 'app-my-projects',
  standalone: true,
  imports: [ProjectCardComponent, NgxPaginationModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './my-projects.component.html',
  styleUrl: './my-projects.component.css'
})
export class MyProjectsComponent {
  projects: Project[] = [];

  isSortedAsc = true;

  genres = genresList;

  showMore = false;


  p = 1;
  itemsPerPage = 6;
  totalItems: number | undefined;

  projectService = inject(ProjectService);
  ngOnInit(): void {
    this.getUserProjects();
    this.getUserAdminProjects();
  }

  getUserProjects() {
    this.projectService.getUserProjects().subscribe((operations) => {
      // biome-ignore lint/complexity/noForEach: <explanation>
      operations.forEach((operation) => {
        if (operation.project) {
          this.projectService.getProjectByName(operation.project).subscribe((project) => {
            this.projects.push(project);
          });
        }
      })
      this.totalItems = this.projects.length;
    });
  }

  getUserAdminProjects() {
    console.log("1")
    this.projectService.getUserAdminProjects().subscribe((operations) => {
      console.log("2")
      // biome-ignore lint/complexity/noForEach: <explanation>
      operations.forEach((operation) => {
        if (operation.project) {
          this.projectService.getProjectByName(operation.project).subscribe((project) => {
            console.log(project)
            this.projects.push(project);
          });
        }
      })
      this.totalItems = this.projects.length;
    });
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
