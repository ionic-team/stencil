import { Component, Ionic, Listen } from '../index';
import { ModalControllerApi, ModalControllerInternalApi, ModalViewControllerApi } from '../../util/interfaces';


@Component({
  tag: 'ion-modal-viewport',
  shadow: false
})
export class ModalViewport implements ModalControllerApi {
  private $el: HTMLElement;
  _views: {[id: string]: ModalViewController} = {};
  _ids = 0;


  ionViewDidLoad() {
    const modalCtrl = <ModalControllerInternalApi>Ionic.modal;

    if (modalCtrl._create) {
      // [tag/*0*/, data/*1*/, opts/*2*/, 0/*3:modalView*/, 0/*4:shouldPresent*/, 0/*5:shouldDismiss*/, 0/*6:resolve*/, 0/*7:reject*/]
      modalCtrl._create.forEach(q => {
        let viewCtrl: ModalViewController;

        if (q[4]) {
          if (!q[5]) {
            viewCtrl = new ModalViewController(this, q[0], q[1], q[2]);
            viewCtrl.append(q[6], q[7]);
          }

        } else {
          viewCtrl = new ModalViewController(this, q[0], q[1], q[2]);
          q[3].present = viewCtrl.present.bind(viewCtrl);
          q[3].dismiss = viewCtrl.dismiss.bind(viewCtrl);
        }
      });

      delete modalCtrl._create;
    }

    Ionic.modal.create = this.create.bind(this);
  }


  create(tag: string, data?: any, opts?: any) {
    const modalOverlay = new ModalViewController(this, tag, data, opts);

    return modalOverlay;
  }


  append(modalElm: HTMLElement) {
    this.$el.appendChild(modalElm);
  }


  @Listen('ionModalDidLoad')
  viewDidLoad(ev: any) {
    ev.stopPropagation();

    const viewCtrl = this._views[ev.detail.modalId];
    if (viewCtrl) {
      viewCtrl.state = 'entering';

      Ionic.dom.write(() => {
        viewCtrl.startTrans();
      });
    }
  }

}


export class ModalViewController implements ModalViewControllerApi {
  private $el: HTMLElement;
  private presentResolve: Function;
  private presentReject: Function;

  id: string;
  state: string;


  constructor(private viewport: ModalViewport, public tag: string, public data: any, public opts: any) {
    console.log(`modal: ${tag}, ${data}, ${opts}`);

    this.id = `modal-${this.viewport._ids++}`;
    viewport._views[this.id] = this;

    this.state = 'loading';
  }


  present() {
    return new Promise<void>((resolve, reject) => {
      this.append(resolve, reject);
    });
  }


  append(presentResolve: Function, presentReject: Function) {
    this.presentResolve = presentResolve;
    this.presentReject = presentReject;

    const elm = this.$el = document.createElement('ion-modal');
    elm.id = this.id;

    elm.appendChild(document.createElement(this.tag));
    this.viewport.append(elm);
  }


  dismiss() {
    return Promise.resolve();
  }


  startTrans() {
    this.presentResolve();
  }

}
