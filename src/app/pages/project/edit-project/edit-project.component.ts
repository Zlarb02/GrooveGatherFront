import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { switchMap, throwError } from 'rxjs';
import { Api } from '../../../shared/models/api';
import type { Project } from '../../../shared/models/project.model';
import { ProjectService } from '../../../shared/services/project.service';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule],
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'] // Updated from styleUrl to styleUrls
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
    id: 0,
    files: [] // Make sure this property exists
  };

  id!: number;
  name!: string | undefined;

  admins!: any[];

  lastVolume = 1; // Default to full volume
  currentVolume = 1; // Current volume level

  isLiked = false;

  fileURLs: string[] = [];
  projectService = inject(ProjectService);

  api = new Api();
  baseUrl = this.api.local;
  fileURL = '';
  isListened = false;
  owner: any;

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
        next: (owner: any) => {
          this.owner = owner;
          this.fetchAdmins();
        },
        error: (error: Error) => {
          console.error('Error fetching project owner', error);
        }
      });
    }
  }

  fetchAdmins() {
    if (this.name) {
      this.projectService.getProjectAdmins(this.name).subscribe({
        next: (admins: any) => {
          this.admins = admins;
        },
        error: (error: Error) => {
          console.error('Error fetching project admins', error);
        }
      });
    }
  }

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

  addFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    // Simulez le téléchargement du fichier
    // Remplacez cette partie par la logique de téléchargement réelle
    const fileUrl = URL.createObjectURL(file);
    const newFile = {
      name: file.name,
      url: fileUrl,
      size: file.size,
      isTeaser: false
    };

    if (this.project.files) { // Vérifiez si files est défini
      this.project.files.push(newFile);
    } else {
      this.project.files = [newFile];
    }

    this.updateProject();
  }

  removeFile(file: any) {
    if (this.project.files) { // Vérifiez si files est défini
      this.project.files = this.project.files.filter(f => f !== file.url);
      this.updateProject();
    }
  }

  private updateProject() {
    if (this.name) {
      console.log(this.project)
      this.projectService.patchProject(this.name, this.project).subscribe({
        next: (updatedProject) => {
          this.project = updatedProject;
          this.fileURLs = updatedProject.files ? updatedProject.files.map(file => `${this.baseUrl}/${file.url}`) : [];
        },
        error: (error: Error) => {
          console.error('Error updating project', error);
        }
      });
    }
  }

  fileToUpload: File[] | null = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileToUpload?.push(input.files[0]);
    }
  }

  uploadFile(): void {
    console.log(this.fileToUpload)
    if (this.fileToUpload) {
      this.projectService.uploadFiles(this.fileToUpload).subscribe((uploadedFiles: any) => {
        // Assurez-vous que uploadedFiles est un objet contenant les URLs et les informations des fichiers

        // Ajoutez les fichiers formatés à votre projet
        this.project.files = uploadedFiles.length === 1 ? [uploadedFiles[0]] : []

        // Mettez à jour le projet
        this.projectService.patchProject(this.project.name, this.project).subscribe({
          next: (updatedProject) => {
            this.project = updatedProject;
          },
          error: (error) => {
            console.error('Error updating project:', error);
          }
        });
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
}
