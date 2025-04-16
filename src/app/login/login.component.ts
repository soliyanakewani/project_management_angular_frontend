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
      //  login service
      this.userService.login(this.credentials).subscribe(
        (response) => {
          console.log('Login successful');
          const token = response.token;
          this.userService.saveToken(token); 

          this.router.navigate(['/project-progress']);
        },
        (error) => {
          console.error('Login failed', error);
          
        }
      );
    } else {
      console.log('Please enter both username and password');
     
    }
  }

  
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
