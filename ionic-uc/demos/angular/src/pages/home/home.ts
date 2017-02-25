import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  time: number;

  constructor(public navCtrl: NavController) {
    setInterval(() => {
      this.time = Math.random();
    }, 1000);
  }

}



class MyWebComponent extends HTMLElement {

  constructor() {
    super();
    console.log(`MyWebComponent`);
  }

}


(<any>window).customElements.define('my-wc', MyWebComponent);