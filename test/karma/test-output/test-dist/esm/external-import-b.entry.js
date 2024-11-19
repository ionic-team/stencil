import { r as registerInstance, h } from './index-a2c0d171.js';
import { s as store } from './external-store-9286228d.js';
import './external-data-e83150db.js';

const ExternalImportB = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  componentWillLoad() {
    const data = store().data;
    this.first = data.first;
    this.last = data.last;
  }
  render() {
    return (h("div", null, this.first, " ", this.last));
  }
};

export { ExternalImportB as external_import_b };
