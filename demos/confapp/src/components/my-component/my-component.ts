import { Component } from 'ionic-core';


@Component({
  tag: 'my-component',
  templateUrl: 'my-component.html'
})
export class MyComponent {
  constructor() {
    console.log('MyComponent');
  }
}
