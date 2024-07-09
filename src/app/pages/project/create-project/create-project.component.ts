import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { genresList } from '../../../shared/models/genres-list';
import { SkillNamesList } from '../../../shared/models/skill-names-list';
import { Project } from '../../../shared/models/project.model';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
})
export class CreateProjectComponent {
  selectColor(color: string) {
    this.myForm.get('color')?.setValue(color);
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
  addGenre(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value && !this.selectedGenres.includes(target.value)) {
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

  // Methods to add and remove used skills
  addUsedSkill(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (
      target &&
      target.value &&
      !this.selectedUsedSkills.includes(target.value)
    ) {
      this.selectedUsedSkills.push(target.value);
      this.skillsPresent.push(new FormControl(target.value));
    }
    target.value = ''; // Reset the select box
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
  addRequestedSkill(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (
      target &&
      target.value &&
      !this.selectedRequestedSkills.includes(target.value)
    ) {
      this.selectedRequestedSkills.push(target.value);
      this.skillsMissing.push(new FormControl(target.value));
    }
    target.value = ''; // Reset the select box
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
        console.log(response);
      });
    } else {
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
