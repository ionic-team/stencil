import { Component, h, Ionic, Listen, Prop } from '../index';
import { AnimationBuilder, Animation, Modal as IModal, ModalEvent } from '../../util/interfaces';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';


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
  animation: Animation;

  @Prop() component: string;
  @Prop() componentProps: any = {};
  @Prop() cssClass: string;
  @Prop() enableBackdropDismiss: boolean = true;
  @Prop() enterAnimation: AnimationBuilder;
  @Prop() exitAnimation: AnimationBuilder;
  @Prop() id: string;
  @Prop() showBackdrop: boolean = true;

  @Listen('ionDismiss')
  onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  ionViewDidLoad() {
    Ionic.emit(this, 'ionModalDidLoad', <ModalEvent>{ detail: { modal: this } });
  }

  present() {
    return new Promise<void>(resolve => {
      this._present(resolve);
    });
  }

  private _present(resolve: Function) {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    Ionic.emit(this, 'ionModalWillPresent', <ModalEvent>{ detail: { modal: this } });

    // get the user's animation fn if one was provided
    let animationBuilder = this.enterAnimation;

    if (!animationBuilder) {
      // user did not provide a custom animation fn
      // decide from the config which animation to use
      // TODO!!
      animationBuilder = iOSEnterAnimation;
    }

    // build the animation and kick it off
    this.animation = animationBuilder(this.$el);

    this.animation.onFinish(a => {
      a.destroy();
      Ionic.emit(this, 'ionModalDidPresent', <ModalEvent>{ detail: { modal: this } });
      resolve();
    }).play();
  }

  dismiss() {
    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    return new Promise<void>(resolve => {
      Ionic.emit(this, 'ionModalWillDismiss', <ModalEvent>{ detail: { modal: this } });

      // get the user's animation fn if one was provided
      let animationBuilder = this.exitAnimation;

      if (!animationBuilder) {
        // user did not provide a custom animation fn
        // decide from the config which animation to use
        // TODO!!
        animationBuilder = iOSLeaveAnimation;
      }

      // build the animation and kick it off
      this.animation = animationBuilder(this.$el);
      this.animation.onFinish(a => {
        a.destroy();
        Ionic.emit(this, 'ionModalDidDismiss', <ModalEvent>{ detail: { modal: this } });
        Ionic.dom.write(() => {
          this.$el.parentNode.removeChild(this.$el);
        });
        resolve();
      }).play();
    });
  }

  ionViewDidUnload() {
    Ionic.emit(this, 'ionModalDidUnload', <ModalEvent>{ detail: { modal: this } });
  }

  backdropClick() {
    if (this.enableBackdropDismiss) {
      // const opts: NavOptions = {
      //   minClickBlockDuration: 400
      // };
      this.dismiss();
    }
  }

  render() {
    let userCssClass = 'modal-content';
    if (this.cssClass) {
      userCssClass += ' ' + this.cssClass;
    }

    return h(this,
      [
        h('div.modal-backdrop', {
          class: {
            'hide-backdrop': !this.showBackdrop
          },
          on: {
            'click': this.backdropClick.bind(this)
          }
        }),
        h('div', Ionic.theme(this, 'modal-wrapper', { attrs: { role: 'dialog' } }),
          h(this.component, Ionic.theme(this, userCssClass, {
            props: this.componentProps,
          }))
        ),
      ]
    );
  }

}
