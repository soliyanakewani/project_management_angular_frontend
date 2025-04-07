import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../services/tasks.service';
import { Router, RouterModule } from '@angular/router'; // 🔹 Import RouterModule
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  imports:[RouterModule,CommonModule]
})
export class TaskListComponent implements OnInit {
  @Input() projectId!: number;
  tasks: any[] = [];
  userRole: string = '';
  // router= inject(Router)

  constructor(private taskService: TaskService ,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userRole = this.userService.getRole();
    console.log(this.route.snapshot.paramMap);

    const projectIdFromRoute  = this.route.snapshot.paramMap.get('id');
    // this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Project ID from route:', projectIdFromRoute);


    if (projectIdFromRoute) {
      this.projectId = Number(projectIdFromRoute);
      console.log('Parsed Project ID:', this.projectId);
      this.loadTasks();
    } else {
      console.error('Project ID missing');
    }
    
  }

  loadTasks(): void {
    
    this.taskService.getTasksByProject(this.projectId).subscribe(
      (data) => {
        console.log('Fetched tasks:', data); 
        this.tasks = data},

      (error) => {console.error("Error fetching tasks:",  error);}
    );
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe(() => {
        alert('Task deleted successfully');
        this.loadTasks(); // Refresh task list
      }, error => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task.');
      });
    }
  }
  
}
