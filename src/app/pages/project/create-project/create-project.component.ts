import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
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

  constructor(private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      nameProject: ['', Validators.required],
      nameOwner: ['', Validators.required],
      genre: ['', Validators.required],
      usedSkills: this.formBuilder.array([], Validators.required),
      requestedSkills: this.formBuilder.array([], Validators.required),
      description: ['', Validators.required],
      like: ['0'],
    });

    this.ecouter();
  }

  get usedSkills(): FormArray {
    return this.myForm.get('usedSkills') as FormArray;
  }

  get requestedSkills(): FormArray {
    return this.myForm.get('requestedSkills') as FormArray;
  }

  addUsedSkill(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target?.value && !this.usedSkills.value.includes(target.value)) {
      this.usedSkills.push(new FormControl(target.value));
    }
  }

  addRequestedSkill(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target?.value && !this.requestedSkills.value.includes(target.value)) {
      this.requestedSkills.push(new FormControl(target.value));
    }
  }

  removeUsedSkill(index: number) {
    this.usedSkills.removeAt(index);
  }

  removeRequestedSkill(index: number) {
    this.requestedSkills.removeAt(index);
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.table(this.myForm.value);
    } else {
      console.table('Form is invalid');
    }
  }

  ecouter() {
    this.myForm.valueChanges.subscribe((value) => {
      // console.log(value);
    });
  }

  update(user: User) {
    this.myForm.setValue({
      nameProject: user.nameProject,
      nameOwner: user.nameOwner,
      genre: user.genre,
      usedSkills: user.usedSkills,
      requestedSkills: user.requestedSkills,
      description: user.description,
    });
  }
}

interface User {
  nameProject: string;
  nameOwner: string;
  genre: string;
  usedSkills: string[];
  requestedSkills: string[];
  description: string;
}
