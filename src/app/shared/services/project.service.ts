import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import type { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  http = inject(HttpClient)

  mockProjects: Project[] = [
    {
      name: "test",
      genres: ["Rock", "Jazz"],
      color: "test",
      description: "test",
      date: "test",
      likes: 0,
      skillsPresent: ["Guitare", "Batterie"],
      skillsMissing: ["Basse", "Composition"],
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
    return this.http.get<Project[]>('https://groovegather-api.olprog-a.fr/api/v1/projects')
      .pipe(
        catchError(error => {
          if (error.status === 500) {
            return of(this.mockProjects);
          }
          throw error;
        })
      );
  }

  getProjectById() {

  }
}
