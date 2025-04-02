import { Component, inject, Inject, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';  // <-- Import CommonModule (for standalone components)
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  imports: [CommonModule,RouterLink],  // <-- Include CommonModule for directives like *ngIf, *ngFor
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];  // Array to store the projects
  router= inject(Router)
  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();  // Load projects when component initializes
  }

  // Method to fetch projects from backend service
  loadProjects(): void {
    this.projectService.getAllProjects().subscribe(
      (data) => {
        this.projects = data;  // Store the fetched projects in the array
      },
      (error) => {
        console.error('Error loading projects:', error);
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
}
