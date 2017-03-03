import { Ionic } from '../utils/global';
import { initProperties } from './init-element';
import { toCamelCase } from '../utils/helpers';
import { Prop } from '../utils/decorators';
import { VNode, VNodeData, Props } from '../utils/interfaces';
import { patchHostElement } from './patch-element';
export { h } from '../renderer/core';
export { VNode, VNodeData, Prop, Props };
import { $css, $obsAttrs, $props } from '../utils/constants';


export class IonElement extends getBaseElement() {
  /** @internal */
  _vnode: VNode;
  /** @internal */
  _q: boolean = true;

  color: string;
  mode: string;


  constructor() {
    super();

    const ctorPrototype = this.constructor.prototype;

    initProperties(this, ctorPrototype[$props]);

    const cssStyles = ctorPrototype[$css];
    if (cssStyles) {
      const api = Ionic().api;
      const tag = api.tag(this);
      if (!api.hasElementCss(tag)) {
        api.appendElementCss(tag, cssStyles);
        delete ctorPrototype[$css];
      }
    }
  }

  connectedCallback() {
    this._q = false;
    this.update();
  }


  static get observedAttributes() {
    const obsAttrs = this.prototype[$obsAttrs] || [];
    // all components have mode and color props
    obsAttrs.push('mode', 'color');
    return obsAttrs;
  }


  static set observedAttributes(attrs: string[]) {
    const existingObsAttrs = this.prototype[$obsAttrs];
    if (existingObsAttrs) {
      Array.prototype.push.apply(existingObsAttrs, attrs);
    } else {
      this.prototype[$obsAttrs] = attrs;
    }
  }


  update() {
    const elm = this;

    // only run patch if it isn't queued already
    if (!elm._q) {
      elm._q = true;

      // run the patch in the next tick
      const ionic = Ionic();
      ionic.api.nextTick(() => {

        // vdom diff and patch the host element for differences
        patchHostElement(ionic.config, ionic.api, ionic.renderer, elm);

        // no longer queued
        elm._q = false;
      });
    }
  }


  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (oldVal !== newVal) {
      (<any>this)[toCamelCase(attrName)] = newVal;
    }
  }

  render(): VNode { return null; };

}


function getBaseElement(): { new(): HTMLElement } {
  if (typeof HTMLElement !== 'function') {
    const BaseElement = function(){};
    BaseElement.prototype = Ionic().api.createElement('div');
    return <any>BaseElement;
  }

  return HTMLElement;
}
