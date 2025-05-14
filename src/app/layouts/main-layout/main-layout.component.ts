import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  constructor (private router: Router, private userService: UserService) {}
  userRole : string = ''

  ngOnInit() {
    this.userRole = this.userService.getRole();
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.role;
    }

  }
  

  logout():void {
    localStorage.removeItem('token');

    this.router.navigate(['/login']);

  
  }




}
