import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8888'; // Your backend URL

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
    // const token = this.getToken();
    // if (!token) return '';

    // try {
    //   const payload = JSON.parse(atob(token.split('.')[1]));
    //   return payload.role || '';  // assumes JWT contains a `role` field
    // } catch (e) {
    //   console.error('Failed to parse token:', e);
    //   return '';
    // }
  }
  getTeamMembers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/team-members`);
  }
  
}
