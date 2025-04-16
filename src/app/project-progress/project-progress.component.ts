import { Component, inject, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';  
import { Chart } from 'chart.js/auto';
import { TaskService } from '../services/tasks.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-progress',
  templateUrl: './project-progress.component.html',
  imports: [CommonModule, RouterLink],

})
export class ProjectProgressComponent implements OnInit {
  totalProjects = 0;
  inProgressProjects = 0;
  completedProjects = 0;
  isLoading = true;
  projectChart: any;
  readonly radius = 36;
  readonly circumference = 2 * Math.PI * this.radius;
 
  projects: any[] = [];
  projectProgress: { name: string, progress: number, dashArray: number, dashOffset: number }[] = [];
 
  router=inject(Router) 
  constructor(private projectService: ProjectService, private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadProgressData();
    this.loadProjects();
  }

  loadProjects(): void {
    // this.isLoading = true;
    this.projectService.getAllProjects().subscribe(
      (data) => {
        this.projects = data;
        this.totalProjects = data.length;
        this.completedProjects = data.filter(p => p.status?.toLowerCase() === 'completed').length;
        this.inProgressProjects = data.filter(p => p.status?.toLowerCase() === 'in progress').length;
        this.loadProjectProgressChart(); // Load chart after projects load
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading projects:', error);
        this.isLoading = false;
      }
    );
  }

  async loadProjectProgressChart() {
    const labels: string[] = [];
    const progressData: number[] = [];

    for (const project of this.projects) {
      try {
        const tasks = await this.taskService.getTasksByProject(project.id).toPromise();
        const totalProgress = tasks.reduce((acc: number, task: any) => acc + (task.progress || 0), 0);
        const avgProgress = tasks.length > 0 ? totalProgress / tasks.length : 0;

        labels.push(project.name);
        progressData.push(parseFloat(avgProgress.toFixed(2)));
      } catch (error) {
        console.error(`Failed to load tasks for project ${project.id}`, error);
        labels.push(project.name);
        progressData.push(0);
      }
    }

    // Destroy existing chart if it exists
    if (this.projectChart) {
      this.projectChart.destroy();
    }

    const canvas = document.getElementById('progressChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.projectChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Average Task Progress (%)',
          data: progressData,
          backgroundColor: '#a78bfa',
          borderRadius: 8,
          barThickness: 40
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: {
            label: (ctx) => `${ctx.parsed.y}%`
          }}
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Progress (%)'
            }
          }
        }
      }
    });
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
  goToProjects(status?: string ) {
    const queryParams = status ? { status } : {};
    console.log("received statues: " , status)
    this.router.navigate(['/projects'], { queryParams });
  }
}
