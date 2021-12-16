import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DoAction } from 'projects/app-common/src/lib/action';
import { Task } from '../../models/task.model';

@Component({
  selector: 'lib-task-list',
  template: `
    <div *ngIf="!tasks?.length; else show"><p>No tasks yet</p></div>
    <ng-template #show>
      <div class="list-group">
        <div
          *ngFor="let task of tasks; let i = index; trackBy: trackByFn"
          class="tasks"
        >
          <div class="action">
            <button
              (click)="doAction(task)"
              class="btn btn-danger btn-lg"
              title="Delete {{ task?.name }}"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="task">
            <div class="list-group-item">({{ i + 1 }}) {{ task.name }}</div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .tasks {
        display: flex;
        justify-content: center;
      }
      .tasks .task {
        flex-grow: 1;
        flex-shrink: 0;
      }
      .tasks .action {
        margin-right: 5px;
      }
    `,
  ],
})
export class TaskListComponent implements OnInit {
  @Input() tasks: Task[] | null = [];
  @Output() action: EventEmitter<DoAction> = new EventEmitter<DoAction>();

  constructor() {}

  ngOnInit(): void {
    console.log('TaskListComponent-ngOnInit tasks', this.tasks);
  }

  trackByFn(index: number, item: Task) {
    return index;
  }
  doAction(task: Task) {
    this.action.emit({
      type: 'delete-task',
      payload: task,
    });
  }
}
