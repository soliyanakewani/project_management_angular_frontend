import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  constructor (private router: Router) {}

  logout():void {
    localStorage.removeItem('token');

    this.router.navigate(['/login']);

  
  }

}
