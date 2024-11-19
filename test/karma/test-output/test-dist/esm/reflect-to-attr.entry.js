import { r as registerInstance, g as getElement } from './index-a2c0d171.js';

const ReflectToAttr = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.str = 'single';
    this.nu = 2;
    this.undef = undefined;
    this.null = null;
    this.bool = false;
    this.otherBool = true;
    this.disabled = false;
    this.dynamicStr = undefined;
    this.dynamicNu = undefined;
  }
  componentDidLoad() {
    this.dynamicStr = 'value';
    this.el.dynamicNu = 123;
  }
  get el() { return getElement(this); }
};

export { ReflectToAttr as reflect_to_attr };
