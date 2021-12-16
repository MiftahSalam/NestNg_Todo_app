import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="row text-center">
      <div class="col-md-12">
        <h2 class="">Welcome to Todozz App!</h2>
        <p>Here you can manage your Todo List in a breeze!</p>
      </div>
    </div>
  `,
  styles: [],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
