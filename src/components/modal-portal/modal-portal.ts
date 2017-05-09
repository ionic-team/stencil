import { Component, Ionic, Listen } from '../index';
import { ModalControllerApi, ModalControllerInternalApi, ModalOptions, Modal } from '../../util/interfaces';


@Component({
  tag: 'ion-modal-portal',
  styleUrls: {
    // modes all sharing the same scss on purpose
    // this allows ion-modal-viewport and ion-modal
    // components to be bundled in the same file/request
    ios: 'modal-portal.scss',
    md: 'modal-portal.scss',
    wp: 'modal-portal.scss'
  },
  shadow: false
})
export class ModalPortal implements ModalControllerApi {
  private ids = 0;
  private modalResolves: {[modalId: string]: Function} = {};


  ionViewDidLoad() {
    const modalCtrl = <ModalControllerInternalApi>Ionic.modal;

    const createQueue = modalCtrl._create;
    if (createQueue) {
      var modalElm;

      // tag/*0*/, data/*1*/, opts/*2*/, resolve/*3:create.resolve*/
      for (var i = 0; i < createQueue.length; i += 4) {
        modalElm = this.generate(createQueue[i], createQueue[i + 1], createQueue[i + 2]);
        this.modalResolves[modalElm.id] = createQueue[i + 3];
        document.body.appendChild(<any>modalElm);
      }

      delete modalCtrl._create;
    }

    // replace the stubbed modal#create with the actual one
    Ionic.modal.create = this.create.bind(this);
  }


  create(component: string, params?: any, opts?: ModalOptions) {
    const modalElm = this.generate(component, params, opts);

    // append the modal element to the document body
    document.body.appendChild(<any>modalElm);

    // store the resolve function to be called later up when the modal loads
    return new Promise<Modal>(resolve => {
      this.modalResolves[modalElm.id] = resolve;
    });
  }


  private generate(userComponent: string, params: any, opts: ModalOptions) {
    // create ionic's wrapping ion-modal component
    const modal: Modal = document.createElement<any>('ion-modal');

    const id = this.ids++;

    // give this modal a unique id
    modal.id = `modal-${id}`;
    modal.style.zIndex = (10000 + id);
    modal.component = userComponent;
    modal.params = params;

    // convert the passed in modal options into props
    // that get passed down into the new modal
    if (opts) {
      Object.assign(modal, opts);
    }

    return modal;
  }


  @Listen('body:ionModalDidLoad')
  viewDidLoad(ev: any) {
    const modal = ev.detail.modal;
    if (modal) {
      const modalResolve = this.modalResolves[modal.id];
      if (modalResolve) {
        modalResolve(modal);
        delete this.modalResolves[modal.id];
      }
    }
  }

}
