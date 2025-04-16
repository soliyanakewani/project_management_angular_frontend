import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8888'; 

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Decoded payload:", payload); // DEBUG
      localStorage.setItem('userRole', payload.role);
    } catch (e) {
      console.error('Error decoding token:', e);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
  getRole(): string {
    return localStorage.getItem('userRole') || '';

  }
  // getAllUsers(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/users`);
    getAllUsers(): Observable<any> {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
      return this.http.get<any>(`${this.apiUrl}/users`, { headers });
    }
  
  
  getTeamMembers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/team-members`);
  }

  updateUserRole(userId: number, updatedUser: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
  
    return this.http.put(`${this.apiUrl}/users/${userId}`, updatedUser, { headers, responseType: 'text' });
  }
  deleteUser(userId: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
  
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { headers, responseType: 'text' });
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('token'); // or however you store it
    const headers = {
      Authorization: `Bearer ${token}`
    };
  
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }
  
  
  updateProfile(data: { username: string; email: string }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };
  
    return this.http.put(`${this.apiUrl}/profile`, data, { headers, responseType: 'text' });
  }
  
  
  
  
  
}
