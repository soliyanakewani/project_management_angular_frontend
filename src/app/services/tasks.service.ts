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

  createTask(task: any, projectId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${projectId}`, task);

  }

  updateTask(taskId: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}`, task,  {responseType: 'text'});
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`,   {responseType: 'text'} );
  }
  assignUserToTask(taskId: number, userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}/assign`, { userId }, { responseType: 'text' });
  }
  unassignTask(taskId: number) : Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}/unassign`, {}, {responseType: 'text'});
  }
  
}
