import { Component, h, State } from '../index';


@Component({
  tag: 'ion-parent'
})
export class Parent {
  @State() msg = 'parent ' + Math.random().toString();

  update() {
    console.log('parent update');
    this.msg = 'parent ' + Math.random().toString();
  }

  render() {
    return h('div', [
      h('ion-child', [
        h('parent-div', this.msg),
        h('slot'),
        h('button', {
          on: {
            click: this.update.bind(this)
          }
        }, 'Parent Update')
      ])
    ]);
  }

}
