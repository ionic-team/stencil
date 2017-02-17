import { Component } from 'ionic-core';


@Component({
  selector: 'ion-button',
  templateUrl: 'button.html'
})
export class Button {
  constructor() {
    console.log('ion-button');
  }
}
