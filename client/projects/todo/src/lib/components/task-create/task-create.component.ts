import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DoAction } from 'projects/app-common/src/lib/action';

@Component({
  selector: 'lib-task-create',
  template: `
    <div class="row my-2 mb-4">
      <div class="col-md-8 offset-md-2">
        <input
          [(ngModel)]="task"
          (keyup.enter)="onEnter()"
          class="form-control"
          placeholder="Type a Task and hit enter"
        />
      </div>
    </div>
  `,
  styles: [],
})
export class TaskCreateComponent implements OnInit {
  @Output() action: EventEmitter<DoAction> = new EventEmitter<DoAction>();
  task = '';

  constructor() {}

  ngOnInit(): void {}

  onEnter() {
    this.action.emit({
      type: 'add-task',
      payload: this.task,
    });
    this.task = '';
  }
}
