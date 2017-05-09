import { Component, h, Ionic, Prop } from '../index';
import { AnimationFactory, Modal as IModal } from '../../util/interfaces';
import iOSEnter from './animations/ios.enter';


@Component({
  tag: 'ion-modal',
  styleUrls: {
    ios: 'modal.ios.scss',
    md: 'modal.md.scss',
    wp: 'modal.wp.scss'
  },
  shadow: false
})
export class Modal implements IModal {
  $el: HTMLElement;
  id: string;

  @Prop() component: string;
  @Prop() cssClass: string;
  @Prop() enableBackdropDismiss: boolean = true;
  @Prop() enterAnimation: AnimationFactory;
  @Prop() exitAnimation: AnimationFactory;
  @Prop() params: any;
  @Prop() showBackdrop: boolean = true;


  ionViewDidLoad() {
    const ev = { detail: { modal: this } };
    Ionic.emit(this, 'ionModalDidLoad', ev);
  }

  present() {
    return new Promise<void>(resolve => {
      this._present(resolve);
    });
  }

  private _present(resolve: Function) {
    // get the user's animation fn if one was provided
    let animationFactory = this.enterAnimation;

    if (!animationFactory) {
      // user did not provide a custom animation fn
      // decide from the config which animation to use
      // TODO!!
      animationFactory = iOSEnter;
    }

    // build the animation and kick it off
    let animation = animationFactory(this.$el);
    animation.onFinish(resolve);
    animation.destroyOnFinish(true);
    animation.play();
  }

  dismiss() {

  }

  render() {
    let userCssClass = 'modal-content';
    if (this.cssClass) {
      userCssClass += ' ' + this.cssClass;
    }

    return h(this, [
        h('div.modal-backdrop'),
        h('div', Ionic.theme(this, 'modal-wrapper'),
          h(this.component, Ionic.theme(this, userCssClass))
        ),
      ]
    );
  }

}
