import { Component, h, Ionic, Listen, Prop } from '../index';
import { AnimationBuilder, Animation, Loading as ILoading, LoadingEvent } from '../../util/interfaces';

import iOSEnterAnimation from './animations/ios.enter';
import iOSLeaveAnimation from './animations/ios.leave';


@Component({
  tag: 'ion-loading',
  styleUrls: {
    ios: 'loading.ios.scss',
    md: 'loading.md.scss',
    wp: 'loading.wp.scss'
  },
  shadow: false
})
export class Loading implements ILoading {
  $el: HTMLElement;
  animation: Animation;
  durationTimeout: any;

  @Prop() cssClass: string;
  @Prop() content: string;
  @Prop() dismissOnPageChange: boolean = false;
  @Prop() duration: number;
  @Prop() enterAnimation: AnimationBuilder;
  @Prop() exitAnimation: AnimationBuilder;
  @Prop() id: string;
  @Prop() showSpinner: boolean = null;
  @Prop() spinner: string;
  @Prop() showBackdrop: boolean = true;


  @Listen('ionDismiss')
  onDismiss(ev: UIEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dismiss();
  }

  ionViewDidLoad() {
    if (!this.spinner) {
      this.spinner = Ionic.config.get('loadingSpinner', Ionic.config.get('spinner', 'ios'));
    }

    if (this.showSpinner === null || this.showSpinner === undefined) {
      this.showSpinner = !!(this.spinner && this.spinner !== 'hide');
    }

    Ionic.emit(this, 'ionLoadingDidLoad', <LoadingEvent>{ detail: { loading: this } });
  }

  ionViewDidEnter() {
    // blur the currently active element
    const activeElement: any = document.activeElement;
    activeElement && activeElement.blur && activeElement.blur();

    // If there is a duration, dismiss after that amount of time
    if (typeof this.duration === 'number') {
      this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
    }

    Ionic.emit(this, 'ionLoadingDidPresent', <LoadingEvent>{ detail: { loading: this } });
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

    Ionic.emit(this, 'ionLoadingWillPresent', <LoadingEvent>{ detail: { loading: this } });

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
      this.ionViewDidEnter();
      resolve();
    }).play();
  }

  dismiss() {
    clearTimeout(this.durationTimeout);

    if (this.animation) {
      this.animation.destroy();
      this.animation = null;
    }

    return new Promise<void>(resolve => {
      Ionic.emit(this, 'ionLoadingWillDismiss', <LoadingEvent>{ detail: { loading: this } });

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
        Ionic.emit(this, 'ionLoadingDidDismiss', <LoadingEvent>{ detail: { loading: this } });
        Ionic.dom.write(() => {
          this.$el.parentNode.removeChild(this.$el);
        });
        resolve();
      }).play();
    });
  }

  ionViewDidUnload() {
    Ionic.emit(this, 'ionLoadingDidUnload', <LoadingEvent>{ detail: { loading: this } });
  }

  render() {
    let userCssClass = 'loading-content';
    if (this.cssClass) {
      userCssClass += ' ' + this.cssClass;
    }

    const loadingInner: any[] = [];

    if (this.showSpinner) {
      loadingInner.push(
        h('div.loading-spinner',
          h('ion-spinner', {
            props: {
              'name': this.spinner
            }
          })
        )
      );
    }

    if (this.content) {
      loadingInner.push(
        h('div.loading-content', this.content)
      );
    }

    return h(this, Ionic.theme(this, 'loading'),
      [
        h('ion-gesture.loading-backdrop', {
          class: {
            'hide-backdrop': !this.showBackdrop
          },
          props: {
            'attachTo': 'parent',
            'autoBlockAll': true
          }
        }),
        h('div.loading-wrapper', { attrs: { role: 'dialog' } },
          loadingInner
        )
      ]
    );
  }

}
