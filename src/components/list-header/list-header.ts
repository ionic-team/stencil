import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-list-header'
})
export class ListHeader {
  render() {
    return h(this, Ionic.theme(this, 'list-header'), h('slot'));
  }
}
