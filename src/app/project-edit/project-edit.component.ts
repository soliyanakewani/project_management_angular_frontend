import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  imports: [FormsModule],
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {
  project: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectService.getProjectById(+id).subscribe(
        (data) => (this.project = data),
        (error) => console.error('Error fetching project', error)
      );
    }
  }

  updateProject(): void {
    this.projectService.editProject(this.project.id, this.project).subscribe(
      () => {
        console.log('Project updated successfully');
        this.router.navigate(['/projects']); // Redirect to project list
      },
      (error) => console.error('Error updating project', error)
    );
  }
}
