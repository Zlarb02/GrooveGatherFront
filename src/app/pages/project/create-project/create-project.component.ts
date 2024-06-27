import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
})
export class CreateProjectComponent {
  myForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      nameProject: ['', Validators.required],
      nameOwner: ['', Validators.required],
      genre: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      like: ['0'],
    });

    this.ecouter();
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log(this.myForm.value);
      //      const user: User = this.myForm.value;
      //      console.log(user);
    } else {
      console.log('Form is invalid');
    }
  }

  // Méthode pour écouter les changements de valeurs du formulaire
  ecouter() {
    this.myForm.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  update(user: User) {
    this.myForm.setValue({
      nameProject: user.nameProject,
      nameOwner: user.nameOwner,
      genre: user.genre,
      description: user.description,
      date: user.date,
    });
  }
}

// Assurez-vous que la classe User est définie quelque part dans votre code, par exemple :
interface User {
  nameProject: string;
  nameOwner: string;
  genre: string;
  description: string;
  date: string;
}
