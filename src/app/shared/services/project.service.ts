import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, type Observable, of, throwError } from 'rxjs';
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

  getProjectByName(name: string) {
    return this.http.get<Project>(`${this.baseUrl}/projects/${name}`, { withCredentials: true })
  }

  requestParticipation(projectName: string) {
    return this.http.post(`${this.baseUrl}/projects/request-participation`, { projectName }, { withCredentials: true });
  }

  getUserProjects() {
    return this.http.get<Operation[]>(`${this.baseUrl}/operations/user-projects`, { withCredentials: true })
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }


  getUserAdminProjects() {
    return this.http.get<Operation[]>(`${this.baseUrl}/operations/admin-projects`, { withCredentials: true })
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  getProjectOwner(projectName: string): Observable<any> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return this.http.get<any>(`${this.baseUrl}/operations/project-owner?projectName=${projectName}`, { withCredentials: true });
  }

  getProjectAdmins(projectName: string) {
    return this.http.get<Operation[]>(`${this.baseUrl}/operations/admins?projectName=${projectName}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }

  patchProject(name: string, project: Project): Observable<Project> {
    // Assurez-vous que project.files est défini avant de le mapper
    const formattedProject = {
      ...project,
      files: project.files?.map(file => ({
        id: file.id,
        url: file.url,
        name: file.name,
        isTeaser: file.isTeaser,
        size: file.size
      })) || []  // Si project.files est undefined, utilisez un tableau vide
    };

    return this.http.patch<Project>(`${this.baseUrl}/projects/${name}`, formattedProject, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error updating project:', error);
          return throwError(() => new Error('Failed to update project'));
        })
      );
  }

  uploadFiles(files: File[]): Observable<{ [key: string]: string }> {
    const formData = new FormData();
    // biome-ignore lint/complexity/noForEach: <explanation>
    files.forEach(file => formData.append('files', file));

    return this.http.post<{ [key: string]: string }>(`${this.baseUrl}/files/upload`, formData, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error uploading files:', error);
          return of({});
        })
      );
  }
}