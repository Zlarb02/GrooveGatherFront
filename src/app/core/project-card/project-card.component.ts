import { CommonModule } from '@angular/common';
// biome-ignore lint/style/useImportType: <explanation>
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../../shared/models/api';
import type { Project } from '../../shared/models/project.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
  @Input() project?: Project;
  fileURL?: string;
  isListened = false;
  lastVolume = 1; // Default to full volume
  currentVolume = 1; // Current volume level
  canEdit = false; // Variable to store canEdit status

  api = new Api();
  baseUrl = this.api.local;

  authService = inject(AuthService);

  ngOnInit(): void {
    if (this.project) {
      const teaserFile = this.project.files?.find(file => file.isTeaser);
      if (teaserFile) {
        this.fileURL = `${this.baseUrl}/${teaserFile.url}`;
      }
      if (this.project?.name) {
        this.authService.canEdit(this.project.name).subscribe(
          (canEdit: boolean) => {
            this.canEdit = canEdit;
          },
          (error) => {
            console.error('Error checking edit permissions', error);
            this.canEdit = false;
          }
        );
      }
    }
  }

  playAudio() {
    const audio = document.getElementById('player') as HTMLAudioElement;
    if (audio) {
      audio.play();
      this.isListened = true;
    }
  }

  pauseAudio() {
    const audio = document.getElementById('player') as HTMLAudioElement;
    if (audio) {
      audio.pause();
    }
  }

  canEditProject(): boolean {
    return this.canEdit;
  }

  stopAudio() {
    const audio = document.getElementById('player') as HTMLAudioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      this.isListened = false;
    }
  }

  changeVolume(event: Event) {
    const audio = document.getElementById('player') as HTMLAudioElement;
    if (audio) {
      const input = event.target as HTMLInputElement;
      audio.volume = Number(input.value);
      this.currentVolume = audio.volume; // Update the current volume
    }
  }

  toggleMute() {
    const audio = document.getElementById('player') as HTMLAudioElement;
    if (audio) {
      if (audio.volume === 0) {
        audio.volume = this.lastVolume || 1;
        this.currentVolume = audio.volume; // Update the current volume
      } else {
        this.lastVolume = audio.volume;
        audio.volume = 0;
        this.currentVolume = audio.volume; // Update the current volume
      }
    }
  }

  get isMuted(): boolean {
    return this.currentVolume === 0;
  }
}
