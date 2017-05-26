import { Component, h } from '../index';

@Component({
  tag: 'ion-list-header',
  host: {
    class: 'list-header'
  }
})
export class ListHeader {
  render() {
    return <slot></slot>;
  }
}
