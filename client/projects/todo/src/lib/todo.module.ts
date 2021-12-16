import { NgModule } from '@angular/core';
import { TodoComponent } from './components/todo/todo.component';
import { TodoHomeComponent } from './todo-home/todo-home.component';
import { AppCommonModule } from 'projects/app-common/src/public-api';
import { TodoCreateComponent } from './components/todo-create/todo-create.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TaskCreateComponent } from './components/task-create/task-create.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskComponent } from './components/task/task.component';

@NgModule({
  declarations: [
    TodoComponent,
    TodoHomeComponent,
    TodoCreateComponent,
    TodoListComponent,
    TaskCreateComponent,
    TaskListComponent,
    TaskComponent,
  ],
  imports: [AppCommonModule],
  exports: [TodoComponent],
})
export class TodoModule {}
