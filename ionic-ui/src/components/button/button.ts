import { Directive } from 'ionic-core';


@Directive({
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
