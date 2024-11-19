'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const DomReattach = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
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
    return (index.h(index.Host, null, index.h("p", null, "componentWillLoad: ", this.willLoad), index.h("p", null, "componentDidLoad: ", this.didLoad), index.h("p", null, "disconnectedCallback: ", this.didUnload)));
  }
};

exports.dom_reattach = DomReattach;
