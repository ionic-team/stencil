import { Component, Ionic } from '../index';


@Component({
  tag: 'ion-app',
  styleUrls: {
    ios: 'app.ios.scss',
    md: 'app.md.scss',
    wp: 'app.wp.scss'
  },
  shadow: false
})
export class App {
  $el: HTMLElement;

  ionViewDidLoad() {
    this.$el.classList.add(Ionic.config.get('mode'));
  }

}
