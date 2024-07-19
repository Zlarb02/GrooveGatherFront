import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { HttpClient } from '@angular/common/http';
// biome-ignore lint/style/useImportType: <explanation>
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteModule,
  type MatAutocompleteSelectedEvent,
  MatOption,
} from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Api } from '../../../shared/models/api';
import { genresList } from '../../../shared/models/genres-list';
import { SkillNamesList } from '../../../shared/models/skill-names-list';
// biome-ignore lint/style/useImportType: <explanation>
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatAutocompleteModule,
    DragDropModule,
  ],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
})
export class CreateProjectComponent {
  selectColor(color: string) {
    this.myForm.get('color')?.setValue(color);
    // biome-ignore lint/complexity/noForEach: <explanation>
    document.querySelectorAll('.carre').forEach((element) => {
      element.classList.remove('selected');
    });
    document.querySelector(`.carre.${color}`)?.classList.add('selected');
  }

  myForm: FormGroup;
  genresList = genresList;
  skillNamesList = SkillNamesList;
  selectedGenres: string[] = [];
  selectedUsedSkills: string[] = [];
  selectedRequestedSkills: string[] = [];
  selectedFiles: File[] = [];
  audioFiles: File[] = [];
  scoreFiles: File[] = [];
  archiveFiles: File[] = [];

  previewAudio: File | null = null;

  router: Router = inject(Router);
  http = inject(HttpClient);
  api = new Api();
  baseUrl = this.api.local;

  wavUrl: string | undefined;
  mp3Url: string | undefined;

