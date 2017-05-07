import { Component, h, Ionic } from '../index';
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
export class Modal {
  id: string;

  ionViewDidLoad() {
    const ev: ModalDidEnterEvent = {
      detail: {
        modalId: this.id
      }
    };

    Ionic.emit(this, 'ionModalDidLoad', ev);
  }

  render() {
    return h(this,
      h('ion-animation', Ionic.theme(this, 'modal-wrapper', {
        props: {

        }
      }),
        h('slot')
      )
    );
  }

}
