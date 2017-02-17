import { Component } from 'ionic-core';


@Component({
  selector: 'ion-button'
})
export class Button {
  constructor() {
    console.log('button');
  }

  set tabIndex(value: string) {
    console.log('type');
  }
}
