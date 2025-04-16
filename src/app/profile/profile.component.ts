import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service'; // or your actual service

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  user = { username: '', email: '', role: '' };
  editField: 'username' | 'email' | null = null;

  constructor(
    private http: HttpClient,
    private userService: UserService // ✅ Fix: add access modifier to make it a property
  ) {}

  ngOnInit() {
    this.loadProfile(); // ✅ Only call your service
  }

  loadProfile() {
    console.log("Fetching profile...");

    this.userService.getProfile().subscribe({
      next: (res: { username: string; email: string; role: string }) => {
        this.user = res;
      },
      error: (err: any) => console.error('Failed to fetch profile', err)
    });
  }

  updateProfile() {
    const updatedData = {
      username: this.user.username,
      email: this.user.email
    };

    this.userService.updateProfile(updatedData).subscribe({
      next: () => {
        alert('✅ Profile updated!');
        this.editField = null;
        this.loadProfile(); // Refresh with new data
      },
      error: (err) => {console.error('❌ Failed to update profile', err);}
      
    });
  }

  cancelEdit() {
    this.editField = null;
    this.loadProfile(); // Reset unsaved changes
  }
 
  
}
