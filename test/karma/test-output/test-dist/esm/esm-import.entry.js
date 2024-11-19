import { r as registerInstance, f as createEvent, h, g as getElement } from './index-a2c0d171.js';

const esmImportCss = ":host{display:block;padding:20px;border:10px solid rgb(0, 0, 255);color:rgb(128, 0, 128);--color:rgb(0, 128, 0)}p{color:var(--color)}";

const EsmImport = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.someEvent = createEvent(this, "someEvent", 7);
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
    return (h("div", null, h("h1", null, "esm-import"), h("p", { id: "propVal" }, "propVal: ", this.propVal), h("p", { id: "stateVal" }, "stateVal: ", this.stateVal), h("p", { id: "listenVal" }, "listenVal: ", this.listenVal), h("p", null, h("button", { onClick: this.testMethod.bind(this) }, "Test")), h("p", { id: "isReady" }, "componentOnReady: ", this.isReady)));
  }
  get el() { return getElement(this); }
};
EsmImport.style = esmImportCss;

export { EsmImport as esm_import };
