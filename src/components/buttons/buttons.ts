import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-buttons'
})
export class Buttons {
  render() {
    return h(this, Ionic.theme(this, 'bar-buttons'), h('slot'));
  }
}
