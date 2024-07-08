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
    name: 'PureKiffKick',
    genres: ['Hip-hop', 'Rap', 'Jersey', 'Drill'],
    description: 'Du lourd ',
    date: '26-06-2024',
    likes: 250,
    color: "green",
    skillsPresent: ["Instrumental", "Rap", "Enregistrement", "Mixage en home studio"],
    skillsMissing: ["Mixage en studio professionnel", "Mastering en studio professionnel"],
  };

  projectService = inject(ProjectService);




}