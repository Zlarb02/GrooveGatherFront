import { CommonModule } from '@angular/common';
// biome-ignore lint/style/useImportType: <explanation>
import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
// biome-ignore lint/style/useImportType: <explanation>
import { Subscription } from 'rxjs';
import { Api } from '../../shared/models/api';
import type { Project } from '../../shared/models/project.model';
import { AudioService } from '../../shared/services/audio.service';
import { AuthService } from '../../shared/services/auth.service';
import { ProjectService } from '../../shared/services/project.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit, AfterViewInit {
  @Input() project?: Project;
  @Input() index?: number;  // Ajout de l'index en tant qu'Input
  fileURL?: string;
  isListened = false;
  lastVolume = 1; // Default to full volume
  currentVolume = 1; // Current volume level
  canEdit = false; // Variable to store canEdit status

  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>; // Référence à l'élément audio

  api = new Api();
  baseUrl = this.api.local;

  authService = inject(AuthService);
  audioService = inject(AudioService);
  projectService = inject(ProjectService);

  private stopAudioSubscription!: Subscription;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  owner: any;

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


      this.projectService.getProjectOwner(this.project.name).subscribe(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (owner: any) => {
          this.owner = owner;
        },
        (error: Error) => {
          console.error('Error fetching project owner', error);
        }
      );
    }

    this.stopAudioSubscription = this.audioService.stopAudio$.subscribe(() => {
      this.stopAudio();
    });
  }

  ngAfterViewInit() {
    if (this.audioPlayerRef) {
      const audio = this.audioPlayerRef.nativeElement;
      audio.addEventListener('ended', () => {
        this.isListened = false;
      });
    }
  }

  ngOnDestroy() {
    this.stopAudioSubscription.unsubscribe();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  playAudio() {
    if (this.audioPlayerRef) {
      const audio = this.audioPlayerRef.nativeElement;
      this.audioService.stopAudio();  // Notify other components to stop their audio
      audio.play();
      this.isListened = true;
    }
  }

  pauseAudio() {
    if (this.audioPlayerRef) {
      const audio = this.audioPlayerRef.nativeElement;
      audio.pause();
    }
  }

  stopAudio() {
    if (this.audioPlayerRef) {
      const audio = this.audioPlayerRef.nativeElement;
      audio.pause();
      audio.currentTime = 0;
      this.isListened = false;
    }
  }

  changeVolume(event: Event) {
    if (this.audioPlayerRef) {
      const audio = this.audioPlayerRef.nativeElement;
      const input = event.target as HTMLInputElement;
      audio.volume = Number(input.value);
      this.currentVolume = audio.volume;
    }
  }

  toggleMute() {
    if (this.audioPlayerRef) {
      const audio = this.audioPlayerRef.nativeElement;
      if (audio.volume === 0) {
        audio.volume = this.lastVolume || 1;
        this.currentVolume = audio.volume;
      } else {
        this.lastVolume = audio.volume;
        audio.volume = 0;
        this.currentVolume = audio.volume;
      }
    }
  }

  get isMuted(): boolean {
    return this.currentVolume === 0;
  }
}
