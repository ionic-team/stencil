import { h } from '@stencil/core';
import { store } from './external-store';
export class ExternalImportB {
  componentWillLoad() {
    const data = store().data;
    this.first = data.first;
    this.last = data.last;
  }
  render() {
    return (h("div", null, this.first, " ", this.last));
  }
  static get is() { return "external-import-b"; }
}
