import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';  
import { TaskCreateComponent } from '../task-create/task-create.component';
import { TaskListComponent } from '../task-list/task-list.component';


@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
  imports: [CommonModule, RouterModule,TaskCreateComponent,TaskListComponent],  

})
export class ProjectDetailComponent implements OnInit {

  project: any;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectService.getProjectById(+id).subscribe(
        (data) => {
          this.project = data;
        },
        (error) => {
          console.error('Error fetching project', error);
        }
      );
    }
  }
}
