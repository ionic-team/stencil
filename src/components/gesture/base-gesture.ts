import { emitEvent } from '../../util/dom';
import { GestureController } from './gesture-controller';


export class BaseGesture {
  el: HTMLElement;
  gestureCtrl: GestureController;


  init(Ionic: any, el: any) {
    console.debug('BaseGesture init');

    if (!Ionic.gestureCtrl) {
      Ionic.gestureCtrl = new GestureController();
    }

    this.gestureCtrl = Ionic.gestureCtrl;

    this.el = el;
  }


  destroy() {
    console.debug('BaseGesture destroy');

    this.gestureCtrl = this.el = null;
  }


  emit(eventName: string, data?: any) {
    emitEvent(document, this.el, eventName, data);
  }

}
