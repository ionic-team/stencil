import { Component, h } from '../index';


@Component({
  tag: 'ion-buttons',
  host: {
    theme: 'bar-buttons'
  }
})
export class Buttons {
  render() {
    return <slot></slot>;
  }
}
