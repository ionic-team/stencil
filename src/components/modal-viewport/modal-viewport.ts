import { Component, Ionic } from '../index';
import { ModalControllerApi, ModalControllerInternalApi, ModalViewControllerApi } from '../../util/interfaces';
import { removeArrayItem } from '../../util/helpers';


@Component({
  tag: 'ion-modal-viewport',
  shadow: false
})
export class ModalViewport implements ModalControllerApi {
  views: ModalViewController[] = [];


  ionViewDidLoad() {
    const modalCtrl = <ModalControllerInternalApi>Ionic.modal;

    if (modalCtrl._create) {
      // [tag/*0*/, data/*1*/, opts/*2*/, 0/*3:modalView*/, 0/*4:shouldPresent*/, 0/*5:shouldDismiss*/, 0/*6:resolve*/, 0/*7:reject*/]
      modalCtrl._create.forEach(q => {
        let viewCtrl: ModalViewController;

        if (q[4]) {
          if (!q[5]) {
            viewCtrl = new ModalViewController(this, q[0], q[1], q[2]);
            presentModal(this, q[6], q[7]);
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

}


export class ModalViewController implements ModalViewControllerApi {

  constructor(private viewport: ModalViewport, tag: string, data: any, opts: any) {
    console.log(`modal: ${tag}, ${data}, ${opts}`);

  }


  present() {
    return new Promise<void>((resolve, reject) => {
      presentModal(this.viewport, resolve, reject);
    });
  }


  dismiss() {
    removeArrayItem(this.viewport.views, this);
    return Promise.resolve();
  }

}


function presentModal(viewport: ModalViewport, resolve: Function, reject: (reason?: any) => void) {
  reject;

  viewport.views.push(this);

  resolve();
}
