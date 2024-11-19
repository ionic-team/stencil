import { h, Host } from '@stencil/core';
export class AngularSlotBinding {
  render() {
    return (h(Host, null, h("slot", null)));
  }
  static get is() { return "slot-ng-if"; }
}
