import { Component, h, Ionic } from '../index';


@Component({
  tag: 'ion-list-header',
  host: {
    class: 'list-header'
  }
})
export class ListHeader {
  render() {
    return h('slot');
  }
}
