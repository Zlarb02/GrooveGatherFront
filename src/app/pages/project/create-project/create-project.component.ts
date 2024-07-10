import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { genresList } from '../../../shared/models/genres-list';
import { SkillNamesList } from '../../../shared/models/skill-names-list';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
})
export class CreateProjectComponent {
  myForm: FormGroup;
  genresList = genresList;
  skillNamesList = SkillNamesList;
  selectedGenres: string[] = [];
  selectedUsedSkills: string[] = [];
  selectedRequestedSkills: string[] = [];
  selectedFiles: File[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      nameProject: ['', Validators.required],
      genre: this.formBuilder.array([], Validators.required),
      usedSkills: this.formBuilder.array([], Validators.required),
      requestedSkills: this.formBuilder.array([], Validators.required),
      description: ['', Validators.required],
      color: ['', Validators.required],
      like: ['0'],
    });
  }

  get genres(): FormArray {
    return this.myForm.get('genre') as FormArray;
  }

  get usedSkills(): FormArray {
    return this.myForm.get('usedSkills') as FormArray;
  }

  get requestedSkills(): FormArray {
    return this.myForm.get('requestedSkills') as FormArray;
  }

  addGenre(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target?.value && !this.selectedGenres.includes(target.value)) {
      this.selectedGenres.push(target.value);
      this.genres.push(new FormControl(target.value));
    }
    target.value = ''; // Reset the select box
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

  addUsedSkill(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target?.value && !this.selectedUsedSkills.includes(target.value)) {
      this.selectedUsedSkills.push(target.value);
      this.usedSkills.push(new FormControl(target.value));
    }
    target.value = ''; // Reset the select box
  }

  removeUsedSkill(skill: string) {
    const index = this.selectedUsedSkills.indexOf(skill);
    if (index !== -1) {
      this.selectedUsedSkills.splice(index, 1);
      const controlIndex = this.usedSkills.controls.findIndex(
        (ctrl) => ctrl.value === skill
      );
      this.usedSkills.removeAt(controlIndex);
    }
  }

  addRequestedSkill(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target?.value && !this.selectedRequestedSkills.includes(target.value)) {
      this.selectedRequestedSkills.push(target.value);
      this.requestedSkills.push(new FormControl(target.value));
    }
    target.value = ''; // Reset the select box
  }

  removeRequestedSkill(skill: string) {
    const index = this.selectedRequestedSkills.indexOf(skill);
    if (index !== -1) {
      this.selectedRequestedSkills.splice(index, 1);
      const controlIndex = this.requestedSkills.controls.findIndex(
        (ctrl) => ctrl.value === skill
      );
      this.requestedSkills.removeAt(controlIndex);
    }
  }

  // Méthode pour gérer les changements de fichiers
  handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      for (let i = 0; i < target.files.length; i++) {
        if (!this.selectedFiles.includes(target.files[i])) {
          this.selectedFiles.push(target.files[i]);
        }
      }
    }
  }

  // Méthode pour supprimer un fichier de la liste
  removeFile(file: File) {
    const index = this.selectedFiles.indexOf(file);
    if (index !== -1) {
      this.selectedFiles.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.myForm.valid) {
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(this.myForm.value);
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log(this.selectedFiles); // Afficher les fichiers sélectionnés
    } else {
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log('Form is invalid');
    }
  }

  ecouter() {
    this.myForm.valueChanges.subscribe((value) => {
      //console.log(value);
    });
  }

  update(project: Project) {
    this.myForm.setValue({
      nameProject: project.nameProject,
      nameOwner: project.nameOwner,
      genre: project.genre,
      usedSkills: project.usedSkills,
      requestedSkills: project.requestedSkills,
      description: project.description,
      color: project.color,
    });
    this.selectedUsedSkills = project.usedSkills;
    this.selectedRequestedSkills = project.requestedSkills;
  }

  selectColor(color: string) {
    this.myForm.get('color')?.setValue(color);
    // biome-ignore lint/complexity/noForEach: <explanation>
    document.querySelectorAll('.carre').forEach((element) => {
      element.classList.remove('selected');
    });
    document.querySelector(`.carre.${color}`)?.classList.add('selected');
  }
}

interface Project {
  nameProject: string;
  nameOwner: string;
  genre: string[];
  usedSkills: string[];
  requestedSkills: string[];
  description: string;
  color: string;
}
