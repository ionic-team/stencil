import { Component } from '../../../../dist/index';

@Component({
  tag: 'shadow-dom-slot-basic',
  styles: `
    :host {
      color: red;
    }
  `,
  shadow: true
})
export class ShadowDomSlotBasic {

}
