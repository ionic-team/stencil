import { Component, Ionic, Listen } from '../index';
import { ModalControllerApi, ModalControllerInternalApi, ModalEvent, ModalOptions, Modal } from '../../util/interfaces';


@Component({
  tag: 'ion-modal-controller',
  styleUrls: {
    // modes all sharing the same scss on purpose
    // this allows ion-modal-viewport and ion-modal
    // components to be bundled in the same file/request
    ios: 'modal-controller.scss',
    md: 'modal-controller.scss',
    wp: 'modal-controller.scss'
  },
  shadow: false
})
export class ModalController implements ModalControllerApi {
  private ids = 0;
  private modalResolves: {[modalId: string]: Function} = {};
  private modals: Modal[] = [];

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
  viewDidLoad(ev: ModalEvent) {
    console.log(ev.type)
    const modal = ev.detail.modal;
    const modalResolve = this.modalResolves[modal.id];
    if (modalResolve) {
      modalResolve(modal);
      delete this.modalResolves[modal.id];
    }
  }


  @Listen('body:ionModalWillPresent')
  willPresent(ev: ModalEvent) {
    console.log(ev.type)
    this.modals.push(ev.detail.modal);
  }


  @Listen('body:ionModalWillDismiss, body:ionModalWillUnload')
  willDismiss(ev: ModalEvent) {
    console.log(ev.type)
    const index = this.modals.indexOf(ev.detail.modal);
    if (index > -1) {
      this.modals.splice(index, 1);
    }
  }


  @Listen('body:keyup.escape')
  escapeKeyUp(ev) {
    console.log(ev.type)
    const lastModal = this.modals[this.modals.length - 1];
    if (lastModal) {
      lastModal.dismiss();
    }
  }

}
