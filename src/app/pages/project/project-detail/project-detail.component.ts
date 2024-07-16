import { Component, inject } from '@angular/core';
import { ProjectService } from '../../../shared/services/project.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CommonModule } from '@angular/common';
import type { Project } from '../../../shared/models/project.model';


@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent {

  project: Project = {
    name: "404 Not Found",
    genres: ["Jazz"],
    color: "red",
    description: "Il n'y a pas de réel projet ici désolé !",
    date: "Now",
    likes: 9999999,
    skillsPresent: ["Piano", "Batterie"],
    skillsMissing: ["Basse", "Composition"],
    id: 0
  };

  id!: number;
  name!: string | undefined;

  isLiked = false;

  projectService = inject(ProjectService);

  ngOnInit() {
    const decoded = decodeURIComponent(String(window.location.href));
    this.name = String(decoded).split('/').pop();
    if (this.name) {
      this.projectService.getProjectByName(this.name).subscribe((project) => {
        this.project = project;
      });
    }
  }

  likeProject() {
    this.isLiked = !this.isLiked;
    this.project.likes++;
  }

  unlikeProject() {
    this.isLiked = !this.isLiked;
    this.project.likes--;
  }
}