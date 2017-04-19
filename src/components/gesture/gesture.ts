import { Component, Prop } from '../../index';
import { noop } from '../../util/helpers';


@Component({
  tag: 'ion-gesture',
  shadow: false
})
export class Gesture {
  $el: HTMLElement;

  @Prop() direction: string = 'x';
  @Prop() threshold: number = 20;

  @Prop() onStart: Function = noop;
  @Prop() onMove: Function = noop;
  @Prop() onEnd: Function = noop;


  ionViewDidLoad() {
    console.log('ion-gesture');

    this.onStart(true);

    this.onMove()
  }


  ionViewWillUnload() {

  }

}
