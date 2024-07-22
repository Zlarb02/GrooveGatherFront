
import { Component, inject } from '@angular/core';
import { ProjectService } from '../../../shared/services/project.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Api } from '../../../shared/models/api';
import type { Project } from '../../../shared/models/project.model';


@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent {
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

  lastVolume = 1; // Default to full volume
  currentVolume = 1; // Current volume level

  isLiked = false;

  fileURLs: string[] = [];
  projectService = inject(ProjectService);

  api = new Api();
  baseUrl = this.api.local;
  fileURL = '';
  isListened = false;

  ngOnInit() {
    const url = (String(window.location.href));
    this.name = String(url).split('/').pop();
    if (this.name) {
      this.projectService.getProjectByName(this.name).subscribe((project) => {
        this.project = project;
        if (this.project) {
          const teaserFile = this.project.files?.find(file => file.isTeaser);
          if (teaserFile) {
            this.fileURL = `${this.baseUrl}/${teaserFile.url}`;
          }
        }
        if (project.files) {
          this.fileURLs = project.files.map(file => `${this.baseUrl}/${file.url}`);
        }
      });
    }


  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  getFileDownloadUrl(file: any): string {
    return `${this.baseUrl}/${file.url}`;
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

  likeProject() {
    this.isLiked = !this.isLiked;
    this.project.likes++;
  }

  unlikeProject() {
    this.isLiked = !this.isLiked;
    this.project.likes--;
  }

  formatFileSize(sizeInBytes: number): string {
    if (sizeInBytes === 0) return '0 KB';

    const units = ['octets', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const digitGroups = Math.floor(Math.log(sizeInBytes) / Math.log(1024));

    const sizeFormatted = Number.parseFloat(
      (sizeInBytes / 1024 ** digitGroups).toFixed(2)
    );
    const unit = units[digitGroups];

    return `${sizeFormatted} ${unit}`;
  }

}