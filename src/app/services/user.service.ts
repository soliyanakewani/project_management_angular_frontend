import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  getTeamMembers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/team-members`);
  }
  
}
