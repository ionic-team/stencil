import { Component, h, Ionic } from '../index';


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

  toggle() {
    console.log('modal toggle');
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
