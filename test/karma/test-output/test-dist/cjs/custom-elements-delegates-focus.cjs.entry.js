'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');

const sharedDelegatesFocusCss = ":host{display:block;border:5px solid red;padding:10px;margin:10px}:host(:focus){border:5px solid green}input{display:block;width:100%}";

const CustomElementsDelegatesFocus = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
  }
  render() {
    return (index.h(index.Host, null, index.h("input", null)));
  }
  static get delegatesFocus() { return true; }
};
CustomElementsDelegatesFocus.style = sharedDelegatesFocusCss;

exports.custom_elements_delegates_focus = CustomElementsDelegatesFocus;
