import { Component, inject, Input, OnInit } from '@angular/core';
import { TaskService } from '../services/tasks.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  imports: [FormsModule],
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {
  @Input() projectId!: number;  // Accept projectId as input from parent
  task = { name: '', description: '', status: 'To Do', assigned_to: null, project_id: 0, progress: 0 }; 
  // router = inject(Router)

  constructor(
    private taskService: TaskService, 
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (!this.projectId) {
      this.projectId = Number(this.route.snapshot.paramMap.get('projectId')); // Get from URL if not passed as input
    }
    this.task.project_id = this.projectId; 
  }

  saveTask(): void {
    if (!this.task.name || !this.task.description || !this.task.status) {
      alert('All fields are required!');
      return;
    }

    console.log('Creating task with data:', this.task);
 
    this.task.progress = this.task.progress || 0;
    this.taskService.createTask(this.task, this.projectId).subscribe({
      next: (response) => {
        console.log('Task created successfully:', response);
        alert('Task created successfully!');
        setTimeout(() => {
          this.router.navigate([`/tasks/${this.projectId}`]);
        }, 100); // Small delay to ensure alert doesn't interrupt navigation
      },
      error: (err) => {
        console.error('Error creating task:', err);
        alert('Failed to create task. Please try again.');
      }
    });
  }
  
  goToTaskList() {
    this.router.navigate([`/tasks/${this.projectId}`]);
  }
}
