import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-footer'
})
export class Footer {
  render() {
    return h(this, Ionic.theme(this, 'footer'), h('slot'));
  }
}
