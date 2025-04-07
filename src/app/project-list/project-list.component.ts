import { Component, inject, Inject, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';  // <-- Import CommonModule (for standalone components)
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  imports: [CommonModule,RouterLink],  // <-- Include CommonModule for directives like *ngIf, *ngFor
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];  // Array to store the projects
  userRole: string = ''; 
  router= inject(Router)
  constructor(
    private projectService: ProjectService,
    private userService: UserService) {}

  ngOnInit(): void {
    this.userRole = this.userService.getRole();
    console.log("role",this.userRole);
    this.loadProjects();  // Load projects when component initializes
  }

totalProjects = 0;
inProgressProjects = 0;
completedProjects = 0;

  // Method to fetch projects from backend service
  isLoading = true;
  loadProjects(): void {
    this.isLoading = true;
    this.projectService.getAllProjects().subscribe(
      (data) => {
        this.projects = data;  // Store the fetched projects in the array
        this.totalProjects = data.length;
        this.completedProjects = data.filter(p => p.status?.toLowerCase() === 'completed').length;
        this.inProgressProjects = data.filter(p => p.status?.toLowerCase() === 'in progress').length;
        this.isLoading= false;
      },
      (error) => {
        console.error('Error loading projects:', error);
        this.isLoading= false;

      }
    );
  }

  // Method to view project details (currently logs the project ID)
  viewProject(id: number): void {
    console.log('Viewing project with ID:', id);
    // this.router.navigateByUrl(`/projects}/${id}`)
    // Implement your logic to view project details, 
    // such as navigating to a new route or opening a modal
  }

  // Method to delete a project
  deleteProject(id: number): void {
    const confirmed = confirm('are you sure you want to delete this project?');
    if (!confirmed) return;

    this.projectService.deleteProject(id).subscribe(
      (res:any) => {
        console.log('Project deleted', res);
        this.loadProjects();  // Reload the list after successful deletion
      },
      (error) => {
        console.error('Error deleting project:', error);
      }
    );
  }
  logout(): void {
    // Assuming you have a userService with logout logic
    this.userService.logout();
    this.router.navigate(['/login']);
  }
  
}
