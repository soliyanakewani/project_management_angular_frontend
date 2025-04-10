import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'http://localhost:8888/projects';  
  private apiUrlTask = 'http://localhost:8888/tasks'; 


  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => response.projects) // Extract array from the object
    );
  }

  
  getTasksByProject(projectId: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrlTask}/${projectId}`);
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createProject(project: any): Observable<any> {
    return this.http.post(this.apiUrl, project);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {responseType: 'text'});
  }
  editProject(id: number, projectData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, projectData, {responseType: 'text'}) ;
  }
}
