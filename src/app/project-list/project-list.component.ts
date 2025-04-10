import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';  
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { Chart } from 'chart.js/auto';
import { TaskService } from '../services/tasks.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  imports: [CommonModule, RouterLink],
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];  
  userRole: string = ''; 
  totalProjects = 0;
  inProgressProjects = 0;
  completedProjects = 0;
  isLoading = true;
  router = inject(Router);
  projectChart: any;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.userRole = this.userService.getRole();
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
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

  viewProject(id: number): void {
    console.log('Viewing project with ID:', id);
  }

  deleteProject(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;

    this.projectService.deleteProject(id).subscribe(
      (res: any) => {
        console.log('Project deleted', res);
        this.loadProjects();
      },
      (error) => {
        console.error('Error deleting project:', error);
      }
    );
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
