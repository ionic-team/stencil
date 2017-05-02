import { Component } from '../index';


@Component({
  tag: 'ion-backdrop',
  shadow: false
})
export class Backdrop {
  $el: HTMLElement;

  ionViewDidLoad() {
    this.$el.setAttribute('role', 'presentation');
    this.$el.setAttribute('tappable', '');
    this.$el.setAttribute('disable-activated', '');
  }

}
