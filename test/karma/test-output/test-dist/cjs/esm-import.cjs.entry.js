'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const esmImportCss = ":host{display:block;padding:20px;border:10px solid rgb(0, 0, 255);color:rgb(128, 0, 128);--color:rgb(0, 128, 0)}p{color:var(--color)}";

const EsmImport = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.someEvent = index.createEvent(this, "someEvent", 7);
    this.propVal = 0;
    this.isReady = 'false';
    this.stateVal = undefined;
    this.listenVal = 0;
    this.someEventInc = 0;
  }
  testClick() {
    this.listenVal++;
  }
  async someMethod() {
    this.someEvent.emit();
  }
  testMethod() {
    this.el.someMethod();
  }
  componentWillLoad() {
    this.stateVal = 'mph';
    this.el.componentOnReady().then(() => {
      this.isReady = 'true';
    });
  }
  componentDidLoad() {
    this.el.parentElement.addEventListener('someEvent', () => {
      this.el.propVal++;
    });
  }
  render() {
    return (index.h("div", null, index.h("h1", null, "esm-import"), index.h("p", { id: "propVal" }, "propVal: ", this.propVal), index.h("p", { id: "stateVal" }, "stateVal: ", this.stateVal), index.h("p", { id: "listenVal" }, "listenVal: ", this.listenVal), index.h("p", null, index.h("button", { onClick: this.testMethod.bind(this) }, "Test")), index.h("p", { id: "isReady" }, "componentOnReady: ", this.isReady)));
  }
  get el() { return index.getElement(this); }
};
EsmImport.style = esmImportCss;

exports.esm_import = EsmImport;
