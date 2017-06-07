import { Component, h, State } from '../index';


@Component({
  tag: 'ion-child'
})
export class Child {
  @State() msg = 'child ' + Math.random().toString();

  update() {
    console.log('child update');
    this.msg = 'child ' + Math.random().toString();
  }

  render() {
    return h('div', [
      h('child-div', [
        h('slot'),
        h('button', {
          on: {
            click: this.update.bind(this)
          }
        }, 'Child Update')
      ]),
      h('div', this.msg),
    ]);
  }

}
