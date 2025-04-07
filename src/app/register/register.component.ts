import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports:[FormsModule,CommonModule]
})
export class RegisterComponent {
  user = { username: '', email: '', password: '' , role:''};
  successMessage: string = ''; // To hold success message
  errorMessage: string = ''; // To hold error message

  constructor(private userService: UserService, private router: Router) {}

  register(): void {
    this.successMessage = ''; // Reset success message
    this.errorMessage = ''; // Reset error message

    this.userService.register(this.user).subscribe(
      (response: any) => {
        console.log('User registered successfully');
        alert("You have successfully registered!")
        this.successMessage = 'You have successfully registered! Please log in now.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);  // Redirect after 3 seconds
      },
      (error) => {
        console.error('Error registering user:', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    );
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
