import { Component, Ionic, Prop } from '../../index';
import { BaseGesture } from './base-gesture';
import { PanGesture } from './pan-gesture';


@Component({
  tag: 'ion-gesture',
  shadow: false
})
export class Gesture {
  gesture: BaseGesture = null;
  $el: HTMLElement;

  @Prop() type: string = 'pan';
  @Prop() direction: string = 'x';
  @Prop() threshold: number = 20;


  ionViewDidLoad() {
    console.log('ion-gesture');

    switch (this.type) {
      case 'pan':
        this.gesture = new PanGesture();
        break;

      default:
        console.log(`invalid gesture type: ${this.type}`);
        break;
    }

    this.gesture && this.gesture.init(Ionic, this.$el);
  }

  ionViewWillUnload() {
    this.gesture && this.gesture.destroy();
  }

}
