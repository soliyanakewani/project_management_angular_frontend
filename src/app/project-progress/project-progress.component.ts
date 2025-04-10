import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-project-progress',
  templateUrl: './project-progress.component.html',
  imports: [CommonModule],

})
export class ProjectProgressComponent implements OnInit {

  readonly radius = 36;
  readonly circumference = 2 * Math.PI * this.radius;
 
  projects: any[] = [];
  projectProgress: { name: string, progress: number, dashArray: number, dashOffset: number }[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProgressData();
  }

  loadProgressData() {
    this.projectService.getAllProjects().subscribe((projects) => {
      this.projects = projects;
      this.projectProgress = [];

      projects.forEach((project) => {
        this.projectService.getTasksByProject(project.id).subscribe((tasks) => {
          const progressValues = tasks
            .filter((task: { progress: null | undefined; }) => task.progress !== null && task.progress !== undefined)
            .map((task: { progress: any; }) => task.progress);

          const average = progressValues.length
            ? Math.round(progressValues.reduce((a: any, b: any) => a + b, 0) / progressValues.length)
            : 0;

         const offset = this.circumference * (1- average / 100);

          this.projectProgress.push({
            name: project.name,
            progress: average,
            dashArray: this.circumference,
            dashOffset: offset

          });

          this.projectProgress = [...this.projectProgress]; // Trigger change detection
        });
      });
    });
  }
}
