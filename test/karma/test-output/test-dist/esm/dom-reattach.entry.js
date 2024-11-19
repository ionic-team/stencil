import { r as registerInstance, h, e as Host } from './index-a2c0d171.js';

const DomReattach = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.willLoad = 0;
    this.didLoad = 0;
    this.didUnload = 0;
  }
  componentWillLoad() {
    this.willLoad++;
  }
  componentDidLoad() {
    this.didLoad++;
  }
  disconnectedCallback() {
    this.didUnload++;
  }
  render() {
    return (h(Host, null, h("p", null, "componentWillLoad: ", this.willLoad), h("p", null, "componentDidLoad: ", this.didLoad), h("p", null, "disconnectedCallback: ", this.didUnload)));
  }
};

export { DomReattach as dom_reattach };
