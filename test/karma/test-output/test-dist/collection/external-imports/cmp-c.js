import { h } from '@stencil/core';
import { data } from './external-data';
export class ExternalImportB {
  componentWillLoad() {
    this.first = data().first;
    this.last = data().last;
  }
  render() {
    return (h("div", null, this.first, " ", this.last));
  }
  static get is() { return "external-import-c"; }
}
