import { Component } from 'ionic-core';


@Component({
  selector: 'ion-button',
  templateUrl: 'button.html'
})
export class Button {
  title: string;
  color: string = 'primary';
  firstName = 'Ellie';
  lastName = 'Mae';

  constructor() {
    console.log('ion-button');

    this.title = Math.random().toString();

    setInterval(() => {
      this.title = Math.random().toString();
    }, 2000);

  }

  get fullName() {
    return this.firstName + ' ' + this.lastName;
  }

  someMethod() {
    console.log('someMethod');
  }
}
