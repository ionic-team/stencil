import { Component, h, Ionic } from '../index';
import { IAnimation as Animation } from '../animation/animation-interface';
import { IModal } from './modal-interface';
import { ModalDidEnterEvent } from '../../util/interfaces';


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
  private id: string;
  private animation: Animation;
  private backdrop: any;

  ionViewDidLoad() {
    const ev: ModalDidEnterEvent = {
      detail: {
        modalId: this.id
      }
    };

    Ionic.emit(this, 'ionModalDidLoad', ev);
  }

  transitionIn(done?: Function) {
    done;
    // this.ani.whenReady(() => {
    //   this.ani.onFinish(done, true);

    //   const opts: PlayOptions = {
    //     duration: 100
    //   };

    //   this.ani.play(opts);
    // });
  }

  transitionOut() {

  }

  render() {
    return h(this, [
        h('ion-backdrop', {
          ref: backdrop => this.backdrop = backdrop
        }),

        h('ion-animation', {
          ref: animation => this.animation = animation
        }),

        h('div', Ionic.theme(this, 'modal-wrapper'),
          h('slot')
        ),
      ]
    );
  }

}
