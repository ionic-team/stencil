import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-header'
})
export class Header {
  render() {
    return h(this, Ionic.theme(this, 'header'), h('slot'));
  }
}
