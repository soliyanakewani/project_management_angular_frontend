import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service'; // Make sure your UserService is correctly imported
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports:[FormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = { username: '', password: '' };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  // Handle form submission
  onSubmit(): void {
    if (this.credentials.username && this.credentials.password) {
      // Call your login service here
      this.userService.login(this.credentials).subscribe(
        (response) => {
          console.log('Login successful');
          const token = response.token;
          this.userService.saveToken(token); 
          // After login, navigate to the projects page or wherever
          this.router.navigate(['/projects']);
        },
        (error) => {
          console.error('Login failed', error);
          // Optionally display an error message for failed login
        }
      );
    } else {
      console.log('Please enter both username and password');
      // Optionally, show an error message here
    }
  }

  // Navigate to the register page
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
