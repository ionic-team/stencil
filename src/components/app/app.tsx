import { Component, h } from '../index';


@Component({
  tag: 'ion-app',
  styleUrls: {
    ios: 'app.ios.scss',
    md: 'app.md.scss',
    wp: 'app.wp.scss'
  },
  shadow: false,
  host: {
    theme: 'app'
  }
})
export class App {
  render() {
    return <slot></slot>;
  }
}
