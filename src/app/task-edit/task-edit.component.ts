import { Component, inject, Input, OnInit } from '@angular/core';
import { TaskService } from '../services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  imports: [FormsModule,CommonModule],
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {
  @Input() taskId!: number;
  projectId!: number;
  task: any = {};
router=inject(Router);
  constructor(
    private taskService: TaskService, 
    private route: ActivatedRoute,
    // private router: Router
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
    this.taskService.getTasksByProject(this.taskId).subscribe((data) => {
      this.task = data.find((t: any) => t.id === this.taskId) || {};
    });
  }

  updateTask(): void {
    this.taskService.updateTask(this.taskId, this.task).subscribe(() => {
      alert('Task Updated');
      this.router.navigate([`/tasks/${this.projectId}`]);  

        },
    (error) => {
      console.error('Error updating task:', error)
      alert('there was error updating the task. please try again');
    } 
  );
  }
}
