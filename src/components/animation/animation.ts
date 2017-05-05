import { Component, Prop } from '../index';
import { AnimationController } from './animation-controller';


@Component({
  tag: 'ion-animation',
  shadow: false
})
export class Animation {
  private $el: HTMLElement;
  private ctrl: AnimationController;

  @Prop() listenOn: string = 'child';

  ionViewDidLoad() {
    this.ctrl = new AnimationController();

    this.ctrl.element(this.$el);
  }

  ionViewWillUnload() {
    this.ctrl.destroy();
    this.ctrl = null;
  }

}

