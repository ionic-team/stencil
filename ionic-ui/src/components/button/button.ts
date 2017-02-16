import { Component, Input, Output } from 'ionic-core';


@Component({
  selector: 'ion-button',
  templateUrl: 'button.html'
})
export class Button {
  constructor() {
    console.log('button');
  }

  @Input()
  set tabIndex(value: string) {
    console.log('type');
  }
}
