import { Component } from '../../../../dist';

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
