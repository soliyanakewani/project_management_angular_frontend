import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/tasks.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-tasks',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.css'
})
export class MyTasksComponent implements OnInit {
  tasks: any[] = [];
  userId: number = 0;

  constructor(private taskService: TaskService, private userService: UserService) {}

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.loadUserTasks();
      },
      error: (err) => {
        console.error('Failed to load profile', err);
      }
    });
  }

  loadUserTasks() {
    this.taskService.getTasksByUser(this.userId).subscribe({
      next: (tasks) => 
        { console.log("Tasks received:", tasks);
          this.tasks = tasks;
        },
      error: (err) => {console.error('Failed to load tasks', err);
      }
    });
  }
}
