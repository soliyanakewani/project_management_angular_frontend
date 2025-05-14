import { Component, inject, Input, OnInit } from '@angular/core';
import { TaskService } from '../services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {
  @Input() taskId!: number;
  projectId!: number;
  task = { name: '', description: '', status: 'To Do', assigned_to: null, project_id: 0, progress: 0 };

  router = inject(Router);

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));

    this.route.queryParams.subscribe(params => {
      this.projectId = Number(params['projectId']) || 0;
      console.log("✅ Project ID received:", this.projectId);
    });

    console.log("id from project",this.projectId)
    this.loadTask();
  }
  
  loadTask(): void {
    this.taskService.getTasksByProject(this.projectId).subscribe((data) => {
      const foundTask = data.find((t: any) => t.id === this.taskId);
      if (foundTask) {
        this.task = { ...foundTask };
        console.log("✅ Task loaded:", this.task);
      } else {
        console.warn("⚠️ Task not found.");
      }
    });
  }
  

  updateStatusBasedOnProgress(progress: number): string {
    if (progress === 0) return 'To Do';
    if (progress > 0 && progress < 100) return 'In Progress';
    if (progress === 100) return 'Done';
    return this.task.status;
  }

  onProgressChange(): void {
    this.task.status = this.updateStatusBasedOnProgress(this.task.progress);
  }

  updateTask(): void {
    if (this.task.progress < 0 || this.task.progress > 100) {
      alert('Progress must be between 0 and 100.');
      return;
    }

    this.task.status = this.updateStatusBasedOnProgress(this.task.progress);

    this.taskService.updateTask(this.taskId, this.task).subscribe({
      next: () => {
        alert('Task Updated');
        this.router.navigate([`/tasks/${this.projectId}`]);
      },
      error: (error) => {
        console.error('Error updating task:', error);
        alert('There was an error updating the task. Please try again.');
      }
    });
  }
}
