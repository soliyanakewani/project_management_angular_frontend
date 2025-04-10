import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ProjectProgressComponent } from './project-progress/project-progress.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch:'full'},

    {
      path: '',
      component:AuthLayoutComponent,
      children:[
        { path: 'register', component: RegisterComponent },
        { path: 'login', component: LoginComponent },
        
      ]
    }, 

    {
      path: '',
    component:MainLayoutComponent,
    children:[
      { path: 'projects', component: ProjectListComponent },
      {path: 'project-progress', component:ProjectProgressComponent },
      { path: 'projects/create', component: ProjectCreateComponent },
      { path: 'projects/:id', component: ProjectDetailComponent },
      { path: 'projectsEdit/:id', component: ProjectEditComponent },
      // { path: '', component: ProjectListComponent },
      { path: 'tasks/:id', component: TaskListComponent },
      { path: 'tasks/edit/:id', component: TaskEditComponent },
      { path: 'tasks/create/:projectId', component:TaskCreateComponent},

    ]
  },
  


  // { path: '', redirectTo: '/login', pathMatch: 'full' },

  // { Path: '', redirectTo: '/tasks', pathMatch= 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
