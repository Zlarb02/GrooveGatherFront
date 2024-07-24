import { Component, inject } from '@angular/core';
import { ProjectService } from '../../../../app/shared/services/project.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { switchMap, take, throwError } from 'rxjs';
import { Api } from '../../../../app/shared/models/api';
import type { Project } from '../../../../app/shared/models/project.model';
import { AuthService } from '../../../../app/shared/services/auth.service';



@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule],
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

  lastVolume = 1; // Default to full volume
  currentVolume = 1; // Current volume level

  isLiked = false;

  fileURLs: string[] = [];
  projectService = inject(ProjectService);
  authService = inject(AuthService);
  http = inject(HttpClient);
  router = inject(Router);
  toastr = inject(ToastrService)

  api = new Api();
  baseUrl = this.api.prod;
  fileURL = '';
  isListened = false;
  userEmail!: string | undefined;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  owner?: any;

  ngOnInit() {
    const url = (String(window.location.href));
    this.name = String(url).split('/').pop();
    if (this.name) {
      this.projectService.getProjectByName(this.name).pipe(
        switchMap(project => {
          this.project = project;
          if (this.project) {
            const teaserFile = this.project.files?.find(file => file.isTeaser);
            if (teaserFile) {
              this.fileURL = `${this.baseUrl}/${teaserFile.url}`;
            }
            this.fileURLs = project.files ? project.files.map(file => `${this.baseUrl}/${file.url}`) : [];

            return this.projectService.getProjectOwner(this.project.name);
          }
          return throwError(() => new Error('Projet non trouvé'));
        })
      ).subscribe({
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        next: (owner: any) => {
          this.owner = owner;
        },
        error: (error: Error) => {
          console.error('Error fetching project owner', error);
        }
      });
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  requestParticipation(): void {
    // Ensure both project name and user data are available
    if (!this.project.name) {
      alert('Nom du projet non disponible.');
      return;
    }

    // Use the user observable to get the user data and chain with switchMap
    this.authService.user.pipe(
      take(1), // Take only the latest value and complete
      switchMap(user => {
        if (user?.name) {
          // Call the requestParticipation method from the projectService
          return this.projectService.requestParticipation(this.project.name);
          // biome-ignore lint/style/noUselessElse: <explanation>
        } else {
          // Handle the case where user is not available
          this.router.navigate(['/login']);
          return throwError(() => new Error('Utilisateur non connecté ou adresse e-mail non disponible.'));
        }
      })
    ).subscribe({
      next: response => {
        this.toastr.success('Votre demande de participation a été envoyée.');
        this.router.navigate(['/messages']);
      },
      error: error => {
        if (error.message === 'Utilisateur non connecté ou adresse e-mail non disponible.') {

          this.toastr.error(error.message);
        } else {
          alert('Erreur lors de l\'envoi de la demande.');
          console.error('Request participation error:', error);
        }
      }
    });
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