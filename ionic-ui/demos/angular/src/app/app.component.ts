import { Component } from '@angular/core';



@Component({
  selector: 'ion-app',
  templateUrl: 'app.html'
})
export class MyApp {
  color: string;
  num: number;

  constructor() {
    this.toggleVars();
  }

  toggleVars() {
    this.num = Math.round(Math.random() * 100);
    if (this.color === 'dark') {
      this.color = 'primary';
    } else if (this.color === 'primary') {
      this.color = 'secondary';
    } else if (this.color === 'secondary') {
      this.color = 'danger';
    } else {
      this.color = 'dark';
    }
  }
}
