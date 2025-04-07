import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8888/tasks'; 

  constructor(private http: HttpClient) {}

  getTasksByProject(projectId: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${projectId}`);
  }

  createTask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, task, {responseType: 'text' as 'json'});

  }

  updateTask(taskId: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}`, task,  {responseType: 'text'});
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`,   {responseType: 'text'} );
  }
}