  constructor(private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      genres: this.formBuilder.array([], Validators.required),
      skillsPresent: this.formBuilder.array([], Validators.required),
      skillsMissing: this.formBuilder.array([], Validators.required),
      description: ['', Validators.required],
      color: ['', Validators.required],
      date: [''],
      likes: [0],
      files: this.formBuilder.array([], Validators.required),
    });
  }

  // Getter methods for form arrays
  get genres(): FormArray {
    return this.myForm.get('genres') as FormArray;
  }

  get skillsPresent(): FormArray {
    return this.myForm.get('skillsPresent') as FormArray;
  }

  get skillsMissing(): FormArray {
    return this.myForm.get('skillsMissing') as FormArray;
  }

  get files(): FormArray {
    return this.myForm.get('files') as FormArray;
  }

  // Methods to add and remove genres
  addGenre(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
    if (value && !this.selectedGenres.includes(value)) {
      this.selectedGenres.push(value);
      this.genres.push(new FormControl(value));
    }
  }

  removeGenre(genre: string) {
    const index = this.selectedGenres.indexOf(genre);
    if (index !== -1) {
      this.selectedGenres.splice(index, 1);
      const controlIndex = this.genres.controls.findIndex(
        (ctrl) => ctrl.value === genre
      );
      this.genres.removeAt(controlIndex);
    }
  }

  // Methods to add and remove used skills
  addUsedSkill(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
    if (value && !this.selectedUsedSkills.includes(value)) {
      this.selectedUsedSkills.push(value);
      this.skillsPresent.push(new FormControl(value));
    }
  }

  removeUsedSkill(skill: string) {
    const index = this.selectedUsedSkills.indexOf(skill);
    if (index !== -1) {
      this.selectedUsedSkills.splice(index, 1);
      const controlIndex = this.skillsPresent.controls.findIndex(
        (ctrl) => ctrl.value === skill
      );
      this.skillsPresent.removeAt(controlIndex);
    }
  }

  // Methods to add and remove requested skills
  addRequestedSkill(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
    if (value && !this.selectedRequestedSkills.includes(value)) {
      this.selectedRequestedSkills.push(value);
      this.skillsMissing.push(new FormControl(value));
    }
  }

  removeRequestedSkill(skill: string) {
    const index = this.selectedRequestedSkills.indexOf(skill);
    if (index !== -1) {
      this.selectedRequestedSkills.splice(index, 1);
      const controlIndex = this.skillsMissing.controls.findIndex(
        (ctrl) => ctrl.value === skill
      );
      this.skillsMissing.removeAt(controlIndex);
    }
  }

  // Methods to handle file selection and removal
  handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      for (let i = 0; i < target.files.length; i++) {
        const file = target.files[i];
        if (!this.selectedFiles.includes(file)) {
          this.selectedFiles.push(file);
          this.files.push(new FormControl(file)); // Add this line to link the file to the form
        }
      }
    }
  }

  removeFile(file: File) {
    const index = this.selectedFiles.indexOf(file);
    if (index !== -1) {
      this.selectedFiles.splice(index, 1);
    }
    if (this.previewAudio === file) {
      this.previewAudio = null;
    }
  }

  openFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add('dragging');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('dragging');
  }

  onDropFile(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.remove('dragging');
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!this.selectedFiles.includes(file)) {
          this.selectedFiles.push(file);
          this.files.push(new FormControl(file)); // Add this line to link the file to the form
        }
      }
    }
  }

  getFileTypeIconClass(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'txt':
        return 'txt';
      case 'mp3':
      case 'flac':
      case 'wav':
      case 'ogg':
        return 'audio';
      case 'gp':
      case 'tg':
      case 'xml':
        return 'score';
      case 'midi':
        return 'midi';
      // Ajoutez d'autres cas pour d'autres extensions de fichiers
      default:
        return 'default'; // Classe par défaut si aucune correspondance trouvée
    }
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

  setAsMainAudio(file: File) {
    if (this.previewAudio === file) {
      this.previewAudio = null;
    } else {
      this.previewAudio = file;
    }
  }

  // Method to handle form submission
  onSubmit() {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(this.myForm.value, this.selectedFiles);
    if (this.myForm.valid) {
      const formData = new FormData();
      formData.append('name', this.myForm.get('name')?.value);
      formData.append('description', this.myForm.get('description')?.value);
      formData.append('color', this.myForm.get('color')?.value);
      formData.append('date', this.myForm.get('date')?.value);
      formData.append('likes', this.myForm.get('likes')?.value);

      // biome-ignore lint/complexity/noForEach: <explanation>
      this.selectedGenres.forEach((genre) => formData.append('genres', genre));
      // biome-ignore lint/complexity/noForEach: <explanation>
      this.selectedUsedSkills.forEach((skill) =>
        formData.append('skillsPresent', skill)
      );
      // biome-ignore lint/complexity/noForEach: <explanation>
      this.selectedRequestedSkills.forEach((skill) =>
        formData.append('skillsMissing', skill)
      );
      const filesArray = this.myForm.get('files') as FormArray;
      // biome-ignore lint/complexity/noForEach: <explanation>
      filesArray.controls.forEach((control) => {
        formData.append('files', control.value);
      });

      // POST request to the server
      this.http
        .post(`${this.baseUrl}/projects`, formData, { withCredentials: true })
        .subscribe(
          (response) => {
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log('Project created successfully:', response);
            this.router.navigate(['/projects']);
          },
          (error) => {
            console.error('Error creating project:', error);
          }
        );
    }
  }

  isAudioFile(fileName: string): boolean {
    const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'wma'];
    const extension = fileName.split('.').pop()?.toLowerCase();
    return audioExtensions.includes(extension || '');
  }

  uploadFile(file: File) {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (!fileInput || !fileInput.files) {
      alert('File input element not found');
      return;
    }

    if (!file) {
      alert('Please select a WAV file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // Options de la requête fetch pour l'upload du fichier
    const requestOptions: RequestInit = {
      method: 'POST',
      body: formData,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:4200', // Remplacez par l'URL de votre frontend Angular
      },
    };

    // Effectuer la requête fetch pour convertir le fichier WAV en MP3
    fetch('http://localhost:8080/api/v1/files/convert', requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        this.wavUrl = `${this.baseUrl}/${data.wavUrl}`;
        this.mp3Url = `${this.baseUrl}/${data.mp3Url}`;
      })
      .catch((error) => console.error('Error:', error));
  }
}
