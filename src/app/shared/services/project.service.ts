import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Api } from '../models/api';
import type { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  http = inject(HttpClient)

  api = new Api();
  baseUrl = this.api.local

  mockProjects: Project[] = [
    {
      name: "404 Not Found",
      genres: ["Jazz"],
      color: "red",
      description: "Il n'y a pas de réel projet ici désolé !",
      date: "Now",
      likes: 9999999,
      skillsPresent: ["Piano", "Batterie"],
      skillsMissing: ["Basse", "Composition"],
      id: 0
    }
  ]

  // sendProjects() {

  //   return this.http.post<Project[]>('http://localhost:8080/api/v1/projects', )
  //     .pipe(
  //       catchError(error => {
  //         if (error.status === 500) {
  //           return of(
  //             {
  //               name: "test",
  //               genres: ["test", "test"],
  //               color: "test",
  //               description: "test",
  //               date: "test",
  //               likes: 0,
  //               skillsPresent: ["test", "test"],
  //               skillsMissing: ["test", "test"],
  //             }
  //           );
  //         }
  //         throw error;
  //       })
  //     );
  // }

  getProjects() {
    return this.http.get<Project[]>(`${this.baseUrl}/projects`)
      .pipe(
        catchError(error => {
          if (error.status === 500) {
            return of(this.mockProjects);
          }
          throw error;
        })
      );
  }

  getProjectByName(name: string) {
    return this.http.get<Project>(`${this.baseUrl}/projects/${name}`)
  }
}