import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  // Inject HttpClient dans le service
  http = inject(HttpClient)

  // Exemple de méthode pour effectuer une requête GET
  getProjects() {
    // Remplacez 'https://api.example.com/projects' par l'URL de votre API
    return this.http.get<Project[]>('https://my.api.mockaroo.com/gg_project.json?key=a42cf530');
  }
}
