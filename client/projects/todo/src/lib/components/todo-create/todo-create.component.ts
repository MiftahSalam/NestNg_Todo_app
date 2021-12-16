import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DoAction } from 'projects/app-common/src/lib/action';

@Component({
  selector: 'lib-todo-create',
  template: `
    <div class="row my-2 mb-4">
      <div class="col-md-8 offset-md-2">
        <input
          [(ngModel)]="todo"
          (keyup.enter)="onEnter()"
          class="form-control"
          placeholder="Type a Todo and hit Enter"
        />
      </div>
    </div>
  `,
  styles: [],
})
export class TodoCreateComponent implements OnInit {
  todo = '';
  @Output() action: EventEmitter<DoAction> = new EventEmitter();

  constructor() {}

  onEnter() {
    this.action.emit({
      type: 'add-todo',
      payload: this.todo,
    });
    this.todo = '';
  }

  ngOnInit(): void {}
}
