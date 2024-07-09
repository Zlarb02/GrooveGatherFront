import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Project } from '../../shared/models/project.model';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project?: Project
  @Input() i!: number;
}
