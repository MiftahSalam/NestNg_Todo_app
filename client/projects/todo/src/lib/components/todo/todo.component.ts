import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoAction } from 'projects/app-common/src/lib/action';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'lib-todo',
  template: `
    <lib-todo-create (action)="doAction($event)"></lib-todo-create>
    <lib-todo-list
      [todos]="todos$ | async"
      (action)="doAction($event)"
    ></lib-todo-list>
  `,
  styles: [],
})
export class TodoComponent implements OnInit {
  todos$: Observable<Todo[]> = new Observable<Todo[]>();
  refresh$ = new BehaviorSubject<any>('');

  constructor(
    private readonly router: Router,
    private readonly todoService: TodoService
  ) {}

  ngOnInit(): void {
    this.todos$ = this.refresh$.pipe(
      switchMap(() => this.todoService.findAll())
    );
  }

  doAction({ type, payload }: DoAction): void {
    switch (type) {
      case 'add-todo':
        this.createTodo(payload);
        break;
      case 'delete-todo':
        this.deleteTodo(payload);
        break;
      default:
        console.log('Unknown action type');
    }
  }

  private createTodo(todo: string): void {
    this.todoService
      .create({ name: todo })
      .subscribe(() => this.refresh$.next(''));
  }
  private deleteTodo(todo: Todo): void {
    if (confirm('Are you sure want to delete this item?')) {
      this.todoService.deleteTodo(todo.id!).subscribe(() => {
        this.refresh$.next('');
        this.router.navigate(['/todo']);
      });
    }
  }
}
