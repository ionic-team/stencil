import { IonElement, Component, h, VNode } from '../../element/ion-element';


@Component({
  tag: 'ion-app',
  styleUrl: 'app.css',
  preprocessStyles: [
    'app.scss',
    'app.ios.scss',
    'app.md.scss',
    'app.wp.scss'
  ]
})
export class IonApp extends IonElement {

  render(): VNode {
    return h('.app');
  }

}
