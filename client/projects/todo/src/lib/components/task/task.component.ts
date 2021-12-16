import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DoAction } from 'projects/app-common/src/lib/action';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { combineLatestWith, switchMap, tap } from 'rxjs/operators';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'lib-task',
  template: `
    <lib-task-create (action)="doAction($event)"></lib-task-create>
    <lib-task-list
      [tasks]="tasks$ | async"
      (action)="doAction($event)"
    ></lib-task-list>
  `,
  styles: [],
})
export class TaskComponent implements OnInit {
  tasks$: Observable<Task[]> = new Observable<Task[]>();
  private refresh$ = new BehaviorSubject<any>('');
  private activeRoute$: Observable<Params> = new Observable<Params>();
  private todoId = '';

  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly taskService: TaskService
  ) {}

  ngOnInit(): void {
    console.log(
      'TaskComponent-ngOnInit activeRoute.params',
      this.activeRoute.params
    );
    this.activeRoute$ = this.activeRoute.params;
    this.tasks$ = this.activeRoute$.pipe(
      tap((param: Params) => {
        console.log('TaskComponent-ngOnInit-map param', param);
        return (this.todoId = param['id']);
      }),
      switchMap((param: Params) => {
        console.log('TaskComponent-ngOnInit-switchMap param', param);
        return this.taskService.findAll(param['id']);
      })
    );
    this.tasks$.subscribe();
  }

  doAction({ type, payload }: DoAction) {
    switch (type) {
      case 'add-task':
        this.createTask(payload);
        break;
      case 'delete-task':
        this.deleteTask(payload);
        break;
      default:
        console.log('Unknown action type');

        break;
    }
  }

  private createTask(task: string) {
    this.taskService
      .create(this.todoId, { name: task })
      .subscribe(() => this.refresh$.next(''));
  }
  private deleteTask(task: Task) {
    if (confirm('Are you sure want to delete this item?')) {
      this.taskService
        .deleteTask(task.id!)
        .subscribe(() => this.refresh$.next(''));
    }
  }
}
