import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'projects/auth/src/lib/auth.guard';
import { LoginComponent } from 'projects/auth/src/public-api';
import { TaskComponent } from 'projects/todo/src/lib/components/task/task.component';
import { TodoHomeComponent } from 'projects/todo/src/lib/todo-home/todo-home.component';
import { HomeComponent } from './shared/home/home.component';
import { MasterComponent } from './shared/master/master.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'todo',
        component: TodoHomeComponent,
        children: [
          {
            path: 'task/:id',
            component: TaskComponent,
          },
        ],
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
