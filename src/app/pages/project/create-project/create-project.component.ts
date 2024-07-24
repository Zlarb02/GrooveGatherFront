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
import { ToastrService } from 'ngx-toastr';

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

  errorMessage: string | null = null; // Variable pour les messages d'erreur
  successMessage: string | null = null; // Variable pour les messages de succès

  modifGenre = false;
  modifselectedUsedSkills = false;
  modifRequestedSkill = false;
  modifSelectedFile = false;
  modifPreviewAudio = false;
  skillConflict = false;

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService) {
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

  /*   checkSkillConflict(): boolean {
    let conflict = false;
    let skill: string;
    for skill in  this.myForm.get('skillsMissing')?.value {
     conflict = this.myForm.get('skillsPresent')?.value.includes(skill);
    if (conflict) {
      this.skillConflict = true;
    }
  }
    return conflict;
  } */

  showToastSuccess(message: string, type: string) {
    this.toastr.success(message, type);
  }

  showToastError(message: string, type: string) {
    this.toastr.error(message, type);
  }

  checkSkillConflict(): boolean {
    let conflict = false;
    const skillsMissing = this.myForm.get('skillsMissing')?.value;
    const skillsPresent = this.myForm.get('skillsPresent')?.value;

    // Vérifie si chaque compétence manquante est présente dans la liste des compétences présentées
    for (const skill of skillsMissing || []) {
      // Utilise un tableau vide comme fallback pour éviter l'erreur lorsqu'il n'y
      if (skillsPresent.includes(skill)) {
        conflict = true; // Si au moins une compétence manquante est trouvée dans les compétences présentées, définir
        //      conflict à true
        break; // Sortir de la boucle dès qu'une compétence en conflit est trouvée
      }
    }
    this.skillConflict = conflict; // Mettre à jour la propriété skillConflict en dehors de la boucle
    return conflict; // Retourner le résultat final
  }

  compare(maListe: string[], elementASearch: string) {
    // Verification if the element belongs to the list
    return maListe.includes(elementASearch);
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
      this.modifGenre = true;
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
      this.modifselectedUsedSkills = true;
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
      this.modifRequestedSkill = true;
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
      this.modifSelectedFile = true;
      this.modifPreviewAudio = true;
    }
    if (this.previewAudio === file) {
      this.previewAudio = null;
      this.modifPreviewAudio = true;
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
      this.modifPreviewAudio = true;
    } else {
      this.previewAudio = file;
      /*  this.modifPreviewAudio = false; */
    }
  }

  // Method to handle form submission

  // Method to handle form submission
  onSubmit() {
    if (!this.myForm.valid) {
      this.showToastError('formulaire invalide !', 'Erreur');
      this.myForm.markAllAsTouched();
      this.modifGenre = true;
      this.modifselectedUsedSkills = true;
      this.modifRequestedSkill = true;
      this.modifSelectedFile = true;
      this.modifPreviewAudio = true;
      this.skillConflict = true;
    }
    if (this.myForm.valid) {
      // Étape 1: Uploader les fichiers et attendre la réponse
      this.uploadFiles(this.selectedFiles)
        .then((uploadedFiles) => {
          // biome-ignore lint/suspicious/noConsoleLog: <explanation>
          console.log('Upload response:', uploadedFiles);

          // Assurez-vous que uploadedFiles est un tableau valide d'objets
          if (Array.isArray(uploadedFiles)) {
            // Retirer la base de l'URL pour correspondre au format 'files/download?filename=...'
            const baseUrlPattern = new RegExp(`^${this.baseUrl}/`);

            // Crée un tableau d'objets avec url, isTeaser, name, et size
            const filesArray = uploadedFiles.map((file) => ({
              url: file.url.replace(baseUrlPattern, ''),
              isTeaser:
                file.url.replace(baseUrlPattern, '') ===
                this.mp3Url?.replace(baseUrlPattern, ''),
              name: file.name,
              size: file.size,
            }));

            // Si mp3Url n'est pas présent dans les URLs, ajoutez-le comme isTeaser: true
            const mp3FormattedUrl = this.mp3Url?.replace(baseUrlPattern, '');
            if (
              mp3FormattedUrl &&
              !filesArray.some((file) => file.url === mp3FormattedUrl)
            ) {
              filesArray.push({
                url: mp3FormattedUrl,
                isTeaser: true,
                name: 'MP3 Teaser', // Assurez-vous d'avoir un nom par défaut ou utilisez celui approprié
                size: 0, // Définissez une taille par défaut si nécessaire
              });
            }

            // Mettre à jour les URLs des fichiers dans le formulaire
            this.myForm.patchValue({ files: filesArray });

            // Préparer le payload pour l'envoi du formulaire
            const formData = {
              ...this.myForm.value,
              files: filesArray, // Envoyer le tableau d'objets avec url, isTeaser, name et size
            };

            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log('Form data to be submitted:', formData);

            // Étape 2: Poster le formulaire avec les données
            this.http
              .post(`${this.baseUrl}/projects`, formData, {
                withCredentials: true,
              })
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
            this.showToastSuccess('Projet créé !', 'Victoire !');
          } else {
            console.error(
              'Uploaded files response is not an array:',
              uploadedFiles
            );
          }
        })
        .catch((error) => {
          console.error('Error uploading files:', error);
        });
    } else {
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log('Form is invalid');
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

    fetch(`${this.baseUrl}/files/convert`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(data);

        this.wavUrl = `${this.baseUrl}/${data.wavUrl}`;
        this.mp3Url = `${this.baseUrl}/${data.mp3Url}`;
      })
      .catch((error) => console.error('Error:', error));
  }

  uploadFiles(files: File[]): Promise<{ [key: string]: string }> {
    const formData = new FormData();
    // biome-ignore lint/complexity/noForEach: <explanation>
    files.forEach((file) => formData.append('files', file));

    return this.http
      .post<{ [key: string]: string }>(
        `${this.baseUrl}/files/upload`,
        formData,
        { withCredentials: true }
      )
      .toPromise()
      .then((response) => {
        return response || {}; // Assurez-vous de toujours retourner un objet
      })
      .catch((error) => {
        console.error('Error uploading files:', error);
        return {}; // Retourner un objet vide en cas d'erreur
      });
  }
}
