import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
  selectedUsedSkills: string[] = [];
  selectedRequestedSkills: string[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      nameProject: ['', Validators.required],
      nameOwner: ['', Validators.required],
      genre: ['', Validators.required],
      usedSkills: this.formBuilder.array([], Validators.required),
      requestedSkills: this.formBuilder.array([], Validators.required),
      description: ['', Validators.required],
      color: ['', Validators.required],
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
    if (target && target.value && !this.selectedUsedSkills.includes(target.value)) {
      this.selectedUsedSkills.push(target.value);
      this.usedSkills.push(new FormControl(target.value));
    }
    target.value = ''; // Reset the select box
  }

  addRequestedSkill(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value && !this.selectedRequestedSkills.includes(target.value)) {
      this.selectedRequestedSkills.push(target.value);
      this.requestedSkills.push(new FormControl(target.value));
    }
    target.value = ''; // Reset the select box
  }

  removeUsedSkill(skill: string) {
    const index = this.selectedUsedSkills.indexOf(skill);
    if (index !== -1) {
      this.selectedUsedSkills.splice(index, 1);
      const controlIndex = this.usedSkills.controls.findIndex(ctrl => ctrl.value === skill);
      this.usedSkills.removeAt(controlIndex);
    }
  }

  removeRequestedSkill(skill: string) {
    const index = this.selectedRequestedSkills.indexOf(skill);
    if (index !== -1) {
      this.selectedRequestedSkills.splice(index, 1);
      const controlIndex = this.requestedSkills.controls.findIndex(ctrl => ctrl.value === skill);
      this.requestedSkills.removeAt(controlIndex);
    }
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log(this.myForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  ecouter() {
    this.myForm.valueChanges.subscribe((value) => {
      //console.log(value);
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
      color: user.color,
    });
    this.selectedUsedSkills = user.usedSkills;
    this.selectedRequestedSkills = user.requestedSkills;
  }

  selectColor(color: string) {
    this.myForm.get('color')?.setValue(color);
    document.querySelectorAll('.carre').forEach((element) => {
      element.classList.remove('selected');
    });
    document.querySelector(`.carre.${color}`)?.classList.add('selected');
  }
}

interface User {
  nameProject: string;
  nameOwner: string;
  genre: string;
  usedSkills: string[];
  requestedSkills: string[];
  description: string;
  color: string;
}
