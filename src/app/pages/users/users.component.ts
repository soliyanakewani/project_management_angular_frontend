import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  // standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  imports: [CommonModule, FormsModule]

})
export class UsersComponent implements OnInit {
  users:any[] = [];
  isLoading = true;

  showEditModal = false;
  selectedUser: any = null;
  selectedRole: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
      this.userService.getAllUsers().subscribe({
        next: (res ) => {
          console.log('Fetched users:', res.users); // 👈 Add this

          this.users = res.users;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });

  }
  openEditRoleModal(user: any):void {
    this.selectedUser = user;
    this.selectedRole = user.role;
    this.showEditModal = true;
  }
  cancelEdit():void {
    this.showEditModal = false;
    this.selectedUser = null;
    this.selectedRole = '';
  }
  updateUserRole(): void {
    if (!this.selectedUser) return;

    const updatedUser= { ...this.selectedUser, role: this.selectedRole};
    this.userService.updateUserRole(this.selectedUser.id, updatedUser).subscribe({
      next: () => {
        this.showEditModal = false;
        this.fetchUsers();
      },
      error: (error) => {
        console.error('Failed to update role: ', error);
      }
    });
  }

  deleteUser(userId: number): void {
    if(confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.fetchUsers();
        },
        error: (error) => {
          console.error('Failed to delete user: ', error);
        }
      });
    }
  }
}



