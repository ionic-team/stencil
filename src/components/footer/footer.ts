import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-footer',
  shadow: false
})
export class Footer {
  render() {
    return h(this, Ionic.theme(this, 'footer'), h('slot'));
  }
}
