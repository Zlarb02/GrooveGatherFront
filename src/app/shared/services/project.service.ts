import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Api } from '../models/api';
import type { Operation } from '../models/operation';
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

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  getProjects(sortBy: string, sortDirection: string, filters: any) {
    let params = new HttpParams()
      .set('sortBy', sortBy)
      .set('direction', sortDirection)

    // Add filter parameters to the request
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.keys(filters).forEach(filterKey => {
      if (filters[filterKey].length) {
        params = params.append(filterKey, filters[filterKey].join(','));
      }
    });

    return this.http.get<Project[]>(`${this.baseUrl}/projects`, { params })
      .pipe(
        catchError(error => {
          if (error.status === 500) {
            return of(this.mockProjects);
          }
          throw error;
        })
      );
  }

  getUserProjects() {
    return this.http.get<Operation[]>(`${this.baseUrl}/operations/user-projects`, { withCredentials: true })
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }

  getProjectByName(name: string) {
    return this.http.get<Project>(`${this.baseUrl}/projects/${name}`, { withCredentials: true })
  }

  requestParticipation(projectName: string) {
    return this.http.post(`${this.baseUrl}/projects/request-participation`, { projectName }, { withCredentials: true });
  }
}