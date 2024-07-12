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
import { MatAutocomplete, MatAutocompleteModule, type MatAutocompleteSelectedEvent, MatOption } from '@angular/material/autocomplete';
import { catchError } from 'rxjs';
import { genresList } from '../../../shared/models/genres-list';
import type { Project } from '../../../shared/models/project.model';
import { SkillNamesList } from '../../../shared/models/skill-names-list';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatAutocomplete, MatOption, MatAutocompleteModule],
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

  http = inject(HttpClient);

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
    if (
      value &&
      !this.selectedUsedSkills.includes(value)
    ) {
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
    if (
      value &&
      !this.selectedRequestedSkills.includes(value)
    ) {
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
        if (!this.selectedFiles.includes(target.files[i])) {
          this.selectedFiles.push(target.files[i]);
        }
      }
    }
  }

  removeFile(file: File) {
    const index = this.selectedFiles.indexOf(file);
    if (index !== -1) {
      this.selectedFiles.splice(index, 1);
    }
  }

  // Method to handle form submission
  onSubmit() {
    if (this.myForm.valid) {
      const project: Project = {
        id: -1,
        name: this.myForm.value.name,
        genres: this.myForm.value.genres,
        color: this.myForm.value.color,
        description: this.myForm.value.description,
        date: this.myForm.value.date,
        likes: this.myForm.value.likes,
        skillsPresent: this.myForm.value.skillsPresent,
        skillsMissing: this.myForm.value.skillsMissing,
      };
      this.postProject(project).subscribe((response) => {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(response);
      });
    } else {
      // biome-ignore lint/suspicious/noConsoleLog: <explanation>
      console.log('Form is invalid');
    }
  }

  // Method to send project data to the backend
  postProject(project: Project) {
    return this.http
      .post<Project[]>(
        'https://groovegather-api.olprog-a.fr/api/v1/projects',
        project
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }
}