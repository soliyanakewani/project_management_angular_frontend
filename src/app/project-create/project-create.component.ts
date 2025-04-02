import { Component } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css'],
  imports: [FormsModule]
})
export class ProjectCreateComponent {

  project = { name: '', description: '', status: 'New' };

  constructor(private projectService: ProjectService, private router: Router) {}

  createProject(): void {
    // Basic validation before making the request
    if (!this.project.name || !this.project.description) {
      alert("Project Name and Description are required.");
      return;
    }

    this.projectService.createProject(this.project).subscribe(
      () => {
        this.router.navigate(['/projects']);
      },
      (error) => {
        console.error('Error creating project', error);
      }
    );
  }
}
