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
  task = { name: '', description: '', status: 'To Do', assigned_to: null, project_id: 0 }; // Added `project_id`
  router = inject(Router)

  constructor(
    private taskService: TaskService, 
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (!this.projectId) {
      this.projectId = Number(this.route.snapshot.paramMap.get('projectId')); // Get from URL if not passed as input
    }
    this.task.project_id = this.projectId; // Ensure task has the correct project_id
  }

  saveTask(): void {
    if (!this.task.name || !this.task.description || !this.task.status) {
      alert('All fields are required!');
      return;
    }

    this.task.project_id = this.projectId; // Assign project_id before sending request

    this.taskService.createTask(this.task).subscribe(
      (response: any) => {
      alert('Task Created');
      this.router.navigate([`/tasks/${this.projectId}`]); 
      },
      (error: any) => {
        console.error('error creating task:', error);
        alert('failed to create task. try again')
  }
    );
  }
}
