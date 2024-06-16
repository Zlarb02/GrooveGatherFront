import { Component, Input, input } from '@angular/core';
import type { Project } from '../../shared/models/project.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project?: Project
  @Input() i!: number;
}
